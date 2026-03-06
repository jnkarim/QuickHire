import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import AdminLayout from "./components/AdminLayout";
import AdminLoginPage from "./pages/AdminLoginPage";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import PostJobPage from "./pages/PostJobPage";
import ApplicationsPage from "./pages/ApplicationsPage";

function RequireAdmin({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <svg className="w-8 h-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );
  if (!admin) return <Navigate to="/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

export default function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<RequireAdmin><DashboardPage /></RequireAdmin>} />
          <Route path="/jobs" element={<RequireAdmin><JobsPage /></RequireAdmin>} />
          <Route path="/jobs/new" element={<RequireAdmin><PostJobPage /></RequireAdmin>} />
          <Route path="/applications" element={<RequireAdmin><ApplicationsPage /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}
