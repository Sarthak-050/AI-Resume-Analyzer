import Card from "./ui/Card";

function StatCard({ icon: Icon, label, value, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-600/15 text-brand-400",
    scan: "bg-scan-500/15 text-scan-400",
    amber: "bg-amber-signal/15 text-amber-soft",
  };

  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-5 h-5" strokeWidth={2} />
      </div>

      <div>
        <p className="text-xs text-ink-400 font-medium">{label}</p>
        <p className="font-numeric text-2xl font-bold text-ink-50 mt-0.5">
          {value}
        </p>
      </div>
    </Card>
  );
}

export default StatCard;