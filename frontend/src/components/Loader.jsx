function Loader({ size = 24, className = "" }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-ink-200
        border-t-brand-600 ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export default Loader;