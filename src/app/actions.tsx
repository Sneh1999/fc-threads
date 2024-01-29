"use server";

import { kv } from "@vercel/kv";
import { join } from "path";
import fs from "fs"
import satori from "satori";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const fontPath = join(process.cwd(), 'Roboto-Regular.ttf')
let fontData = fs.readFileSync(fontPath)

export async function saveThread(casts: string[]) {
  const threadId = uuidv4();
  await kv.hset(`thread:${threadId}`, {
    casts,
  });

  await kv.zadd("thread_by_date", {
    score: Number(Date.now()),
    member: threadId,
  });
  console.log(uuidv4)
  return uuidv4
}

export async function getThread(id: string): Promise<string[]> {
  try {
    let thread = await kv.hgetall(`thread:${id}`);

    if (!thread || !thread["casts"]) {
      return [];
    }
    return thread["casts"] as string[];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getPNGBuffer(text: string) {
  const svg = await satori(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        fontSize: 30,
        fontWeight: 300,
      }}
    >
      <div style={{ marginTop: 40, paddingLeft: 10, paddingRight: 10 }}>
        {text}
      </div>
    </div>,
    {
      width: 600, height: 400, fonts: [{
          data: fontData,
          name: 'Roboto',
          style: 'normal',
          weight: 300
      }]
  }
  );
  const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();
  return pngBuffer
}
