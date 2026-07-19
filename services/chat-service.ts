import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GEMINI_SYSTEM_INSTRUCTIONS } from "@/lib/gemini/config";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent";

export function buildChatTitle(input: string) {
  const cleaned = input.trim().replace(/\s+/g, " ");

  if (!cleaned) {
    return "New chat";
  }

  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}...` : cleaned;
}

export async function sendChatMessage(
  input: string,
  userId?: string | null,
  chatId?: string | null,
  image?: File | null
) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
const parts: Array<
  | { text: string }
  | {
      inline_data: {
        mime_type: string;
        data: string;
      };
    }
> = [
  {
    text: `${GEMINI_SYSTEM_INSTRUCTIONS}\n\nUser question:\n${input}`,
  },
];

if (image) {
  const imageBuffer = Buffer.from(await image.arrayBuffer());

  parts.push({
    inline_data: {
      mime_type: image.type,
      data: imageBuffer.toString("base64"),
    },
  });
}
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 429) {
      throw new Error("The Gemini service is currently rate-limited. Please wait a moment and try again.");
    }

    throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const assistantText = payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I could not generate a response.";
  const persistedChat = await persistConversation(userId, input, assistantText, chatId);

  return {
    reply: assistantText,
    chatId: persistedChat.chatId,
    title: persistedChat.title,
  };
}

async function persistConversation(userId: string | null | undefined, userMessage: string, assistantMessage: string, chatId?: string | null) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const { data: existingSession } = await supabase.auth.getUser();
  const activeUserId = existingSession?.user?.id ?? userId;

  if (!activeUserId) {
    throw new Error("You must be signed in to save chats.");
  }

  let resolvedChatId = chatId;
  let title = "New chat";

  if (resolvedChatId) {
    const { data: existingChat, error: existingChatError } = await supabase
      .from("chats")
      .select("id, title")
      .eq("id", resolvedChatId)
      .single();

    if (existingChatError || !existingChat) {
      throw new Error("Unable to continue the selected chat.");
    }

    title = existingChat.title || "New chat";
  } else {
    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .insert({
        user_id: activeUserId,
        title: buildChatTitle(userMessage),
      })
      .select("id, title")
      .single();

    if (chatError) {
      throw new Error(`Unable to create chat record: ${chatError.message}`);
    }

    resolvedChatId = chatData?.id;
    title = chatData?.title || buildChatTitle(userMessage);
  }

  if (!resolvedChatId) {
    throw new Error("Unable to create chat record.");
  }

  const { error: userMessageError } = await supabase.from("messages").insert({
    chat_id: resolvedChatId,
    role: "user",
    content: userMessage,
  });

  if (userMessageError) {
    throw new Error(`Unable to save user message: ${userMessageError.message}`);
  }

  const { error: assistantMessageError } = await supabase.from("messages").insert({
    chat_id: resolvedChatId,
    role: "assistant",
    content: assistantMessage,
  });

  if (assistantMessageError) {
    throw new Error(`Unable to save assistant message: ${assistantMessageError.message}`);
  }

  return { chatId: resolvedChatId, title };
}
