export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 PlumbBud. Built for modern engineering teams.</p>
        <div className="flex gap-4">
          <a href="/about" className="transition hover:text-slate-900">About</a>
          <a href="/chat" className="transition hover:text-slate-900">Chat</a>
        </div>
      </div>
    </footer>
  );
}
