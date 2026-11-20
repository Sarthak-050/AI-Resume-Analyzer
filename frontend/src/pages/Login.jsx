import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn } from "lucide-react";

import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Loader from "../components/Loader";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = await loginUser({ email, password });

      login(data.user, data.token);

      toast.success("Login Successful");

      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-ink-950 px-4 py-10">
      <Card className="w-full max-w-md p-5 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-600/15 flex items-center justify-center mx-auto mb-3">
            <LogIn className="w-6 h-6 text-brand-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-50">Welcome back</h1>
          <p className="text-sm text-ink-400 mt-1">
            Log in to view your resume analysis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="w-4 h-4 text-ink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="Email address"
              className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500 rounded-lg pl-10 pr-3.5 py-3
                text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-ink-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full bg-ink-800 border border-ink-700 text-ink-100 placeholder-ink-500 rounded-lg pl-10 pr-3.5 py-3
                text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader size={18} className="border-white/40 border-t-white" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-ink-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-400 font-medium hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;