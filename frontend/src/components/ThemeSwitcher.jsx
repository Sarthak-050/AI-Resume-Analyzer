import { useState, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { ThemeContext, THEMES } from "../context/ThemeContext";

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-lg bg-ink-800 border border-ink-700 flex items-center justify-center text-ink-300 hover:text-white transition-colors"
        aria-label="Change theme"
      >
        <Palette className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-ink-900 border border-ink-800 rounded-lg shadow-xl p-2 z-50"
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-ink-800 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                    style={{ backgroundColor: t.swatch }}
                  />
                  <span className="text-sm text-ink-100">{t.label}</span>
                </div>
                {theme === t.id && (
                  <Check className="w-4 h-4 text-brand-400 shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeSwitcher;