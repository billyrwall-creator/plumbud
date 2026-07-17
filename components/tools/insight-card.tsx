type InsightCardProps = {
  title: string;
  detail: string;
};

export default function InsightCard({ title, detail }: InsightCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </div>
  );
}
