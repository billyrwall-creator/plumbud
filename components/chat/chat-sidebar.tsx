type ChatItem = {
  id: string;
  title: string;
};

type ChatSidebarProps = {
  chats: ChatItem[];
  activeChatId: string | null;
  loading: boolean;
  error: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
};

export default function ChatSidebar({
  chats,
  activeChatId,
  loading,
  error,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-slate-950 p-3 text-slate-100 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Chats</h2>
        <button
          onClick={onNewChat}
          className="rounded-full border border-slate-700 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          + New Chat
        </button>
      </div>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {loading ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">Loading chats…</p>
        ) : error ? (
          <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-sm text-red-200">{error}</p>
        ) : chats.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">No saved chats yet.</p>
        ) : (
          chats.map((chat) => {
            const isActive = chat.id === activeChatId;

            return (
              <div key={chat.id} className={`rounded-2xl border p-2 ${isActive ? "border-blue-500 bg-blue-600/90" : "border-white/10 bg-white/5"}`}>
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full rounded-xl px-3 py-3 text-left text-sm transition ${isActive ? "text-white" : "text-slate-200 hover:bg-white/10"}`}
                >
                  {chat.title}
                </button>
                <div className="mt-2 flex items-center gap-2 px-2">
                  <button
                    type="button"
                    onClick={() => onRenameChat(chat.id)}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-white/10"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteChat(chat.id)}
                    className="rounded-full border border-red-400/20 px-2.5 py-1 text-xs text-red-200 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
