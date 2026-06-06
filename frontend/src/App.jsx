import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import MemberLayout from "./layouts/MemberLayout.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import MemberMembership from "./pages/member/MemberMembership.jsx";
import MemberPayments from "./pages/member/MemberPayments.jsx";
import MemberProfile from "./pages/member/MemberProfile.jsx";
import Members from "./pages/Members.jsx";
import Memberships from "./pages/Memberships.jsx";
import Payments from "./pages/Payments.jsx";
import Plans from "./pages/Plans.jsx";
import Settings from "./pages/Settings.jsx";

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <ProtectedRoute roles={["admin"]}>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="members" element={<Members />} />
      <Route path="plans" element={<Plans />} />
      <Route path="memberships" element={<Memberships />} />
      <Route path="payments" element={<Payments />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route
      path="/member"
      element={
        <ProtectedRoute roles={["member"]}>
          <MemberLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/member/dashboard" replace />} />
      <Route path="dashboard" element={<MemberDashboard />} />
      <Route path="profile" element={<MemberProfile />} />
      <Route path="membership" element={<MemberMembership />} />
      <Route path="payments" element={<MemberPayments />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
