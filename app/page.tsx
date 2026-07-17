import Link from "next/link";
import FeatureCard from "../components/ui/feature-card";

const features = [
  {
    title: "AI Technical Support",
    description: "Fast, structured support for day-to-day technical questions and troubleshooting paths.",
  },
  {
    title: "Official Regulations",
    description: "Reference current guidance from recognised standards and compliance frameworks.",
  },
  {
    title: "Manufacturer Manuals",
    description: "Access model-specific documentation in a clear, searchable format.",
  },
  {
    title: "Technical Bulletins",
    description: "Stay focused on the latest updates, advisories and installation notes.",
  },
  {
    title: "Fault Finding",
    description: "Work through symptoms, likely causes and safe next steps with clarity.",
  },
  {
    title: "Engineering Calculators",
    description: "Use quick tools for pressure, flow, sizing and other routine calculations.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              PlumbBud
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Evidence-based AI for UK Plumbing, Heating & Gas Engineers
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Answers backed by official regulations, manufacturer documentation and recognised industry guidance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="rounded-full bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Start Chatting
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-slate-900 p-6 text-white sm:p-8">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5">
              <p className="text-sm text-slate-300">Built for modern fieldwork</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li>• Trusted technical guidance with clear sources</li>
                <li>• Practical support for compliance and fault finding</li>
                <li>• A calm, professional workspace for daily use</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              Platform features
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Everything a modern engineer needs in one place
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
