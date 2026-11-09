import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export const dynamic = "force-dynamic";

/** Кто вошёл: нужно телевизионной шапке, чтобы показать имя или «Войти». */
export async function GET() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;

  if (!id) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: { id, name: session?.user?.name || null },
  });
}
