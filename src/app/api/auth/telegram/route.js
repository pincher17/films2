import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import { prisma } from "@/server/prisma";

export const dynamic = "force-dynamic";

const COOKIE = "fh_profile";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const MAX_AGE_SECONDS = 60 * 60 * 24; // сутки — защита от повторного использования подписи

/**
 * Вход через Telegram.
 *
 * Telegram присылает данные пользователя и подпись `hash`. Подпись — это
 * HMAC-SHA256 от строки «ключ=значение», собранной из остальных полей, с ключом
 * SHA256(токен бота). Без проверки подписи вход можно подделать: достаточно
 * отправить чужой id.
 */
export async function POST(request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: "не настроен токен бота" }, { status: 500 });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "ожидается JSON" }, { status: 400 });
  }

  const { hash, ...fields } = data || {};
  if (!hash || !fields?.id) {
    return NextResponse.json({ error: "неполные данные" }, { status: 400 });
  }

  // строка проверки: поля по алфавиту, значения как есть, разделитель — перевод строки
  const checkString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const computed = crypto.createHmac("sha256", secretKey).update(checkString).digest("hex");

  // сравнение постоянного времени, чтобы не давать подсказок по времени ответа
  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(String(hash), "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "подпись не совпала" }, { status: 401 });
  }

  const authDate = Number(fields.auth_date) || 0;
  if (Date.now() / 1000 - authDate > MAX_AGE_SECONDS) {
    return NextResponse.json({ error: "подпись устарела" }, { status: 401 });
  }

  const telegramId = String(fields.id);
  const store = cookies();
  const anonymousId = store.get(COOKIE)?.value;

  // 1) уже входил через Telegram — берём его аккаунт
  let user = await prisma.user.findUnique({ where: { telegramId } });

  // 2) иначе привязываем анонимный профиль (та же логика, что у Google):
  //    история просмотра не теряется при первом входе
  if (!user && anonymousId) {
    const anonymous = await prisma.user.findUnique({ where: { id: anonymousId } });
    if (anonymous && !anonymous.telegramId) {
      user = await prisma.user.update({
        where: { id: anonymous.id },
        data: { telegramId, name: fields.first_name || anonymous.name },
      });
    }
  }

  // 3) иначе создаём новый
  if (!user) {
    user = await prisma.user.create({
      data: { telegramId, name: fields.first_name || null },
    });
  }

  const token = await encode({
    token: {
      uid: user.id,
      sub: user.id,
      telegramId,
      name: fields.first_name || undefined,
      picture: fields.photo_url || undefined,
    },
    secret: process.env.NEXTAUTH_SECRET,
  });

  const response = NextResponse.json({
    ok: true,
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
  response.cookies.set(COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
