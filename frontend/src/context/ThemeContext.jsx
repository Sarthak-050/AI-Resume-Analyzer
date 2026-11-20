import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const THEMES = [
  { id: "default", label: "Aurora", swatch: "#c026d3" },
  { id: "midnight", label: "Midnight", swatch: "#5850e0" },
  { id: "sunset", label: "Sunset", swatch: "#ea580c" },
  { id: "forest", label: "Forest", swatch: "#059669" },
  { id: "royal", label: "Royal", swatch: "#9333ea" },
];

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "default";
  });

  useEffect(() => {
    if (theme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;