"use server";

import { kv } from "@vercel/kv";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export async function saveThread(casts: string[]) {
  const threadId = uuidv4();
  await kv.hset(`thread:${threadId}`, {
    casts,
  });

  await kv.zadd("thread_by_date", {
    score: Number(Date.now()),
    member: threadId,
  });

  redirect(`/threads/${threadId}`);
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
