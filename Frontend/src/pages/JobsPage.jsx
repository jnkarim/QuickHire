import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, SearchX, X } from "lucide-react";
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
    if (value) newParams.set(key, value); else newParams.delete(key);
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

  const clearFilters = () => setSearchParams({ page: "1" });

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

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark text-sm">Filter Jobs</h3>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
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
                        className="accent-indigo-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-indigo-500 transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Job Type
                </h4>
                <div className="space-y-2">
                  {JOB_TYPES.map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={type === t}
                        onChange={() => updateParam("type", type === t ? "" : t)}
                        className="accent-indigo-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-indigo-500 transition-colors">
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>


          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="font-bold text-dark">{total.toLocaleString()}</span>
                <span className="text-gray-500 text-sm ml-1">
                  {total === 1 ? "job" : "jobs"} found
                  {search && ` for "${search}"`}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-indigo-50 text-indigo-500" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-indigo-50 text-indigo-500" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium px-3 py-1.5 rounded-full">
                    Search: {search}
                    <button onClick={() => updateParam("search", "")} className="hover:text-indigo-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium px-3 py-1.5 rounded-full">
                    {category}
                    <button onClick={() => updateParam("category", "")} className="hover:text-indigo-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {type && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-medium px-3 py-1.5 rounded-full">
                    {type}
                    <button onClick={() => updateParam("type", "")} className="hover:text-indigo-800">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Loading skeleton */}
            {loading ? (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border border-gray-200 bg-white rounded-2xl p-6 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-3" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>

            ) : jobs.length === 0 ? (
              /* Empty state */
              <div className="bg-white border border-gray-200 rounded-2xl py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchX className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-2">No jobs found</h3>
                <p className="text-gray-500 text-sm mb-4">Try different keywords or filters</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
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