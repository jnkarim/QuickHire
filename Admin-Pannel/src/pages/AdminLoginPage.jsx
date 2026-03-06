import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg[0] : (msg || "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">Q</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">QuickHire Management</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 p-8">
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm p-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="admin@quickhire.com"
                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full bg-gray-700 border border-gray-600 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          QuickHire Admin · Restricted Access
        </p>
      </div>
    </div>
  );
}
