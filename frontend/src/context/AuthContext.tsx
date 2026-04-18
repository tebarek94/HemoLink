import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { api, clearAuthToken, getStoredToken, setAuthToken, setUnauthorizedHandler } from "../services/api";
import type { AdminUser } from "../types/auth";

type AuthContextValue = {
  admin: AdminUser | null;
  token: string | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, registerSecret?: string) => Promise<void>;
  refreshAdmin: () => Promise<void>;
  setSession: (token: string, admin: AdminUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setAdmin(null);
  }, []);

  useEffect(() => {
    const t = getStoredToken();
    if (!t) {
      setReady(true);
      return;
    }
    setAuthToken(t);
    api
      .get<{ admin: AdminUser }>("/auth/me")
      .then((res) => {
        setAdmin(res.data.admin);
        setToken(t);
      })
      .catch(() => {
        clearAuthToken();
        setToken(null);
        setAdmin(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; admin: AdminUser }>("/auth/login", {
      email,
      password,
    });
    setAuthToken(data.token);
    setToken(data.token);
    setAdmin(data.admin);
  }, []);

  const register = useCallback(async (email: string, password: string, registerSecret?: string) => {
    const { data } = await api.post<{ token: string; admin: AdminUser }>("/auth/register", {
      email,
      password,
      registerSecret: registerSecret?.trim() || undefined,
    });
    setAuthToken(data.token);
    setToken(data.token);
    setAdmin(data.admin);
  }, []);

  const refreshAdmin = useCallback(async () => {
    const t = getStoredToken();
    if (!t) return;
    setAuthToken(t);
    try {
      const { data } = await api.get<{ admin: AdminUser }>("/auth/me");
      setAdmin(data.admin);
      setToken(t);
    } catch {
      clearAuthToken();
      setToken(null);
      setAdmin(null);
    }
  }, []);

  const setSession = useCallback((nextToken: string, nextAdmin: AdminUser) => {
    setAuthToken(nextToken);
    setToken(nextToken);
    setAdmin(nextAdmin);
  }, []);

  useEffect(() => {
    const handler = () => {
      logout();
      const path = window.location.pathname + window.location.search;
      if (!path.startsWith("/admin")) {
        navigate(`/admin?redirect=${encodeURIComponent(path)}`, { replace: true });
      }
    };
    setUnauthorizedHandler(handler);
    return () => setUnauthorizedHandler(null);
  }, [logout, navigate]);

  const value = useMemo(
    () => ({ admin, token, ready, login, register, refreshAdmin, setSession, logout }),
    [admin, token, ready, login, register, refreshAdmin, setSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
