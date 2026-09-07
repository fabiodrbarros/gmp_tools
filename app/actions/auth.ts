"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "gmp_admin";

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const user = ((formData.get("user") as string) || "").trim();
  const pass = (formData.get("password") as string) || "";

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
    const c = await cookies();
    c.set(COOKIE, process.env.ADMIN_TOKEN ?? "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.COOKIE_SECURE === "true", // set true when served over HTTPS (Cloudflare)
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    });
    redirect("/gmp-panel-admin");
  }

  return { error: "Utilizador ou palavra-passe inválidos." };
}

export async function logout() {
  const c = await cookies();
  c.delete(COOKIE);
  redirect("/gmp-panel-admin/login");
}
