import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { GEMINI_SYSTEM_INSTRUCTIONS } from "@/lib/gemini/config";
import { supabaseAdmin } from "@/lib/supabase-admin";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";
const GEMINI_EMBEDDING_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

async function createEmbedding(text: string): Promise<number[]> {
  const response = await fetch(GEMINI_EMBEDDING_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY!,
    },
    body: JSON.stringify({
      model: "models/gemini-embedding-001",
      content: {
        parts: [{ text }],
      },
      outputDimensionality: 768,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message || "Failed to create question embedding."
    );
  }

  const embedding = result.embedding?.values;

  if (!Array.isArray(embedding)) {
    throw new Error("Gemini did not return a question embedding.");
  }

  return embedding;
}
  async function fetchGeminiWithRetry(
  url: string,
  options: RequestInit,
  maxAttempts = 3
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url, options);

    if (response.status === 503) {
      if (attempt < maxAttempts) {
        const waitTime = attempt * 2000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      } else {
        return response;
      }
    }

    return response;
  }

  throw new Error("Unexpected retry failure.");
}
export function buildChatTitle(input: string) {
  const cleaned = input.trim().replace(/\s+/g, " ");

  if (!cleaned) {
    return "New chat";
  }

  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}...` : cleaned;
}

  export async function sendChatMessage(
  userMessage: string,
  userId: string | null,
  chatId: string | null,
  image: File | null,
  imageUrl: string | null,
) {
 if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not configured.");
}
const questionEmbedding = await createEmbedding(userMessage);

const { data: knowledgeMatches, error: knowledgeError } =
  await supabaseAdmin.rpc("match_knowledge", {
    query_embedding: questionEmbedding,
    match_count: 3,
  });

if (knowledgeError) {
  console.error("Knowledge search error:", knowledgeError.message);
}

const knowledgeContext = Array.isArray(knowledgeMatches)
  ? knowledgeMatches
      .map(
        (match: { title?: string; content?: string }) =>
          `${match.title ?? "Knowledge source"}:\n${match.content ?? ""}`
      )
      .join("\n\n")
  : "";
  
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
  text: `
${GEMINI_SYSTEM_INSTRUCTIONS}

Relevant plumbing knowledge:
${knowledgeContext || "No relevant knowledge found."}

User question:
${userMessage}
`,
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
const conversationHistory = await loadConversationHistory(chatId);

const response = await fetchGeminiWithRetry(GEMINI_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY,
  },
  body: JSON.stringify({
    contents: [
      ...conversationHistory,
      {
        role: "user",
        parts,
      },
    ],
  }),
});

if (!response.ok) {
  console.log("Gemini status:", response.status);

  const errorText = await response.text();

  if (response.status === 429) {
    throw new Error(
      "The Gemini API quota has been reached. Please wait for the quota to reset or check your Google AI billing and usage limits."
    );
  }

  if (response.status === 503) {
  console.error("Gemini 503 response:", errorText);

  throw new Error(
    `Gemini 503: ${errorText}`
  );
}

  throw new Error(`Gemini request failed: ${response.status} ${errorText}`);
}

const responseText = await response.text();
console.log("Gemini raw response:", responseText);

const payload = responseText ? JSON.parse(responseText) : {};

const assistantText =
  payload?.candidates?.[0]?.content?.parts?.[0]?.text ??
  "I could not generate a response.";
  
 const persistedChat = await persistConversation(
  userId,
  userMessage,
  assistantText,
  chatId,
  imageUrl
);

  return {
    reply: assistantText,
    chatId: persistedChat.chatId,
    title: persistedChat.title,
  };
}
async function loadConversationHistory(chatId?: string | null) {
  if (!chatId) {
    return [];
  }
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
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: messages, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Unable to load chat history: ${error.message}`);
  }

return (messages ?? []).map((message) => ({
  role: message.role === "assistant" ? "model" : "user",
  parts: [
    {
      text: message.content,
    },
  ],
}));
}

async function persistConversation(
  userId: string | null,
  userMessage: string,
  assistantMessage: string,
  chatId: string | null,
  imageUrl: string | null
) {
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
  image_url: imageUrl,
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
