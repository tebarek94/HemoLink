import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";

type Tab = "login" | "register";

function errMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object" && err.response.data !== null) {
    const e = err.response.data as { error?: string };
    if (typeof e.error === "string") return e.error;
  }
  return fallback;
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, token, ready } = useAuth();

  const [tab, setTab] = useState<Tab>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/hospital";

  if (!ready) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-sm text-text-muted">
        Checking session…
      </div>
    );
  }

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Signed in");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(errMessage(err, "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      toast.success("Admin account created — you are signed in");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(errMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-secondary">Hospital console</h1>
        <p className="mt-2 text-sm text-text-muted">Sign in or create an admin account for the dashboard.</p>
      </div>

      <div className="mb-4 flex rounded-xl border border-black/5 bg-surface p-1">
        <button
          type="button"
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === "login" ? "bg-background text-secondary shadow-sm" : "text-text-muted hover:text-text"
          }`}
          onClick={() => setTab("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
            tab === "register" ? "bg-background text-secondary shadow-sm" : "text-text-muted hover:text-text"
          }`}
          onClick={() => setTab("register")}
        >
          Register admin
        </button>
      </div>

      {tab === "login" && (
        <Card>
          <form onSubmit={onLogin} className="space-y-4">
            <Input
              id="admin-email"
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="admin-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      )}

      {tab === "register" && (
        <Card>
          <p className="mb-4 text-sm text-text-muted">
            <strong className="text-text">First admin:</strong> you can register when no admin exists yet (empty database
            or before seed). <strong className="text-text">Additional admins</strong> are created by your server operator
            (e.g. with <code className="rounded bg-surface px-1 text-xs">ADMIN_REGISTER_SECRET</code> on the API), not from
            this public form.
          </p>
          <form onSubmit={onRegister} className="space-y-4">
            <Input
              id="reg-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="reg-password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Input
              id="reg-password2"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create admin & sign in"}
            </Button>
          </form>
        </Card>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        <Link to="/register" className="font-medium text-secondary hover:underline">
          Back to donor registration
        </Link>
      </p>
    </div>
  );
}
