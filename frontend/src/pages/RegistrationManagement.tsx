import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { useAnalytics } from "../hooks/useAnalytics";

function StatCard({
  label,
  value,
  loading,
  hint,
}: {
  label: string;
  value: string | number;
  loading: boolean;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-background p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 tabular-nums text-3xl font-bold tracking-tight text-text">{loading ? "—" : value}</p>
      {hint && <p className="mt-2 text-xs text-text-muted">{hint}</p>}
    </div>
  );
}

export function RegistrationManagement() {
  const { data: analytics, loading } = useAnalytics();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  function copyPublicLink() {
    const url = `${origin}/register`;
    void navigator.clipboard.writeText(url).then(
      () => toast.success("Public registration link copied"),
      () => toast.error("Could not copy")
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="border-b border-black/5 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">User registration</p>
        <h1 className="mt-1 text-2xl font-bold text-secondary md:text-3xl">Registration management</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Register donors into the pool, review who is on file, and share the public form with walk-ins or community
          outreach.
        </p>
      </header>

      <section aria-labelledby="reg-stats">
        <h2 id="reg-stats" className="mb-4 text-sm font-semibold text-text">
          Snapshot
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Registered donors"
            value={analytics?.totalDonors ?? "—"}
            loading={loading}
            hint="Total in the network"
          />
          <StatCard
            label="Blood requests (system)"
            value={analytics?.totalRequests ?? "—"}
            loading={loading}
            hint="For context — logged from the dashboard"
          />
        </div>
      </section>

      <section aria-labelledby="reg-actions" className="grid gap-4 md:grid-cols-2">
        <h2 id="reg-actions" className="sr-only">
          Actions
        </h2>
        <Card className="flex h-full flex-col border-accent/20 bg-gradient-to-br from-accent/5 to-background">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">In console</p>
          <h3 className="mt-2 text-lg font-semibold text-text">Register a donor</h3>
          <p className="mt-2 flex-1 text-sm text-text-muted">
            Open the same form staff use at the desk. Data saves to the shared donor list.
          </p>
          <Link to="/hospital/register" className="mt-4 inline-flex">
            <Button variant="accent" className="min-h-[44px]">
              Open registration form
            </Button>
          </Link>
        </Card>

        <Card className="flex h-full flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Directory</p>
          <h3 className="mt-2 text-lg font-semibold text-text">Registered donors</h3>
          <p className="mt-2 flex-1 text-sm text-text-muted">
            Search by name, location, phone, or blood type.
          </p>
          <Link to="/hospital/donors" className="mt-4 inline-flex">
            <Button variant="secondary" className="min-h-[44px]">
              Open donor directory
            </Button>
          </Link>
        </Card>
      </section>

      <Card title="Public registration link" subtitle="Share with donors who register on their own phone or computer.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <code className="break-all rounded-lg bg-surface px-3 py-2 text-sm text-secondary">{origin}/register</code>
          <Button type="button" variant="ghost" className="shrink-0 border border-surface" onClick={copyPublicLink}>
            Copy link
          </Button>
        </div>
      </Card>
    </div>
  );
}
