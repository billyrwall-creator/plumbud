export default function RegisterPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Register</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-3 text-slate-600">Set up your company profile and preferences for the next release.</p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
              Full name
            </label>
            <input id="name" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-blue-500" placeholder="Alex Morgan" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="reg-email">
              Email
            </label>
            <input id="reg-email" type="email" className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-blue-500" placeholder="alex@plumber.co.uk" />
          </div>
          <button type="button" className="w-full rounded-full bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800">
            Create account
          </button>
        </form>
      </div>
    </main>
  );
}
