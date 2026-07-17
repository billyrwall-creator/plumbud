export default function ProfilePage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Daniel Price</h1>
            <p className="mt-3 max-w-2xl text-slate-600">GasSafe engineer focused on diagnostics, compliance notes and faster call-outs.</p>
          </div>
          <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
            <p className="text-sm text-slate-300">Specialisms</p>
            <p className="mt-1 font-semibold">Boiler servicing • Fault finding</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { title: "Recent activity", text: "3 case summaries drafted this week" },
            { title: "Preferred workflow", text: "Mobile-first checklist prompts" },
            { title: "Next upgrade", text: "Saved templates and smart reminders" },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
