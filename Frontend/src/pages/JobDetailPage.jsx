import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById, submitApplication } from "../utils/api";
import {
  Building2, MapPin, Clock, Tag, CalendarDays,
  ChevronRight, ArrowLeft, Send, AlertCircle,
  CheckCircle2, Loader2, User, Mail, Link2,
} from "lucide-react";

const TAG_COLORS = {
  "Full Time": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Part Time": "bg-sky-50 text-sky-700 border border-sky-200",
  Remote: "bg-orange-50 text-orange-600 border border-orange-200",
  Internship: "bg-violet-50 text-violet-700 border border-violet-200",
};

const INITIAL_FORM = { name: "", email: "", resumeLink: "", coverNote: "" };

const inputBase =
  "w-full px-3.5 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all duration-150 placeholder:text-gray-300 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const inputErr =
  "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100";

function RoundLogo({ company, logoUrl, size = "md" }) {
  const sizeClass =
    size === "lg" ? "w-16 h-16 text-xl" :
      size === "sm" ? "w-8 h-8 text-xs" :
        "w-11 h-11 text-sm";

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={company}
        className={`${sizeClass} rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-500 flex-shrink-0 shadow-sm`}>
      {company?.charAt(0).toUpperCase()}
    </div>
  );
}

function Field({ label, required, hint, error, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-600">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1.5">{hint}</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
        )}
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function OverviewRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-indigo-500" />
      </div>
      <div className="pt-0.5">
        <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data.data);
      } catch {
        setError("Job not found or has been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errors.name = "Name must be at least 2 characters";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Please provide a valid email address";
    if (!form.resumeLink.trim() || !/^https?:\/\/.+/.test(form.resumeLink))
      errors.resumeLink = "Please provide a valid URL (starting with http/https)";
    if (form.coverNote.length > 1000)
      errors.coverNote = "Cover note cannot exceed 1000 characters";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitApplication({ ...form, jobId: id });
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      const msg = err.response?.data?.message;
      setSubmitError(Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to submit. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-5xl animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-48" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const coverOk = form.coverNote.length > 0 && form.coverNote.length <= 1000;
  const coverWarn = form.coverNote.length > 900;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-7 font-medium">
          <Link to="/" className="hover:text-indigo-500 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/jobs" className="hover:text-indigo-500 transition-colors">Jobs</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 truncate max-w-xs">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Job Header */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <RoundLogo company={job.company} logoUrl={job.logoUrl} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.type && (
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TAG_COLORS[job.type] || TAG_COLORS["Full Time"]}`}>
                        {job.type}
                      </span>
                    )}
                    {job.category && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {job.category}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">{job.title}</h1>
                  <p className="text-sm text-gray-500 mt-1.5">
                    <span className="font-semibold text-gray-700">{job.company}</span>
                    <span className="mx-1.5 text-gray-300">·</span>
                    <span>{job.location}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Job Description</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Apply Form */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6" id="apply-form">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Apply for this Position</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <p className="text-xs text-gray-400 mb-6">Fill in the form below and we'll get back to you shortly.</p>

              {submitted ? (
                <div className="flex flex-col items-center text-center py-8 px-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Application Submitted!</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm">
                    Thanks for applying to <span className="font-semibold text-gray-700">{job.title}</span> at {job.company}. We'll be in touch soon.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-800 transition-colors"
                    >
                      Apply Again
                    </button>
                    <Link
                      to="/jobs"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Browse More Jobs
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {submitError && (
                    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name" required error={formErrors.name} icon={User}>
                      <input
                        type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="John Doe"
                        className={`${inputBase} pl-9 ${formErrors.name ? inputErr : ""}`}
                      />
                    </Field>
                    <Field label="Email Address" required error={formErrors.email} icon={Mail}>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="john@example.com"
                        className={`${inputBase} pl-9 ${formErrors.email ? inputErr : ""}`}
                      />
                    </Field>
                  </div>

                  <Field label="Resume Link" required error={formErrors.resumeLink} icon={Link2}>
                    <input
                      type="url" name="resumeLink" value={form.resumeLink} onChange={handleChange}
                      placeholder="https://drive.google.com/your-resume"
                      className={`${inputBase} pl-9 ${formErrors.resumeLink ? inputErr : ""}`}
                    />
                  </Field>

                  <Field label="Cover Note" hint="(optional, max 1000 chars)" error={formErrors.coverNote}>
                    <textarea
                      name="coverNote" value={form.coverNote} onChange={handleChange}
                      rows={4}
                      placeholder="Tell us why you're a great fit for this role..."
                      className={`${inputBase} resize-none ${formErrors.coverNote ? inputErr : ""}`}
                    />
                    <div className="flex justify-end mt-1">
                      <span className={`text-xs font-mono ${coverWarn ? "text-orange-400" : coverOk ? "text-emerald-500" : "text-gray-300"}`}>
                        {form.coverNote.length}/1000
                      </span>
                    </div>
                  </Field>

                  <button
                    type="submit" disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors duration-150"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-20">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Job Overview</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="space-y-3.5">
                <OverviewRow icon={Building2} label="Company" value={job.company} />
                <OverviewRow icon={MapPin} label="Location" value={job.location} />
                {job.type && <OverviewRow icon={Clock} label="Job Type" value={job.type} />}
                {job.category && <OverviewRow icon={Tag} label="Category" value={job.category} />}
                <OverviewRow
                  icon={CalendarDays}
                  label="Posted"
                  value={new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                />
              </div>
              <div className="mt-6 space-y-2.5">
                <Link
                  to="/jobs"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Jobs
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}