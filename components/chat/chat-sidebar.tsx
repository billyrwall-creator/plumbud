type ChatItem = {
  id: number;
  title: string;
  active?: boolean;
};

type ChatSidebarProps = {
  chats: ChatItem[];
  onNewChat: () => void;
};

export default function ChatSidebar({ chats, onNewChat }: ChatSidebarProps) {
  return (
    <aside className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-slate-950 p-4 text-slate-100">
      <button
        onClick={onNewChat}
        className="rounded-full border border-slate-700 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
      >
        + New Chat
      </button>

      <div className="mt-6 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={`w-full rounded-2xl px-3 py-3 text-left text-sm transition ${
              chat.active ? "bg-blue-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </aside>
  );
}
