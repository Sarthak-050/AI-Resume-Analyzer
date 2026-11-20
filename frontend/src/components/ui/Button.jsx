const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-500 focus-visible:outline-brand-500 shadow-sm shadow-brand-900/40",
  secondary:
    "bg-ink-800 text-ink-100 border border-ink-700 hover:bg-ink-700 focus-visible:outline-ink-400",
  danger:
    "bg-ink-800 text-rose-soft border border-rose-signal/40 hover:bg-rose-signal/10 focus-visible:outline-rose-signal",
  ghost:
    "text-ink-300 hover:text-white hover:bg-ink-800 focus-visible:outline-ink-400",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold
        transition-colors duration-150 focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;