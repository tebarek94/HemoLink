import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { patchAdminProfile } from "../services/api";

function errMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object" && err.response.data !== null) {
    const e = err.response.data as { error?: string };
    if (typeof e.error === "string") return e.error;
  }
  return fallback;
}

export function AdminProfile() {
  const { admin, refreshAdmin, setSession } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void refreshAdmin();
  }, [refreshAdmin]);

  useEffect(() => {
    if (admin?.email) setEmail(admin.email);
    if (admin) setDisplayName(admin.displayName ?? "");
  }, [admin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword.trim()) {
      toast.error("Enter your current password to save changes.");
      return;
    }
    const emailChanged = email.trim().toLowerCase() !== (admin?.email ?? "").toLowerCase();
    const pwChange = newPassword.trim().length > 0;
    const nextDisplay = displayName.trim();
    const prevDisplay = (admin?.displayName ?? "").trim();
    const displayChanged = nextDisplay !== prevDisplay;
    if (!emailChanged && !pwChange && !displayChanged) {
      toast.error("Change your display name, email, and/or password.");
      return;
    }
    setSaving(true);
    try {
      const payload: {
        currentPassword: string;
        email?: string;
        newPassword?: string;
        displayName?: string | null;
      } = {
        currentPassword,
      };
      if (emailChanged) payload.email = email.trim();
      if (pwChange) payload.newPassword = newPassword;
      if (displayChanged) payload.displayName = nextDisplay.length > 0 ? nextDisplay : null;
      const result = await patchAdminProfile(payload);
      setSession(result.token, result.admin);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Profile updated");
    } catch (err) {
      toast.error(errMessage(err, "Could not update profile"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Account</p>
        <h1 className="mt-1 text-2xl font-bold text-secondary">Admin profile</h1>
        <p className="mt-1 text-sm text-text-muted">View your account and update display name, email, or password.</p>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-text">Account details</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-surface pb-2">
            <dt className="text-text-muted">Admin ID</dt>
            <dd className="font-mono text-xs text-text">{admin?.id ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-surface py-2">
            <dt className="text-text-muted">Display name</dt>
            <dd className="max-w-[60%] text-right font-medium text-text">
              {admin?.displayName?.trim() || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 pt-1">
            <dt className="text-text-muted">Email</dt>
            <dd className="break-all text-right font-medium text-text">{admin?.email ?? "Loading…"}</dd>
          </div>
        </dl>
      </Card>

      <Card
        title="Update profile"
        subtitle="Enter your current password. Change display name, email, password, or any combination."
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            id="profile-display-name"
            label="Display name"
            autoComplete="nickname"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Shown in the hospital console header"
          />
          <Input
            id="profile-email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="profile-new-password"
            label="New password (optional)"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
          <Input
            id="profile-current-password"
            label="Current password (required to save)"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="secondary" className="w-full sm:w-auto" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
