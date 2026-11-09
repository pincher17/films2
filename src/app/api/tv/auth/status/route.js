import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import { prisma } from "@/server/prisma";

export const dynamic = "force-dynamic";

const PROFILE_COOKIE = "fh_profile";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Телевизор опрашивает статус кода.
 *
 * Когда телефон подтвердил вход, сервер выдаёт телевизору сессию — тем же
 * способом, что и обычный вход через Telegram: подписанный JWT в cookie.
 * Код после этого удаляется, повторно им воспользоваться нельзя.
 */
export async function GET(request) {
  const code = new URL(request.url).searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "нет кода" }, { status: 400 });
  }

  const record = await prisma.tvLoginCode.findUnique({ where: { code } });

  if (!record) {
    return NextResponse.json({ status: "unknown" });
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.tvLoginCode.delete({ where: { code } }).catch(() => null);
    return NextResponse.json({ status: "expired" });
  }

  if (record.status !== "approved" || !record.userId) {
    return NextResponse.json({ status: "pending" });
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user) {
    await prisma.tvLoginCode.delete({ where: { code } }).catch(() => null);
    return NextResponse.json({ status: "unknown" });
  }

  const token = await encode({
    token: {
      uid: user.id,
      sub: user.id,
      telegramId: user.telegramId || undefined,
      name: user.name || undefined,
      picture: user.image || undefined,
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const response = NextResponse.json({
    status: "ok",
    user: { id: user.id, name: user.name },
  });

  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });
  response.cookies.set(PROFILE_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });

  await prisma.tvLoginCode.delete({ where: { code } }).catch(() => null);

  return response;
}
