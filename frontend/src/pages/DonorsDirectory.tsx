import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { fetchDonors } from "../services/api";
import type { Donor } from "../types";

export function DonorsDirectory() {
  const { pathname } = useLocation();
  const inAdminShell = pathname === "/hospital/donors";

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await fetchDonors(q || undefined);
      setDonors(data);
    } catch {
      toast.error("Could not load donors.");
      setDonors([]);
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

  return (
    <div className={`space-y-6 ${inAdminShell ? "mx-auto w-full max-w-5xl" : ""}`}>
      <div>
        <h1 className="text-2xl font-bold text-secondary">Donor directory</h1>
        <p className="mt-1 text-sm text-text-muted">Search by name, location, phone, or blood type.</p>
      </div>

      <Card>
        <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              id="search"
              label="Search"
              placeholder="Type to filter…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
        {query && (
          <p className="mt-3 text-xs text-text-muted">
            Filter: <span className="font-medium text-text">{query}</span>
          </p>
        )}
      </Card>

      {loading && <p className="text-sm text-text-muted">Loading donors…</p>}

      {!loading && donors.length === 0 && (
        <Card>
          <p className="text-center text-sm text-text-muted">No donors found.</p>
        </Card>
      )}

      {!loading && donors.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {donors.map((d) => (
            <li key={d.id}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text">{d.name}</p>
                    <p className="text-sm text-text-muted">{d.phone}</p>
                  </div>
                  <Badge tone="neutral">{d.bloodType}</Badge>
                </div>
                <p className="mt-3 text-sm text-text">{d.location}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
