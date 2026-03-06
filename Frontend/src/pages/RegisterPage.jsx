import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name || form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email is required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSubmitting(true);
    setServerError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/jobs");
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg[0] : (msg || "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  })();

  const pwMeta = [
    { color: "bg-rose-400",   label: "Weak" },
    { color: "bg-amber-400",  label: "Fair" },
    { color: "bg-blue-500",   label: "Good" },
    { color: "bg-emerald-500",label: "Strong" },
  ];

  const inputBase = "w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500";
  const inputError = "border-rose-400 focus:ring-rose-400/20 focus:border-rose-400";
  const inputNormal = "border-gray-200";

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ── Left panel (desktop only) ── */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/[0.04]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="grid grid-cols-8 gap-5 opacity-10">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-white" />
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="font-extrabold text-indigo-600 text-lg">Q</span>
          </div>
          <span className="text-white font-extrabold text-xl">QuickHire</span>
        </div>

        {/* Tagline + perks */}
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Join <span className="text-amber-400">thousands</span> of job seekers today.
          </h2>
          <p className="text-white/70 text-[15px] leading-relaxed max-w-xs mb-8">
            Create a free account and start applying to top companies in minutes.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icon: "🎯", text: "Personalized job recommendations" },
              { icon: "⚡", text: "One-click applications" },
              { icon: "📊", text: "Track all your applications" },
              { icon: "🔔", text: "Real-time job alerts" },
            ].map((p) => (
              <div key={p.text} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center shrink-0 text-base">
                  {p.icon}
                </div>
                {p.text}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 relative z-10">
          {[
            { num: "5K+", label: "Active Jobs" },
            { num: "100+", label: "Companies" },
            { num: "Free", label: "Always" },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-white">
              <div className="text-xl font-extrabold">{s.num}</div>
              <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-base">Q</span>
            </div>
            <span className="font-extrabold text-xl text-gray-900">QuickHire</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1.5">Create Your Account</h1>
          <p className="text-sm text-gray-500 mb-8">Free forever. No payment required.</p>

          {/* Server error */}
          {serverError && (
            <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3 mb-5">
              <svg className="mt-0.5 shrink-0" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Julker Nayeen Karim"
                  className={`${inputBase} pr-4 ${errors.name ? inputError : inputNormal}`}
                />
              </div>
              {errors.name && (
                <p className="flex items-center gap-1 text-rose-500 text-xs mt-1.5">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="julker@gmail.com"
                  className={`${inputBase} pr-4 ${errors.email ? inputError : inputNormal}`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-rose-500 text-xs mt-1.5">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password + Confirm — side by side */}
            <div className="grid grid-cols-2 gap-4">

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 6 chars"
                    className={`${inputBase} ${errors.password ? inputError : inputNormal}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1 text-rose-500 text-xs mt-1.5">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.password}
                  </p>
                )}
                {/* Strength meter */}
                {form.password && !errors.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className={`h-1 flex-1 rounded-full transition-all ${pwStrength >= n ? pwMeta[pwStrength - 1].color : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-semibold ${["", "text-rose-400", "text-amber-500", "text-blue-500", "text-emerald-500"][pwStrength]}`}>
                      {pwMeta[pwStrength - 1]?.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Confirm
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat"
                    className={`${inputBase} ${errors.confirmPassword ? inputError : inputNormal}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirm ? (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="flex items-center gap-1 text-rose-500 text-xs mt-1.5">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-px active:translate-y-0 transition disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Free Account
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-indigo-600 hover:underline font-medium">Terms</Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-indigo-600 hover:underline font-medium">Privacy Policy</Link>.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Log in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}