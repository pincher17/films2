import { NextResponse } from "next/server";
import { getSoundtrack } from "@/server/soundtrack";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const kpId = Number(searchParams.get("kpId"));
  if (!Number.isInteger(kpId) || kpId <= 0) {
    return NextResponse.json({ error: "нужен kpId" }, { status: 400, headers: noStore });
  }

  try {
    const data = await getSoundtrack({
      kpId,
      title: searchParams.get("title") || "",
      originalTitle: searchParams.get("originalTitle") || "",
      year: searchParams.get("year") || "",
    });
    return NextResponse.json({ soundtrack: data }, { headers: noStore });
  } catch (error) {
    console.error("[soundtrack]", error);
    return NextResponse.json({ soundtrack: null, error: String(error?.message || error) }, { headers: noStore });
  }
}
