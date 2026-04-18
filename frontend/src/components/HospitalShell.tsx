import type { ReactNode } from "react";
import { HospitalDashboardLayout } from "./HospitalDashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";

/**
 * Shared admin chrome: auth gate + sidebar layout for /hospital and /match.
 */
export function HospitalShell({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <HospitalDashboardLayout>{children}</HospitalDashboardLayout>
    </ProtectedRoute>
  );
}
