import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";
import { adminDisplayLabel } from "../types/auth";

const sidebarLink =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition";

function IconOverview({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"
      />
    </svg>
  );
}

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
      />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm12 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      />
    </svg>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const close = () => onNavigate?.();

  const itemClass = ({ isActive }: { isActive: boolean }) =>
    `${sidebarLink} ${
      isActive
        ? "bg-secondary text-white shadow-sm [&_.sb-ico]:opacity-100"
        : "text-text hover:bg-surface hover:text-secondary [&_.sb-ico]:text-secondary/80"
    }`;

  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Admin navigation">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Navigate</p>
      <NavLink
        to="/hospital"
        className={({ isActive }) =>
          itemClass({ isActive: isActive || location.pathname === "/match" })
        }
        end
        onClick={close}
      >
        <span className="sb-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <IconOverview className="h-5 w-5" />
        </span>
        Dashboard
      </NavLink>
      <NavLink to="/hospital/hospitals" className={itemClass} onClick={close}>
        <span className="sb-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5">
          <IconBuilding className="h-5 w-5" />
        </span>
        Hospitals
      </NavLink>
      <NavLink to="/hospital/requests" className={itemClass} onClick={close}>
        <span className="sb-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5">
          <IconClipboard className="h-5 w-5" />
        </span>
        Blood requests
      </NavLink>

      <p className="mt-4 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">User registration</p>
      <NavLink to="/hospital/registration" className={itemClass} onClick={close}>
        <span className="sb-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5">
          <IconUsers className="h-5 w-5" />
        </span>
        Management
      </NavLink>
      <NavLink to="/hospital/register" className={itemClass} onClick={close}>
        <span className="sb-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5">
          <IconPlus className="h-5 w-5" />
        </span>
        Register donor
      </NavLink>
      <NavLink to="/hospital/donors" className={itemClass} onClick={close}>
        <span className="sb-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5">
          <IconList className="h-5 w-5" />
        </span>
        Donor directory
      </NavLink>
    </nav>
  );
}

const profileFooterLink = (isActive: boolean) =>
  `${sidebarLink} ${
    isActive
      ? "bg-secondary text-white shadow-sm [&_.sb-ico]:opacity-100"
      : "text-text hover:bg-surface hover:text-secondary [&_.sb-ico]:text-secondary/80"
  }`;

export function HospitalDashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout, refreshAdmin, token } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navName = adminDisplayLabel(admin, Boolean(token && !admin));

  useEffect(() => {
    void refreshAdmin();
  }, [refreshAdmin]);

  function handleSignOut() {
    logout();
    navigate("/admin", { replace: true });
  }

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-black/5 bg-background px-3 py-3 md:hidden">
        <Link to="/register" className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            HL
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-secondary">Admin dashboard</p>
            <p className="truncate text-xs text-text-muted">HemoLink Ethiopia</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="max-w-[6.5rem] truncate text-sm font-semibold text-text sm:max-w-[10rem]"
            title={admin?.email ?? undefined}
          >
            {navName}
          </span>
          <Link
            to="/hospital/profile"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface bg-surface text-secondary hover:bg-background"
            aria-label="Profile"
          >
            <IconUser className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface bg-surface text-text hover:bg-background"
            aria-expanded={mobileOpen}
            aria-controls="hospital-sidebar"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar: fixed to viewport; off-canvas on small screens, always visible md+ */}
      <aside
        id="hospital-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] min-h-0 w-[min(280px,85vw)] flex-col border-r border-black/5 bg-background shadow-xl transition-transform duration-200 ease-out motion-reduce:transition-none md:w-64 md:max-w-none md:shadow-sm ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-3 py-3 md:hidden">
          <span className="text-sm font-semibold text-secondary">Menu</span>
          <button
            type="button"
            className="rounded-lg p-2 text-text-muted hover:bg-surface hover:text-text"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="hidden border-b border-black/5 px-4 py-4 md:block">
          <Link to="/register" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              HL
            </span>
            <div>
              <p className="text-sm font-bold text-secondary">HemoLink</p>
              <p className="text-xs text-text-muted">Hospital console</p>
            </div>
          </Link>
        </div>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </div>
        <div className="flex shrink-0 flex-col gap-3 border-t border-black/5 p-4">
          <NavLink
            to="/hospital/profile"
            className={({ isActive }) => profileFooterLink(isActive)}
            onClick={() => setMobileOpen(false)}
          >
            <span className="sb-ico flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5">
              <IconUser className="h-5 w-5" />
            </span>
            Profile
          </NavLink>
          <Button type="button" variant="ghost" className="w-full border border-surface" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main: offset on md+ so it clears the fixed sidebar */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-surface md:ml-64">
        <div className="hidden items-center justify-end gap-3 border-b border-black/5 bg-background px-4 py-3 md:flex md:px-6">
          <span className="max-w-xs truncate text-sm font-medium text-text" title={admin?.email ?? undefined}>
            {navName}
          </span>
          <Link
            to="/hospital/profile"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-surface bg-surface text-secondary hover:bg-background"
            aria-label="Profile"
          >
            <IconUser className="h-5 w-5" />
          </Link>
        </div>
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}
