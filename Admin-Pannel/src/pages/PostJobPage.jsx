import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../utils/api";
import LogoUploader from "../components/LogoUploader";

const CATEGORIES = [
  "Junior Software Engineer", "Senior Software Engineer", "UI/UX Designer",
  "Machine Learning Engineer", "Human Resources", "DevOps Engineer",
];
const TYPES = ["Full Time", "Part Time", "Remote", "Internship"];
const EMPTY = { title: "", company: "", location: "", category: "", type: "", description: "", isActive: true, logoUrl: "" };

const inputBase = "w-full px-3.5 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-150 placeholder:text-gray-300 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const inputError = "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100";

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{children}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

export default function PostJobPage() {
  const navigate = useNavigate();
  const [form, setForm]             = useState(EMPTY);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.category) e.category = "Required";
    if (!form.description.trim() || form.description.length < 50)
      e.description = "Min 50 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSubmitting(true);
    setServerError("");
    try {
      const payload = { ...form };
      if (!payload.logoUrl) delete payload.logoUrl;
      await createJob(payload);
      navigate("/jobs");
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to create job"));
    } finally {
      setSubmitting(false);
    }
  };

  const charOk   = form.description.length >= 50;
  const charWarn = form.description.length > 0 && !charOk;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">Job Board</p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Post a New Job</h1>
          <p className="text-sm text-gray-400 mt-1">Fill in the details below to publish a listing</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

          {serverError && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* Branding */}
            <div>
              <SectionLabel>Branding</SectionLabel>
              <LogoUploader
                value={form.logoUrl}
                onChange={(url) => setForm((p) => ({ ...p, logoUrl: url }))}
              />
            </div>

            {/* Basic Info */}
            <div>
              <SectionLabel>Basic Info</SectionLabel>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Job Title" required error={errors.title}>
                    <input
                      name="title" value={form.title} onChange={handleChange}
                      placeholder="e.g. React Developer"
                      className={`${inputBase} ${errors.title ? inputError : ""}`}
                    />
                  </Field>
                  <Field label="Company" required error={errors.company}>
                    <input
                      name="company" value={form.company} onChange={handleChange}
                      placeholder="e.g. Acme Inc."
                      className={`${inputBase} ${errors.company ? inputError : ""}`}
                    />
                  </Field>
                </div>
                <Field label="Location" required error={errors.location}>
                  <input
                    name="location" value={form.location} onChange={handleChange}
                    placeholder="e.g. Dhaka, Bangladesh or Remote"
                    className={`${inputBase} ${errors.location ? inputError : ""}`}
                  />
                </Field>
              </div>
            </div>

            {/* Role Details */}
            <div>
              <SectionLabel>Role Details</SectionLabel>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" required error={errors.category}>
                    <select
                      name="category" value={form.category} onChange={handleChange}
                      className={`${inputBase} ${errors.category ? inputError : ""}`}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Job Type">
                    <select
                      name="type" value={form.type} onChange={handleChange}
                      className={inputBase}
                    >
                      <option value="">Select type</option>
                      {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>

                <Field label="Description" required hint="(min 50 chars)" error={errors.description}>
                  <textarea
                    name="description" value={form.description} onChange={handleChange}
                    rows={6}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    className={`${inputBase} resize-none ${errors.description ? inputError : ""}`}
                  />
                  <div className="flex justify-end -mt-1">
                    <span className={`text-xs font-mono ${charOk ? "text-emerald-500" : charWarn ? "text-orange-400" : "text-gray-300"}`}>
                      {form.description.length} / 50+
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <SectionLabel>Visibility</SectionLabel>
              <label className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors duration-150">
                <div className="relative flex-shrink-0 w-10 h-6">
                  <input
                    type="checkbox" name="isActive" checked={form.isActive}
                    onChange={handleChange} className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${form.isActive ? "bg-indigo-500" : "bg-gray-200"}`} />
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? "translate-x-5" : "translate-x-1"}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Active listing</p>
                  <p className="text-xs text-gray-400 mt-0.5">Visible to job seekers immediately after posting</p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit" disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors duration-150"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Posting…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Post Job
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setForm(EMPTY); setErrors({}); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-700 transition-colors duration-150"
              >
                Reset
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}