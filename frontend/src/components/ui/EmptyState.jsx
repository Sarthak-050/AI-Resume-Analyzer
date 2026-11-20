function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-brand-600/15 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-brand-400" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-ink-50">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-ink-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;