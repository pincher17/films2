import { NextResponse } from "next/server";
import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "@/server/prisma";

export const dynamic = "force-dynamic";

/**
 * Начало входа на телевизоре.
 *
 * Телевизор просит код, сервер создаёт короткоживущую запись и отдаёт код
 * вместе с QR. Дальше человек сканирует QR телефоном (или заходит по ссылке
 * вручную) и подтверждает вход — набирать что-либо на телевизоре не нужно.
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // без похожих 0/O и 1/I
const CODE_LENGTH = 6;
const TTL_MS = 15 * 60 * 1000;

function makeCode() {
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  // 6 символов читаются на телевизоре лучше, если разбить на две группы
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

export async function POST(request) {
  const origin = new URL(request.url).origin;
  const code = makeCode();
  const expiresAt = new Date(Date.now() + TTL_MS);

  try {
    await prisma.tvLoginCode.create({ data: { code, expiresAt } });
  } catch {
    return NextResponse.json({ error: "не удалось создать код" }, { status: 500 });
  }

  const link = `${origin}/link?code=${encodeURIComponent(code)}`;

  let qr = "";
  try {
    qr = await QRCode.toString(link, {
      type: "svg",
      margin: 1,
      width: 320,
      color: { dark: "#0b0b0b", light: "#ffffff" },
    });
  } catch {
    qr = "";
  }

  return NextResponse.json({ code, link, qr, expiresAt });
}
