import { NextRequest } from "next/server";
import { getThread } from "@/app/actions";

export const dynamic = "force-dynamic";

function getNextIndex(index: number, casts: string[], buttonIndex: number) {
  if (index === 0 && casts.length > 1) {
    return 1;
  } else if (
    (index > 0 && index + 1 === casts.length) ||
    (index > 0 && index + 1 !== casts.length && buttonIndex === 1)
  ) {
    return index - 1;
  } else {
    return index + 1;
  }
}

// POST request to render the next cast in the thread
export async function POST(
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

    const resJson = await request.json();

    const casts = await getThread(params.id);
    if (casts.length === 0) {
      return new Response("Thread not found", {
        status: 400,
      });
    }
    const index = Number(indexString);
    const buttonIndex = resJson.untrustedData.buttonIndex;
    const nextIndex = getNextIndex(index, casts, buttonIndex);

    const imageUrl = `${process.env["HOST"]}/image/${params.id}?index=${nextIndex}`;
    const hasNextCast =
      nextIndex !== casts.length - 1 && casts.length > nextIndex + 1;
    const hasPrevCast = nextIndex !== 0 && casts.length > 1;

    const buttons = [];
    if (hasPrevCast) buttons.push("<-");
    if (hasNextCast) buttons.push("->");

    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Thread</title>
          <meta property="og:title" content="Thread" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:post_url" content="${
            process.env["HOST"]
          }/thread/${params.id}?index=${nextIndex}" />
          ${buttons.map(
            (b, idx) =>
              `<meta name="fc:frame:button:${idx + 1}" content="${b}" />`
          )}
       </head>
      </html>
        `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Internal Server Error`, {
      status: 500,
    });
  }
}

// Get request for the initial first cast in the thread
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const casts = await getThread(params.id);
  if (casts.length === 0) {
    return new Response("Thread not found", {
      status: 400,
    });
  }
  return new Response(
    `
        <!DOCTYPE html>
            <html>
                <head>
                    <title>Thread</title>
                    <meta property="og:title" content="Thread" />
                    <meta property="og:image" content="${
                      process.env["HOST"]
                    }/image/${id}?index=0" />
                    <meta name="fc:frame" content="vNext" />
                    <meta name="fc:frame:image" content="${
                      process.env["HOST"]
                    }/image/${id}?index=0" />
                    <meta name="fc:frame:post_url" content="${
                      process.env["HOST"]
                    }/thread/${id}?index=0" />
                    ${
                      casts.length > 1
                        ? '<meta name="fc:frame:button:1" content="->"  />'
                        : ""
                    }
                </head>
            </html>
    `,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
