import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { fetchRequests, matchDonors } from "../services/api";
import type { BloodRequest } from "../types";

export function BloodRequestsFinder() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [matchingId, setMatchingId] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await fetchRequests(q || undefined);
      setRequests(data);
    } catch {
      toast.error("Could not load requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load("");
  }, [load]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(search);
    void load(search);
  }

  async function runMatch(req: BloodRequest) {
    setMatchingId(req.id);
    try {
      const result = await matchDonors({ bloodType: req.bloodType, location: req.location });
      toast.success(`🚨 Alert sent to ${result.count} eligible donors`);
      navigate("/match", {
        state: {
          match: result,
          context: {
            hospitalName: req.hospitalName,
            bloodType: req.bloodType,
            unitsNeeded: req.unitsNeeded,
            location: req.location,
          },
        },
      });
    } catch {
      toast.error("Matching failed.");
    } finally {
      setMatchingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="border-b border-black/5 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Requests</p>
        <h1 className="mt-1 text-2xl font-bold text-secondary md:text-3xl">Blood request finder</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Browse every logged blood need. Filter by hospital, location, or blood type, then run a donor match for any row.
        </p>
      </header>

      <Card>
        <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              id="req-search"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hospital, location, blood type…"
            />
          </div>
          <Button type="submit" variant="secondary">
            Apply filter
          </Button>
        </form>
        {query && (
          <p className="mt-3 text-xs text-text-muted">
            Active filter: <span className="font-medium text-text">{query}</span>
          </p>
        )}
      </Card>

      {loading && <p className="text-sm text-text-muted">Loading requests…</p>}

      {!loading && requests.length === 0 && (
        <Card>
          <p className="text-center text-sm text-text-muted">No requests match. Try clearing the filter or log one from the dashboard.</p>
        </Card>
      )}

      {!loading && requests.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-background shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-surface bg-surface/80 text-xs font-semibold uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-4 py-3">Logged</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">Blood</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 w-[1%]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-surface/50">
                  <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-text">{r.hospitalName}</td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral">{r.bloodType}</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{r.unitsNeeded}</td>
                  <td className="max-w-[200px] px-4 py-3 text-text">{r.location}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button
                      type="button"
                      variant="primary"
                      className="text-xs"
                      disabled={matchingId === r.id}
                      onClick={() => void runMatch(r)}
                    >
                      {matchingId === r.id ? "Matching…" : "Find donors"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
