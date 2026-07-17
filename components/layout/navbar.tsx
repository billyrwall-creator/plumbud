import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
            PB
          </span>
          <span>
            <span className="block text-lg font-semibold text-slate-900">PlumbBud</span>
            <span className="block text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Evidence-led support
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
