import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs, deleteJob } from "../utils/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const LIMIT = 10;

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await getJobs({ page, limit: LIMIT });
      setJobs(res.data.data || []);
      setTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setTotal((prev) => prev - 1);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete job");
    } finally {
      setDeleting(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total jobs</p>
        </div>
        <Link to="/jobs/new" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post New Job
        </Link>
      </div>

      <div className="bg-white border border-gray-200">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className="col-span-4">Job Title</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Posted</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 px-4 py-4 border-b border-gray-100 animate-pulse">
              <div className="col-span-4 h-4 bg-gray-200 rounded" />
              <div className="col-span-2 h-4 bg-gray-100 rounded" />
              <div className="col-span-2 h-4 bg-gray-100 rounded" />
              <div className="col-span-1 h-4 bg-gray-100 rounded" />
              <div className="col-span-2 h-4 bg-gray-100 rounded" />
            </div>
          ))
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 mb-3">No jobs found</p>
            <Link to="/jobs/new" className="btn-primary text-sm">Post First Job</Link>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 items-center last:border-0">
              <div className="col-span-4 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-600 line-clamp-1">{job.category}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-600">{job.type || "—"}</span>
              </div>
              <div className="col-span-1">
                <span className={`text-xs font-medium px-2 py-0.5 ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {job.isActive ? "Active" : "Off"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                {deleteConfirm === job._id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={deleting === job._id}
                      className="text-xs bg-red-500 text-white px-2 py-1 hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleting === job._id ? "..." : "Yes"}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="text-xs border border-gray-300 px-2 py-1 hover:bg-gray-50"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(job._id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-sm font-medium border ${p === page ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
