import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Guards private pages (Dashboard, Upload, Resume Details, etc.)
 *
 * Behavior:
 * - If a valid token exists in localStorage, renders the protected page.
 * - If no token exists, redirects to /login.
 * - Remembers the page the user was trying to reach (via location state)
 *   so Login can send them back after a successful login.
 *
 * Usage:
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   }
 * />
 */
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;