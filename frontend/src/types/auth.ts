export interface AdminUser {
  id: string;
  email: string;
  /** Set on the profile page; omitted on older API responses until migrated. */
  displayName?: string | null;
}

/** Shown in the hospital console navbar; falls back to the part before @ in email. */
export function adminDisplayLabel(admin: AdminUser | null, loading: boolean): string {
  if (loading && !admin) return "…";
  if (!admin) return "Admin";
  const d = admin.displayName?.trim();
  if (d) return d;
  const at = admin.email.indexOf("@");
  return at > 0 ? admin.email.slice(0, at) : admin.email;
}
