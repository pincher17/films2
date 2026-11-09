import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/prisma";

export const dynamic = "force-dynamic";

/**
 * Подтверждение входа с телефона.
 *
 * Требует активной сессии: подтвердить чужой код нельзя. После отметки
 * approved телевизор при следующем опросе получит сессию.
 */
export async function POST(request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || session?.user?.uid;

  if (!userId) {
    return NextResponse.json({ error: "нужно войти" }, { status: 401 });
  }

  let code = "";
  try {
    const body = await request.json();
    code = String(body?.code || "").trim().toUpperCase();
  } catch {
    return NextResponse.json({ error: "ожидается JSON" }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "нет кода" }, { status: 400 });
  }

  const record = await prisma.tvLoginCode.findUnique({ where: { code } });
  if (!record) {
    return NextResponse.json({ error: "код не найден" }, { status: 404 });
  }
  if (record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "код истёк" }, { status: 410 });
  }

  await prisma.tvLoginCode.update({
    where: { code },
    data: { userId, status: "approved" },
  });

  return NextResponse.json({ ok: true });
}
