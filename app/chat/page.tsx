"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatInput from "../../components/chat/chat-input";
import ChatSidebar from "../../components/chat/chat-sidebar";
import MessageBubble from "../../components/chat/message-bubble";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatRecord = {
  id: string;
  title: string;
  created_at: string;
};

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createShortTitle(input: string) {
  const cleaned = input.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return "New chat";
  }

  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}...` : cleaned;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sidebarError, setSidebarError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = useCallback(async (chatId: string) => {
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    setLoadingMessages(true);

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, role, content, created_at")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      const nextMessages = (data ?? []).map((message) => ({
        id: message.id,
        role: message.role as Message["role"],
        content: message.content,
      })) as Message[];

      setMessages(nextMessages);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load this chat.";
      setSidebarError(message);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const loadChats = useCallback(async (preferredChatId?: string | null) => {
    const supabase = createClient();

    if (!supabase) {
      setLoadingChats(false);
      setSidebarError("Supabase is not configured for chat history.");
      return;
    }

    setLoadingChats(true);
    setSidebarError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setChats([]);
        setMessages([]);
        setActiveChatId(null);
        setSidebarError("Please sign in to view your saved chats.");
        return;
      }

      const { data, error } = await supabase
        .from("chats")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const chatList = (data ?? []).map((chat) => ({
        id: chat.id,
        title: chat.title || "New chat",
        created_at: chat.created_at,
      })) as ChatRecord[];

      setChats(chatList);

      if (preferredChatId) {
        setActiveChatId(preferredChatId);
        await loadMessages(preferredChatId);
        return;
      }

      if (chatList.length === 0) {
        setActiveChatId(null);
        setMessages([]);
        return;
      }

      const nextChatId = activeChatId && chatList.some((chat) => chat.id === activeChatId)
        ? activeChatId
        : chatList[0].id;

      setActiveChatId(nextChatId);
      await loadMessages(nextChatId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load chat history right now.";
      setSidebarError(message);
    } finally {
      setLoadingChats(false);
    }
  }, [activeChatId, loadMessages]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      await loadChats();
      if (!isMounted) {
        return;
      }
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, [loadChats]);

  async function handleSelectChat(chatId: string) {
    setActiveChatId(chatId);
    await loadMessages(chatId);
  }

  async function handleNewChat() {
    setActiveChatId(null);
    setMessages([]);
    setDraft("");
    setSidebarError(null);
  }

  async function handleRenameChat(chatId: string) {
    const target = chats.find((chat) => chat.id === chatId);
    if (!target) {
      return;
    }

    const nextTitle = window.prompt("Rename chat", target.title);
    if (!nextTitle) {
      return;
    }

    const trimmedTitle = nextTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setSidebarError("Supabase is not configured for chat history.");
      return;
    }

    try {
      const { error } = await supabase.from("chats").update({ title: trimmedTitle }).eq("id", chatId);
      if (error) {
        throw error;
      }

      setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, title: trimmedTitle } : chat)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to rename this chat.";
      setSidebarError(message);
    }
  }

  async function handleDeleteChat(chatId: string) {
    const confirmed = window.confirm("Delete this chat and its messages?");
    if (!confirmed) {
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setSidebarError("Supabase is not configured for chat history.");
      return;
    }

    try {
      const { error } = await supabase.from("chats").delete().eq("id", chatId);
      if (error) {
        throw error;
      }

      setChats((prev) => prev.filter((chat) => chat.id !== chatId));

      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete this chat.";
      setSidebarError(message);
    }
  }

  const handleSend = async () => {
    if (!draft.trim() || isSending) return;

    const trimmedDraft = draft.trim();
    const userMessage: Message = {
      id: createMessageId(),
      role: "user",
      content: trimmedDraft,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedDraft, chatId: activeChatId ?? undefined }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to contact the AI service.");
      }

      const assistantMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content: payload.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (payload.chatId) {
        const nextChatId = payload.chatId as string;
        setActiveChatId(nextChatId);

        if (!chats.some((chat) => chat.id === nextChatId)) {
          const newChat = {
            id: nextChatId,
            title: payload.title ? String(payload.title) : createShortTitle(trimmedDraft),
            created_at: new Date().toISOString(),
          };
          setChats((prev) => [newChat, ...prev]);
        } else {
          setChats((prev) => prev.map((chat) => (chat.id === nextChatId ? { ...chat, title: chat.title || createShortTitle(trimmedDraft) } : chat)));
        }
      }
    } catch (error) {
      const assistantMessage: Message = {
        id: createMessageId(),
        role: "assistant",
        content: error instanceof Error ? error.message : "Unable to generate a response right now.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="flex-1 bg-slate-50 px-3 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex h-[80vh] max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] lg:flex-row">
        <div className="w-full lg:w-72 lg:flex-none">
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            loading={loadingChats}
            error={sidebarError}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onRenameChat={handleRenameChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>

        <section className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {loadingMessages ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading conversation…</div>
              ) : messages.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Start a conversation</p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-900">Your saved chats will appear here.</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Create a new chat or open an existing one to continue troubleshooting with PlumbBud.
                  </p>
                </div>
              ) : (
                messages.map((message) => <MessageBubble key={message.id} role={message.role} content={message.content} />)
              )}
              <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">
              <ChatInput value={draft} onChange={setDraft} onSend={handleSend} disabled={isSending} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
