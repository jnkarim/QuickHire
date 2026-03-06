import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallback from "./pages/AuthCallback";
import BrowseCompaniesPage from "./pages/BrowseCompanies";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Main layout */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/companies" element={<BrowseCompaniesPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/jobs/:id" element={
                    <ProtectedRoute>
                      <JobDetailPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={
                    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                      <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
                      <p className="text-gray-500 mb-6">Page not found</p>
                      <a href="/" className="btn-primary text-sm">Go Home</a>
                    </div>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
