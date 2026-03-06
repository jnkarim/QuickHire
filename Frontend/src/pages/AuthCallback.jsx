import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * This page lives at /auth/callback
 * Google → backend → redirect here with ?token=JWT
 * We store the token via AuthContext then redirect to /jobs
 */
export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const err   = searchParams.get("error");

    if (err || !token) {
      setError("Google sign-in failed. Please try again.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }

    // Hand the token to AuthContext — it should store it and fetch /me
    loginWithToken(token)
      .then(() => navigate("/jobs", { replace: true }))
      .catch(() => {
        setError("Could not verify your account. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-rose-500">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold">{error}</p>
          <p className="text-sm text-gray-400 mt-1">Redirecting you back…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <svg className="animate-spin mx-auto mb-4 text-indigo-600" width="36" height="36" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <p className="text-gray-600 font-medium">Signing you in…</p>
      </div>
    </div>
  );
}