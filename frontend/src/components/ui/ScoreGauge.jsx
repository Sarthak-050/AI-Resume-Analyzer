import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

function ScoreGauge({ score = 0, size = 140, label = "ATS Score" }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const dashOffset = useTransform(
    count,
    (v) => circumference - (v / 100) * circumference
  );

  // Angle starts at top (-90deg) and sweeps clockwise as score fills
  const angle = useTransform(count, (v) => (v / 100) * 360 - 90);
  const dotX = useTransform(
    angle,
    (a) => center + radius * Math.cos((a * Math.PI) / 180)
  );
  const dotY = useTransform(
    angle,
    (a) => center + radius * Math.sin((a * Math.PI) / 180)
  );

  const getColor = (v) => {
    if (v >= 75) return "#0d9488";
    if (v >= 50) return "#d97706";
    return "#e11d48";
  };
  const color = useTransform(count, (v) => getColor(v));

  useEffect(() => {
    const controls = animate(count, clamped, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [clamped]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#262c40"
          strokeWidth="10"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>

      {/* Traveling glow dot at the tip of the progress arc */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 14,
          height: 14,
          left: dotX,
          top: dotY,
          x: "-50%",
          y: "-50%",
          backgroundColor: color,
          boxShadow: useTransform(color, (c) => `0 0 12px 3px ${c}`),
        }}
      />

      <div className="absolute flex flex-col items-center">
        <motion.span className="font-numeric text-3xl font-bold text-ink-50">
          {rounded}
        </motion.span>
        <span className="text-xs text-ink-400 mt-0.5">{label}</span>
      </div>
    </div>
  );
}

export default ScoreGauge;