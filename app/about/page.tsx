export default function AboutPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">About PlumbBud</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
          Built for professionals who want dependable guidance without compromise.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          PlumbBud is a polished product concept for plumbing, heating and gas engineers who need calm, evidence-led support in the field and at the desk.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "Mobile-first", text: "Designed for busy engineers moving between jobs." },
            { title: "Clear guidance", text: "Professional copy and a calm, focused experience." },
            { title: "Built to grow", text: "Ready for chat, account and onboarding features later." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
