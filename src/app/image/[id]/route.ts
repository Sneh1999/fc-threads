import { NextRequest } from "next/server";
import { getPNGBuffer, getThread } from "@/app/actions";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const indexString = searchParams.get("index");

    if (!indexString) {
      return new Response("Missing index", {
        status: 400,
      });
    }

    const thread = await getThread(params.id);

    const pngBuffer = await getPNGBuffer(thread[Number(indexString)]);

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "max-age=10",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(`Internal Server Error`, {
      status: 500,
    });
  }
}
