import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HospitalShell } from "./components/HospitalShell";
import { DonorRegistration } from "./pages/DonorRegistration";
import { HospitalDashboard } from "./pages/HospitalDashboard";
import { MatchResults } from "./pages/MatchResults";
import { DonorsDirectory } from "./pages/DonorsDirectory";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminProfile } from "./pages/AdminProfile";
import { HospitalsAdmin } from "./pages/HospitalsAdmin";
import { BloodRequestsFinder } from "./pages/BloodRequestsFinder";
import { RegistrationManagement } from "./pages/RegistrationManagement";
import { Landing } from "./pages/Landing";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<DonorRegistration />} />
        <Route
          path="/hospital/registration"
          element={
            <HospitalShell>
              <RegistrationManagement />
            </HospitalShell>
          }
        />
        <Route
          path="/hospital/register"
          element={
            <HospitalShell>
              <DonorRegistration />
            </HospitalShell>
          }
        />
        <Route
          path="/hospital/donors"
          element={
            <HospitalShell>
              <DonorsDirectory />
            </HospitalShell>
          }
        />
        <Route
          path="/hospital/hospitals"
          element={
            <HospitalShell>
              <HospitalsAdmin />
            </HospitalShell>
          }
        />
        <Route
          path="/hospital/requests"
          element={
            <HospitalShell>
              <BloodRequestsFinder />
            </HospitalShell>
          }
        />
        <Route
          path="/hospital/profile"
          element={
            <HospitalShell>
              <AdminProfile />
            </HospitalShell>
          }
        />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
        <Route
          path="/hospital"
          element={
            <HospitalShell>
              <HospitalDashboard />
            </HospitalShell>
          }
        />
        <Route
          path="/match"
          element={
            <HospitalShell>
              <MatchResults />
            </HospitalShell>
          }
        />
        <Route path="/donors" element={<DonorsDirectory />} />
      </Routes>
    </Layout>
  );
}
