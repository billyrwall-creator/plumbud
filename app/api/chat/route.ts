import { NextRequest, NextResponse } from "next/server";
import { sendChatMessage } from "@/services/chat-service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const messageEntry = formData.get("message");
    const chatIdEntry = formData.get("chatId");
    const imageEntry = formData.get("image");
    const imageUrlEntry = formData.get("imageUrl");

    const message =
      typeof messageEntry === "string" ? messageEntry : "";

    const chatId =
      typeof chatIdEntry === "string" ? chatIdEntry : null;

    const image =
      imageEntry instanceof File ? imageEntry : null;
      const imageUrl =
  typeof imageUrlEntry === "string" ? imageUrlEntry : null;

    if (!message.trim()) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 }
      );
    }

    const userId = null;

    console.log(
      "Image received by API:",
      image ? image.name : "No image"
    );

   const result = await sendChatMessage(
  message,
  userId,
  chatId,
  image,
  imageUrl
);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}