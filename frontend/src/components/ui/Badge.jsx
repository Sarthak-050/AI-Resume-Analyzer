const tones = {
  success: "bg-scan-500/10 text-scan-300 border-scan-500/30",
  danger: "bg-rose-signal/10 text-rose-soft border-rose-signal/30",
  neutral: "bg-ink-800 text-ink-300 border-ink-700",
  brand: "bg-brand-600/15 text-brand-300 border-brand-600/30",
};

function Badge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm
        font-medium border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;