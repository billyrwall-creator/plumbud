import { NextRequest, NextResponse } from "next/server";
import { sendChatMessage } from "@/services/chat-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message : "";

    if (!message.trim()) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    const userId = typeof body?.userId === "string" ? body.userId : null;
    const chatId = typeof body?.chatId === "string" ? body.chatId : null;
    const result = await sendChatMessage(message, userId, chatId);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
