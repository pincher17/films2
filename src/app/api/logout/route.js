import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Выход. Чистим только сессию: анонимный профиль (fh_profile) остаётся,
 * чтобы история просмотра не потерялась.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
  ]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return response;
}
