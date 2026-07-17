export default function LoginPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Login</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-3 text-slate-600">Access your PlumbBud workspace when authentication is connected.</p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-blue-500" placeholder="you@company.co.uk" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input id="password" type="password" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-blue-500" placeholder="••••••••" />
          </div>
          <button type="button" className="w-full rounded-full bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700">
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
