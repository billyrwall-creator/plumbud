"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChatInput from "../../components/chat/chat-input";
import ChatSidebar from "../../components/chat/chat-sidebar";
import MessageBubble from "../../components/chat/message-bubble";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const starterMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hello, I’m PlumbBud. I’m here to help with evidence-led guidance for technical questions, regulations and troubleshooting.",
  },
  {
    id: 2,
    role: "user",
    content: "Can you help me check a boiler fault with low pressure?",
  },
  {
    id: 3,
    role: "assistant",
    content: "Yes — I can help structure a safe diagnostic path, but this demo uses placeholder content until the AI layer is connected.",
  },
];

const chatHistory = [
  { id: 1, title: "Boiler low pressure", active: true },
  { id: 2, title: "Gas safety checks" },
  { id: 3, title: "Manufacturer guide" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!draft.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: draft.trim(),
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: "Placeholder response: I’ll turn this into a grounded answer once the AI backend is connected.",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setDraft("");
  };

  const sidebarChats = useMemo(() => chatHistory, []);

  return (
    <main className="flex-1 bg-slate-50 px-3 py-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex h-[80vh] max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] lg:flex-row">
        <div className="w-full lg:w-72">
          <ChatSidebar chats={sidebarChats} onNewChat={() => setMessages(starterMessages)} />
        </div>

        <section className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} role={message.role} content={message.content} />
              ))}
              <div ref={endRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">
              <ChatInput value={draft} onChange={setDraft} onSend={handleSend} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
