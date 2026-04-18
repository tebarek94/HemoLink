import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { createHospital, fetchHospitals } from "../services/api";
import type { Hospital } from "../types";

export function HospitalsAdmin() {
  const [list, setList] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await fetchHospitals(q || undefined);
      setList(data);
    } catch {
      toast.error("Could not load hospitals.");
      setList([]);
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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createHospital({
        name,
        location,
        phone,
        contactName: contactName.trim() || undefined,
      });
      toast.success("Hospital registered.");
      setName("");
      setLocation("");
      setPhone("");
      setContactName("");
      void load(query);
    } catch {
      toast.error("Could not save hospital.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="border-b border-black/5 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Hospitals</p>
        <h1 className="mt-1 text-2xl font-bold text-secondary md:text-3xl">Register & directory</h1>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Add partner facilities. Use them on the dashboard to autofill blood requests, or search below.
        </p>
      </header>

      <Card title="Register a hospital" subtitle="Name, service area, and phone for coordination.">
        <form onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input id="hosp-name" label="Hospital name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <Input
            id="hosp-loc"
            label="Location / area"
            placeholder="e.g. Addis Ababa — Bole"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Input id="hosp-phone" label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <div className="sm:col-span-2">
            <Input
              id="hosp-contact"
              label="Contact name (optional)"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" variant="secondary" disabled={saving}>
              {saving ? "Saving…" : "Save hospital"}
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Search hospitals">
        <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input id="hosp-search" label="Search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, location, phone…" />
          </div>
          <Button type="submit" variant="accent">
            Search
          </Button>
        </form>
      </Card>

      {loading && <p className="text-sm text-text-muted">Loading…</p>}
      {!loading && list.length === 0 && (
        <Card>
          <p className="text-center text-sm text-text-muted">No hospitals yet. Add one above.</p>
        </Card>
      )}
      {!loading && list.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((h) => (
            <li key={h.id}>
              <Card className="h-full">
                <p className="font-semibold text-text">{h.name}</p>
                <p className="mt-1 text-sm text-text-muted">{h.location}</p>
                <p className="mt-2 text-sm text-text">{h.phone}</p>
                {h.contactName && <p className="mt-1 text-xs text-text-muted">Contact: {h.contactName}</p>}
                <p className="mt-2 text-xs text-text-muted">
                  Added {new Date(h.createdAt).toLocaleString()}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
