type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.25)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_-18px_rgba(37,99,235,0.25)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700">
        •
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
