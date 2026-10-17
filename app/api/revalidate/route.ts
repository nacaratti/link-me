import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { pageTag } from "@/lib/data";

/**
 * Limpa o cache da página pública de alguém. Para quando o perfil é mexido
 * direto no banco (suporte, scripts), fora do painel.
 *
 *   curl -X POST "https://www.linqu.es/api/revalidate?u=username" -H "Authorization: Bearer $REVALIDATE_SECRET"
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const username = request.nextUrl.searchParams.get("u")?.toLowerCase();
  if (!username) return NextResponse.json({ error: "missing u" }, { status: 400 });

  revalidateTag(pageTag(username), { expire: 0 });
  revalidatePath(`/${username}`);
  return NextResponse.json({ revalidated: username });
}
