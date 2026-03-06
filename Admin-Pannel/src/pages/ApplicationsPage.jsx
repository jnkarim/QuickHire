import { useState, useEffect } from "react";
import { getAllApplications, updateApplicationStatus, deleteApplication } from "../utils/api";

const STATUSES = ["Pending", "Reviewed", "Shortlisted", "Rejected"];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchApps();
  }, [filterStatus]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (filterStatus) params.status = filterStatus;
      const res = await getAllApplications(params);
      setApplications(res.data.data || []);
      setTotal(res.data.meta?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateApplicationStatus(id, status);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
      setTotal((prev) => prev - 1);
      setDeleteConfirm(null);
    } catch (err) {
      alert("Failed to delete application");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{total} total applications</p>
        </div>
        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className="col-span-3">Applicant</div>
          <div className="col-span-3">Job</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Resume</div>
          <div className="col-span-1 text-right">Del</div>
        </div>

        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-4 border-b border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          ))
        ) : applications.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            No applications {filterStatus && `with status "${filterStatus}"`}
          </div>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 items-center last:border-0">
              <div className="col-span-3 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{app.name}</p>
                <p className="text-xs text-gray-500 truncate">{app.email}</p>
              </div>
              <div className="col-span-3 min-w-0">
                <p className="text-sm text-gray-700 truncate">
                  {app.jobId?.title || "—"}
                </p>
                <p className="text-xs text-gray-500 truncate">{app.jobId?.company}</p>
              </div>
              <div className="col-span-2">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  disabled={updatingId === app._id}
                  className={`text-xs font-medium px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer ${STATUS_COLORS[app.status]}`}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="col-span-1">
                <a href={app.resumeLink} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-medium">
                  View
                </a>
              </div>
              <div className="col-span-1 text-right">
                {deleteConfirm === app._id ? (
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => handleDelete(app._id)}
                      className="text-xs bg-red-500 text-white px-1.5 py-0.5 hover:bg-red-600">✓</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="text-xs border border-gray-300 px-1.5 py-0.5">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(app._id)}
                    className="text-xs text-red-400 hover:text-red-600">Del</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
