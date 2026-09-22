import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const COOKIE = "gmp_customer";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  return process.env.ADMIN_TOKEN || process.env.CUSTOMER_SESSION_SECRET || "gmp-dev-secret";
}

function sign(id: string) {
  return createHmac("sha256", secret()).update(id).digest("base64url");
}

function makeToken(id: string) {
  return `${id}.${sign(id)}`;
}

function verifyToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot < 1) return null;
  const id = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(id);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return id;
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

export type SessionCustomer = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  discountPct: number;
  mustChangePassword: boolean;
};

/** Reads and validates the customer session cookie; returns the active customer or null. */
export async function getCustomer(): Promise<SessionCustomer | null> {
  try {
    const token = (await cookies()).get(COOKIE)?.value;
    if (!token) return null;
    const id = verifyToken(token);
    if (!id) return null;
    const c = await db.customer.findUnique({ where: { id } });
    if (!c || !c.isActive) return null;
    return { id: c.id, name: c.name, email: c.email, company: c.company, discountPct: c.discountPct, mustChangePassword: c.mustChangePassword };
  } catch {
    return null;
  }
}

export async function setCustomerSession(id: string) {
  const c = await cookies();
  c.set(COOKIE, makeToken(id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearCustomerSession() {
  (await cookies()).delete(COOKIE);
}
