import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
};

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.25em] text-blue-700">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-4 rounded-2xl border border-slate-200 bg-slate-900 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.25em] text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="my-2 leading-7">{children}</p>,
  ul: ({ children }) => <ul className="my-3 space-y-2 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 space-y-2 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-7">{children}</li>,
  code: ({ children, className, ...props }) => {
    const isBlock = className?.includes("language-");

    if (isBlock) {
      return (
        <pre className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-3 text-[12px] leading-6 text-slate-100">
          <code {...props}>{children}</code>
        </pre>
      );
    }

    return (
      <code className="rounded bg-slate-100 px-1 py-0.5 text-[12px] text-slate-800">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="my-3 rounded-r-xl border-l-4 border-blue-500 bg-blue-50/70 pl-3 italic text-slate-700">
      {children}
    </blockquote>
  ),
};

export default function MessageBubble({
  role,
  content,
  imageUrl,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-[1.25rem] px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[85%] ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {isUser ? (
  <div className="space-y-3">
    {imageUrl && (
      <img
        src={imageUrl}
        alt="Uploaded image"
        className="max-h-64 w-full rounded-xl object-cover"
      />
    )}

    <div className="whitespace-pre-wrap">{content}</div>
  </div>
) : (
          <div className="space-y-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
