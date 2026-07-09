import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const isLocal =
  process.env.LOCAL === "true" || process.env.NODE_ENV === "development";

function getSecret() {
  const raw = process.env.JWT_SECRET;
  if (raw) return new TextEncoder().encode(raw);
  if (isLocal) return new TextEncoder().encode("dev-only-secret");
  throw new Error("JWT_SECRET não configurado. Defina a variável de ambiente.");
}

const secret = getSecret();
const COOKIE = "admin_session";

export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function setSession(): Promise<void> {
  const token = await createToken();
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    priority: "high",
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
