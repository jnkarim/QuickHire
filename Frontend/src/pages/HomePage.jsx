import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import { getJobs, getCategories } from "../utils/api";

const CATEGORY_ICONS = {
  "UI/UX Designer": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  "Senior Software Engineer": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  "Junior Software Engineer": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
    </svg>
  ),
  "Machine Learning Engineer": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  ),
  "Human Resources": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  "DevOps Engineer": (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
    </svg>
  ),
};

const COMPANIES = ["vodafone", "intel", "TESLA", "AMD", "Talkit"];

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, catRes] = await Promise.all([
          getJobs({ limit: 8 }),
          getCategories(),
        ]);
        const jobs = jobsRes.data.data || [];
        setFeaturedJobs(jobs.slice(0, 4));
        setLatestJobs(jobs.slice(0, 8));
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = ({ search, location }) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero*/}
      <section className="bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark leading-tight">
              Discover <br />more than{" "}
              <span className="text-accent relative inline-block">
                5000+ Jobs
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 6 Q50 2 100 6 Q150 10 200 6" stroke="#26A4FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-gray-500 text-base max-w-md">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>
            <div className="mt-8">
              <SearchBar onSearch={handleSearch} />
              <p className="mt-3 text-sm text-gray-500">
                <span className="font-medium">Popular:</span>{" "}
                {["UI Designer", "UX Researcher", "Android", "Admin"].map((tag, i, arr) => (
                  <span key={tag}>
                    <button
                      onClick={() => handleSearch({ search: tag, location: "" })}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {tag}
                    </button>
                    {i < arr.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Hero graphic */}
          <div className="flex-1 relative hidden lg:flex justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-lg transform rotate-6" />
              <div className="absolute inset-4 border-2 border-primary/10 rounded-lg transform rotate-3" />
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-black text-primary/20">Q</div>
                  <div className="text-primary font-bold text-xl mt-2">QuickHire</div>
                  <div className="text-gray-400 text-sm mt-1">5000+ Opportunities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company logos */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm text-gray-400 mb-4">Companies we helped grow</p>
            <div className="flex flex-wrap gap-8 items-center">
              {COMPANIES.map((c) => (
                <span key={c} className="text-gray-400 font-bold text-lg tracking-wider">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-dark">
            Explore by <span className="text-primary">category</span>
          </h2>
          <Link to="/jobs" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Show all jobs →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat, idx) => (
            <Link
              key={cat._id}
              to={`/jobs?category=${encodeURIComponent(cat._id)}`}
              className={`p-6 border-2 transition-all duration-200 hover:shadow-md group ${idx === 2
                ? "bg-primary border-primary text-white"
                : "bg-white border-gray-200 hover:border-primary"
                }`}
            >
              <div className={`mb-4 ${idx === 2 ? "text-white" : "text-primary"}`}>
                {CATEGORY_ICONS[cat._id] || (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <h3 className={`font-bold text-sm mb-1 ${idx === 2 ? "text-white" : "text-dark"}`}>
                {cat._id}
              </h3>
              <p className={`text-xs flex items-center gap-1 ${idx === 2 ? "text-blue-200" : "text-gray-500"}`}>
                {cat.count} jobs available →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto rounded-none overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">Start posting jobs today</h2>
            <p className="text-blue-200 text-sm">Start posting jobs for only $10.</p>
            <Link
              to="/admin/new"
              className="mt-6 inline-block border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white hover:text-primary transition-colors text-sm"
            >
              Sign Up For Free
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 w-72">
              <div className="text-white/80 text-xs mb-3 font-medium">QuickHire Dashboard</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[["76", "Candidates"], ["3", "Schedule"], ["24", "Messages"]].map(([n, l]) => (
                  <div key={l} className="bg-white/20 rounded p-2 text-center">
                    <div className="text-white font-bold text-lg">{n}</div>
                    <div className="text-white/70 text-xs">{l}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/20 rounded p-3">
                <div className="text-white/70 text-xs mb-1">Job Statistics</div>
                <div className="flex gap-1 items-end h-10">
                  {[60, 40, 80, 50, 70, 45, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/40 rounded-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs  */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-dark">
            Featured <span className="text-accent">jobs</span>
          </h2>
          <Link to="/jobs" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Show all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No jobs yet. <Link to="/admin/new" className="text-primary underline">Post the first one!</Link></p>
          </div>
        )}
      </section>

      {/* Latest Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-dark">
            Latest <span className="text-accent">jobs open</span>
          </h2>
          <Link to="/jobs" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Show all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 p-6 animate-pulse flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : latestJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestJobs.map((job) => (
              <JobCard key={job._id} job={job} variant="list" />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No jobs found.</p>
        )}
      </section>
    </div>
  );
}
