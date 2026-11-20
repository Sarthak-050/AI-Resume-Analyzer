import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-ink-950 text-white shadow-md relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-brand-400 font-[var(--font-display)]"
          onClick={closeMenu}
        >
          AI Resume Analyzer
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-brand-400 transition"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="text-sm text-ink-300 hover:text-brand-400 transition"
              >
                Hi, {user?.name}
              </Link>

              <ThemeSwitcher />

              <button
                onClick={handleLogout}
                className="bg-rose-signal hover:bg-rose-signal/90 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-brand-400 transition"
              >
                Login
              </Link>

              <ThemeSwitcher />

              <Link
                to="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-3">
          <ThemeSwitcher />
          <button
            className="text-white"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <span className="text-2xl">&times;</span>
            ) : (
              <span className="text-2xl">&#9776;</span>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-ink-900 px-6 py-4 flex flex-col gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-ink-300 hover:text-brand-400 transition"
                onClick={closeMenu}
              >
                Hi, {user?.name}
              </Link>

              <Link
                to="/dashboard"
                className="hover:text-brand-400 transition"
                onClick={closeMenu}
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="hover:text-brand-400 transition"
                onClick={closeMenu}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="bg-rose-signal hover:bg-rose-signal/90 text-white px-4 py-2 rounded-lg transition text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-brand-400 transition"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hover:text-brand-400 transition"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;