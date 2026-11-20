import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children, size = "lg" }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-ink-900 border border-ink-800 rounded-card shadow-xl w-full
          ${sizes[size]} max-h-[85vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800 shrink-0">
          <h3 className="font-semibold text-ink-50">{title}</h3>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}

export default Modal;