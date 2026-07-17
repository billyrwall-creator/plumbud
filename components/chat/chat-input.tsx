type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-sm">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder="Ask PlumbBud about a fault, regulation or manual..."
        className="w-full resize-none border-0 bg-transparent p-2 text-sm text-slate-700 outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-slate-500">No AI connection yet — placeholder responses only.</p>
        <button
          onClick={onSend}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
