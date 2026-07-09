import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar.client";
import Footer from "@/components/layout/Footer";
import CartWrapper from "@/components/cart/CartWrapper.client";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <CartWrapper>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </CartWrapper>
  );
}
