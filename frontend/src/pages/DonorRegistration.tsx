import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { registerDonor } from "../services/api";
import { BLOOD_TYPES } from "../types";

export function DonorRegistration() {
  const { pathname } = useLocation();
  const inAdminShell = pathname === "/hospital/register";

  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState<string>(BLOOD_TYPES[0]);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerDonor({ name, bloodType, location, phone });
      toast.success("Donor registered successfully.");
      setName("");
      setLocation("");
      setPhone("");
      setBloodType(BLOOD_TYPES[0]);
    } catch {
      toast.error("Registration failed. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`mx-auto w-full ${inAdminShell ? "max-w-2xl" : "max-w-lg"}`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary">Donor registration</h1>
        <p className="mt-1 text-sm text-text-muted">
          Join the pool. Your data is used only for this prototype matching demo.
        </p>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            id="name"
            label="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <Select
            id="bloodType"
            label="Blood type"
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
            id="location"
            label="Location"
            placeholder="e.g. Addis Ababa — Bole"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Input
            id="phone"
            label="Phone"
            type="tel"
            placeholder="+251 …"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
          />
          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            {loading ? "Saving…" : "Register as donor"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
