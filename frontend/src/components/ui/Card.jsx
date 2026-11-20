function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-ink-900 border border-ink-800 rounded-card shadow-sm shadow-black/20
        ${hover ? "transition-shadow duration-200 hover:shadow-md hover:shadow-black/30" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;