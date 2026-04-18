import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { createBloodRequest, fetchHospitals, matchDonors } from "../services/api";
import { useAnalytics } from "../hooks/useAnalytics";
import { BLOOD_TYPES } from "../types";
import type { Hospital } from "../types";

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

export function HospitalDashboard() {
  const navigate = useNavigate();
  const { data: analytics, loading: analyticsLoading, refresh } = useAnalytics();

  const [hospitalName, setHospitalName] = useState("");
  const [bloodType, setBloodType] = useState<string>(BLOOD_TYPES[0]);
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [matching, setMatching] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [hospitalsLoading, setHospitalsLoading] = useState(true);
  const [selectedHospitalId, setSelectedHospitalId] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setHospitalsLoading(true);
      try {
        const list = await fetchHospitals();
        if (!cancelled) setHospitals(list);
      } catch {
        if (!cancelled) setHospitals([]);
      } finally {
        if (!cancelled) setHospitalsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function onPickHospital(id: string) {
    setSelectedHospitalId(id);
    if (!id) return;
    const h = hospitals.find((x) => x.id === id);
    if (h) {
      setHospitalName(h.name);
      setLocation(h.location);
    }
  }

  async function onSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBloodRequest({ hospitalName, bloodType, unitsNeeded, location });
      toast.success("Blood request recorded.");
      await refresh();
    } catch {
      toast.error("Could not save request. Check the API.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onFindDonors() {
    if (!location.trim() || !bloodType) {
      toast.error("Blood type and location are required to find donors.");
      return;
    }
    setMatching(true);
    try {
      const result = await matchDonors({ bloodType, location });
      toast.success(`🚨 Emergency alert sent to ${result.count} donors nearby`);
      navigate("/match", {
        state: {
          match: result,
          context: { hospitalName, bloodType, unitsNeeded, location },
        },
      });
    } catch {
      toast.error("Matching failed. Is the API running?");
    } finally {
      setMatching(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
        {/* Page header */}
        <header className="border-b border-black/5 pb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-secondary md:text-3xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            Review network totals, register donors, then log an emergency need and run a match by blood type and
            location.
          </p>
        </header>

        {/* Snapshot */}
        <section aria-labelledby="snapshot-heading">
          <h2 id="snapshot-heading" className="mb-4 text-sm font-semibold text-text">
            Snapshot
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Registered donors"
              value={analytics?.totalDonors ?? "—"}
              loading={analyticsLoading}
              hint="Across the network"
            />
            <StatCard
              label="Blood requests logged"
              value={analytics?.totalRequests ?? "—"}
              loading={analyticsLoading}
              hint="Total requests in the system"
            />
          </div>
        </section>

        {/* Donor registration — prominent link */}
        <section aria-labelledby="register-heading">
          <h2 id="register-heading" className="sr-only">
            Donor registration
          </h2>
          <div className="overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-background shadow-sm">
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">Public form</p>
                <h3 className="text-lg font-semibold text-text">Donor registration</h3>
                <p className="max-w-xl text-sm text-text-muted">
                  Add someone to the donor pool. Share this link with staff or donors — same app, no admin password
                  required on the registration page.
                </p>
                <p className="text-xs text-text-muted">
                  Opens: <span className="font-mono text-secondary">/hospital/register</span> (sidebar stays open)
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                <Link to="/hospital/register" className="inline-flex">
                  <Button variant="accent" className="min-h-[44px] px-6">
                    Open registration
                  </Button>
                </Link>
                <Link
                  to="/hospital/donors"
                  className="text-center text-sm font-medium text-secondary underline-offset-4 hover:underline sm:text-right"
                >
                  Browse donor directory →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency request */}
        <section aria-labelledby="request-heading">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="request-heading" className="text-sm font-semibold text-text">
                Emergency blood request
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Log the hospital need, then find eligible donors (same blood type + exact location + 8-week rule).
              </p>
            </div>
          </div>

          <Card className="border-black/5 bg-background shadow-sm">
            <form onSubmit={onSubmitRequest} className="space-y-5">
              {hospitals.length > 0 && (
                <Select
                  id="savedHospital"
                  label="Use registered hospital (optional)"
                  value={selectedHospitalId}
                  onChange={(e) => onPickHospital(e.target.value)}
                  disabled={hospitalsLoading}
                >
                  <option value="">— Type manually below —</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} — {h.location}
                    </option>
                  ))}
                </Select>
              )}
              <Input
                id="hospitalName"
                label="Hospital name"
                value={hospitalName}
                onChange={(e) => {
                  setHospitalName(e.target.value);
                  setSelectedHospitalId("");
                }}
                required
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  id="reqBlood"
                  label="Blood type needed"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  required
                >
                  {BLOOD_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </Select>
                <Input
                  id="units"
                  label="Units needed"
                  type="number"
                  min={1}
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                  required
                />
              </div>
              <Input
                id="loc"
                label="Location / service area"
                placeholder="Must match donor location text exactly (MVP)"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setSelectedHospitalId("");
                }}
                required
              />
              <div className="flex flex-col gap-3 border-t border-surface pt-5 sm:flex-row sm:flex-wrap">
                <Button type="submit" variant="secondary" disabled={submitting} className="min-h-[44px] sm:min-w-[200px]">
                  {submitting ? "Saving…" : "Submit blood request"}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={onFindDonors}
                  disabled={matching}
                  className="min-h-[44px] sm:min-w-[200px]"
                >
                  {matching ? "Finding…" : "Find donors"}
                </Button>
              </div>
            </form>
          </Card>
        </section>
      </div>
  );
}
