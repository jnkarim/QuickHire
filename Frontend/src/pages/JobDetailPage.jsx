import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getJobById, submitApplication } from "../utils/api";

const TAG_COLORS = {
  "Full Time": "bg-green-50 text-green-700 border-green-200",
  "Part Time": "bg-blue-50 text-blue-700 border-blue-200",
  Remote: "bg-orange-50 text-orange-600 border-orange-200",
  Internship: "bg-purple-50 text-purple-700 border-purple-200",
};

function CompanyAvatar({ company, size = "lg" }) {
  const colors = ["bg-blue-500","bg-green-500","bg-purple-500","bg-orange-500","bg-pink-500","bg-teal-500"];
  const idx = company.charCodeAt(0) % colors.length;
  const sizeClass = size === "lg" ? "w-20 h-20 text-3xl" : "w-12 h-12 text-lg";
  return (
    <div className={`${sizeClass} ${colors[idx]} rounded-full flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold">{company[0].toUpperCase()}</span>
    </div>
  );
}

const INITIAL_FORM = { name: "", email: "", resumeLink: "", coverNote: "" };

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      } catch (err) {
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
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

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
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
          <div className="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{error}</p>
        <Link to="/jobs" className="btn-primary text-sm">Browse Jobs</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/jobs" className="hover:text-primary">Jobs</Link>
          <span>/</span>
          <span className="text-dark font-medium">{job.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <CompanyAvatar company={job.company} />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {job.type && (
                      <span className={`tag border ${TAG_COLORS[job.type] || "bg-green-50 text-green-700 border-green-200"}`}>
                        {job.type}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-dark mt-1">{job.title}</h1>
                  <p className="text-gray-500 mt-1">
                    <span className="font-medium text-dark">{job.company}</span>
                    {" · "}
                    <span>{job.location}</span>
                  </p>
                  {job.category && (
                    <span className="inline-block mt-2 tag bg-primary-light text-primary border-primary/20">
                      {job.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-dark mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Apply Form */}
            <div className="bg-white border border-gray-200 p-6" id="apply-form">
              <h2 className="text-lg font-bold text-dark mb-1">Apply for this position</h2>
              <p className="text-sm text-gray-500 mb-6">
                Fill in the form below and we'll get back to you shortly.
              </p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-bold text-green-800 text-lg mb-1">Application Submitted!</h3>
                  <p className="text-green-600 text-sm mb-4">
                    Thank you for applying to <strong>{job.title}</strong> at {job.company}.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-outline text-sm"
                    >
                      Apply Again
                    </button>
                    <Link to="/jobs" className="btn-primary text-sm">
                      Browse More Jobs
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`input-field ${formErrors.name ? "border-red-400" : ""}`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`input-field ${formErrors.email ? "border-red-400" : ""}`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">
                      Resume Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      name="resumeLink"
                      value={form.resumeLink}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/your-resume"
                      className={`input-field ${formErrors.resumeLink ? "border-red-400" : ""}`}
                    />
                    {formErrors.resumeLink && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.resumeLink}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark mb-1.5">
                      Cover Note{" "}
                      <span className="text-gray-400 font-normal text-xs">(optional, max 1000 chars)</span>
                    </label>
                    <textarea
                      name="coverNote"
                      value={form.coverNote}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us why you're a great fit for this role..."
                      className={`input-field resize-none ${formErrors.coverNote ? "border-red-400" : ""}`}
                    />
                    <div className="flex justify-between mt-1">
                      {formErrors.coverNote ? (
                        <p className="text-red-500 text-xs">{formErrors.coverNote}</p>
                      ) : <span />}
                      <span className={`text-xs ${form.coverNote.length > 900 ? "text-orange-500" : "text-gray-400"}`}>
                        {form.coverNote.length}/1000
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            {/* Quick Info */}
            <div className="bg-white border border-gray-200 p-5 sticky top-20">
              <h3 className="font-bold text-dark text-sm mb-4">Job Overview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-xs">Company</p>
                    <p className="font-semibold text-dark">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-xs">Location</p>
                    <p className="font-semibold text-dark">{job.location}</p>
                  </div>
                </div>
                {job.type && (
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-400 text-xs">Job Type</p>
                      <p className="font-semibold text-dark">{job.type}</p>
                    </div>
                  </div>
                )}
                {job.category && (
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <p className="text-gray-400 text-xs">Category</p>
                      <p className="font-semibold text-dark">{job.category}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-400 text-xs">Posted</p>
                    <p className="font-semibold text-dark">
                      {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="#apply-form"
                className="btn-primary w-full text-sm text-center block mt-6"
              >
                Apply Now
              </a>
              <Link
                to="/jobs"
                className="btn-outline w-full text-sm text-center block mt-2"
              >
                ← Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
