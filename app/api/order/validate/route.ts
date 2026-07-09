import { NextResponse } from "next/server";
import { getAdminProducts, getAdminPromotions, getAdminSettings, getAdminOrders, saveAdminOrders } from "@/lib/admin-storage";
import { Order } from "@/lib/types";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(ip, { max: 3, windowMinutes: 15 }, "order-validate")) {
    return NextResponse.json(
      { valid: false, error: "Muitos pedidos. Tente novamente em 15 minutos." },
      { status: 429 },
    );
  }

  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > 100_000) {
    return NextResponse.json({ valid: false, error: "Requisição muito grande" }, { status: 413 });
  }

  try {
    const body = await req.json();
    const { products, couponCode, nome, mode, pagamento, bairro, rua, numero, referencia, observacoes } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ valid: false, error: "Carrinho vazio" }, { status: 400 });
    }

    const [allProducts, allPromotions, settings] = await Promise.all([
      getAdminProducts(),
      getAdminPromotions(),
      getAdminSettings(),
    ]);

    const today = new Date().toISOString().slice(0, 10);

    const validatedItems = products.map((item: { productId: string; variantLabel?: string; quantity: number }) => {
      const product = allProducts.find((p) => p.id === item.productId);
      if (!product) {
        return { productName: "Produto não encontrado", variantLabel: item.variantLabel, price: 0, quantity: 1, subtotal: 0 };
      }

      let price = product.price;
      let label = item.variantLabel;

      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find((v) => v.label === item.variantLabel);
        if (!variant) {
          const first = product.variants[0];
          price = first.price;
          label = first.label;
        } else {
          price = variant.price;
        }
      }

      const promo = allPromotions.find(
        (p) =>
          p.active &&
          p.type === "direct" &&
          p.productId === product.id &&
          (!p.validUntil || p.validUntil >= today),
      );

      if (promo && promo.newPrice !== undefined) {
        price = promo.newPrice;
      }

      const qty = Math.max(1, Math.floor(item.quantity));

      return {
        productName: product.name,
        variantLabel: label,
        price,
        quantity: qty,
        subtotal: price * qty,
      };
    });

    const subtotal = validatedItems.reduce((sum: number, i: { subtotal: number }) => sum + i.subtotal, 0);
    let discountPercent = 0;

    if (couponCode) {
      const code = String(couponCode).trim().toUpperCase();
      const coupon = allPromotions.find(
        (p) =>
          p.active &&
          p.type === "coupon" &&
          p.couponCode === code &&
          (!p.validUntil || p.validUntil >= today),
      );
      if (coupon && coupon.discountPercent) {
        discountPercent = coupon.discountPercent;
      }
    }

    const total = subtotal - (subtotal * discountPercent) / 100;

    const now = new Date();
    const orderId = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;
    const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const order: Order = {
      id: orderId,
      date: now.toISOString(),
      nome: typeof nome === "string" && nome.trim() ? nome.trim() : "Cliente",
      items: validatedItems,
      subtotal,
      discountPercent,
      couponCode: discountPercent > 0 ? couponCode?.toUpperCase() : undefined,
      total,
      mode: mode === "entrega" ? "entrega" : "retirada",
      pagamento: typeof pagamento === "string" ? pagamento : "pix",
      observacoes: typeof observacoes === "string" && observacoes.trim() ? observacoes.trim() : undefined,
      status: "pendente",
      ip,
    };

    if (mode === "entrega") {
      order.endereco = {
        bairro: typeof bairro === "string" ? bairro : "",
        rua: typeof rua === "string" ? rua : "",
        numero: typeof numero === "string" ? numero : "",
        referencia: typeof referencia === "string" && referencia.trim() ? referencia.trim() : undefined,
      };
    }

    let periodOrders: Order[];
    try { periodOrders = await getAdminOrders(period); } catch { periodOrders = []; }
    periodOrders.unshift(order);
    await saveAdminOrders(periodOrders, period);

    return NextResponse.json({
      valid: true,
      orderId,
      items: validatedItems,
      subtotal,
      discountPercent,
      couponCode: discountPercent > 0 ? couponCode?.toUpperCase() : undefined,
      total,
      name: settings.name,
      whatsapp: settings.whatsapp,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Erro ao validar pedido" }, { status: 500 });
  }
}
