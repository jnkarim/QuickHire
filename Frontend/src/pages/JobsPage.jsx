import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { getJobs } from "../utils/api";

const CATEGORIES = [
  "Junior Software Engineer",
  "Senior Software Engineer",
  "UI/UX Designer",
  "Machine Learning Engineer",
  "Human Resources",
  "DevOps Engineer",
];

const JOB_TYPES = ["Full Time", "Part Time", "Remote", "Internship"];

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";

  const limit = 9;
  const totalPages = Math.ceil(total / limit);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (location) params.location = location;
      if (category) params.category = category;
      if (type) params.type = type;

      const res = await getJobs(params);
      setJobs(res.data.data || []);
      setTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, location, category, type]);

  useEffect(() => {
    fetchJobs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchJobs]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleSearch = ({ search: s, location: l }) => {
    const newParams = new URLSearchParams(searchParams);
    if (s) newParams.set("search", s); else newParams.delete("search");
    if (l) newParams.set("location", l); else newParams.delete("location");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ page: "1" });
  };

  const hasFilters = search || location || category || type;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-dark mb-6">Find your dream job</h1>
          <SearchBar onSearch={handleSearch} initialSearch={search} initialLocation={location} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark text-sm">Filter Jobs</h3>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Category
                </h4>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={category === cat}
                        onChange={() => updateParam("category", cat === category ? "" : cat)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Job Type
                </h4>
                <div className="space-y-2">
                  {JOB_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={type === t}
                        onChange={() => updateParam("type", type === t ? "" : t)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job results*/}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="font-bold text-dark">{total.toLocaleString()}</span>
                <span className="text-gray-500 text-sm ml-1">
                  {total === 1 ? "job" : "jobs"} found
                  {search && ` for "${search}"`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 border ${viewMode === "grid" ? "border-primary text-primary" : "border-gray-200 text-gray-400"}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 border ${viewMode === "list" ? "border-primary text-primary" : "border-gray-200 text-gray-400"}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 12.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="flex items-center gap-1 bg-primary-light text-primary text-xs font-medium px-3 py-1.5">
                    Search: {search}
                    <button onClick={() => updateParam("search", "")} className="ml-1 hover:text-primary-dark">×</button>
                  </span>
                )}
                {category && (
                  <span className="flex items-center gap-1 bg-primary-light text-primary text-xs font-medium px-3 py-1.5">
                    {category}
                    <button onClick={() => updateParam("category", "")} className="ml-1 hover:text-primary-dark">×</button>
                  </span>
                )}
                {type && (
                  <span className="flex items-center gap-1 bg-primary-light text-primary text-xs font-medium px-3 py-1.5">
                    {type}
                    <button onClick={() => updateParam("type", "")} className="ml-1 hover:text-primary-dark">×</button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 bg-white p-6 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white border border-gray-200 py-20 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-dark mb-2">No jobs found</h3>
                <p className="text-gray-500 text-sm mb-4">Try different keywords or filters</p>
                <button onClick={clearFilters} className="btn-primary text-sm">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} variant={viewMode === "grid" ? "grid" : "list"} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={(p) => updateParam("page", String(p))}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
