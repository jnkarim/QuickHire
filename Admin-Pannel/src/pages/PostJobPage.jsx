// admin/src/pages/PostJobPage.jsx
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

export default function PostJobPage() {
  const navigate = useNavigate();
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
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
      if (!payload.logoUrl) delete payload.logoUrl; // don't send empty string
      await createJob(payload);
      navigate("/jobs");
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to create job"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post New Job</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to publish a new job listing</p>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-5">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Company logo — uploaded first so admin associates it with the company field below */}
          <LogoUploader
            value={form.logoUrl}
            onChange={(url) => setForm((p) => ({ ...p, logoUrl: url }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. React Developer"
                className={`input-field ${errors.title ? "border-red-400" : ""}`} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Company <span className="text-red-500">*</span>
              </label>
              <input name="company" value={form.company} onChange={handleChange}
                placeholder="e.g. Acme Inc."
                className={`input-field ${errors.company ? "border-red-400" : ""}`} />
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Location <span className="text-red-500">*</span>
            </label>
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Dhaka, Bangladesh or Remote"
              className={`input-field ${errors.location ? "border-red-400" : ""}`} />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select name="category" value={form.category} onChange={handleChange}
                className={`input-field ${errors.category ? "border-red-400" : ""}`}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="input-field">
                <option value="">Select type</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal text-xs ml-1">(min 50 chars)</span>
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={6} placeholder="Describe the role, responsibilities, and requirements..."
              className={`input-field resize-none ${errors.description ? "border-red-400" : ""}`} />
            <div className="flex justify-between mt-1">
              {errors.description
                ? <p className="text-red-500 text-xs">{errors.description}</p>
                : <span />}
              <span className={`text-xs ${form.description.length < 50 ? "text-orange-400" : "text-gray-400"}`}>
                {form.description.length} chars
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="isActive" id="isActive" checked={form.isActive}
              onChange={handleChange} className="w-4 h-4 accent-primary" />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Active (visible to job seekers)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Posting...
                </>
              ) : "Post Job"}
            </button>
            <button type="button" onClick={() => { setForm(EMPTY); setErrors({}); }}
              className="btn-outline">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}