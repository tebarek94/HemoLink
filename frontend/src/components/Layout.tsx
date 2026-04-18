import { useLocation } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isHospitalShell =
    pathname === "/match" || pathname === "/hospital" || pathname.startsWith("/hospital/");
  const isLanding = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <main
        className={
          isHospitalShell || isLanding
            ? "flex min-h-0 w-full min-w-0 flex-1 flex-col px-0 py-0"
            : "mx-auto max-w-6xl flex-1 px-4 py-10"
        }
      >
        {children}
      </main>
      <footer className="border-t border-black/5 bg-background py-6 text-center text-xs text-text-muted">
        HemoLink Ethiopia — prototype for research and demonstration. Not for clinical use.
      </footer>
    </div>
  );
}
