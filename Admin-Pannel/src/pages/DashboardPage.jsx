import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs, getAllApplications } from "../utils/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, pending: 0, shortlisted: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          getJobs({ limit: 5 }),
          getAllApplications({ limit: 5 }),
        ]);
        const jobs = jobsRes.data.data || [];
        const apps = appsRes.data.data || [];
        const meta = appsRes.data.meta || {};

        setStats({
          jobs: jobsRes.data.meta?.total || jobs.length,
          applications: meta.total || apps.length,
          pending: apps.filter((a) => a.status === "Pending").length,
          shortlisted: apps.filter((a) => a.status === "Shortlisted").length,
        });
        setRecentJobs(jobs);
        setRecentApps(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STAT_CARDS = [
    { label: "Total Jobs", value: stats.jobs, color: "bg-blue-500", icon: "💼" },
    { label: "Applications", value: stats.applications, color: "bg-purple-500", icon: "📋" },
    { label: "Pending Review", value: stats.pending, color: "bg-yellow-500", icon: "⏳" },
    { label: "Shortlisted", value: stats.shortlisted, color: "bg-green-500", icon: "✅" },
  ];

  const STATUS_COLORS = {
    Pending: "bg-yellow-100 text-yellow-700",
    Reviewed: "bg-blue-100 text-blue-700",
    Shortlisted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`${s.color} text-white text-xs font-bold px-2 py-1 rounded`}>
                {loading ? "..." : s.value}
              </span>
            </div>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Jobs</h2>
            <Link to="/jobs" className="text-xs text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : recentJobs.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">
                No jobs yet.{" "}
                <Link to="/jobs/new" className="text-primary hover:underline">Post one</Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job._id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {job.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 font-medium ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Applications</h2>
            <Link to="/applications" className="text-xs text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse flex gap-3">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : recentApps.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-400 text-sm">No applications yet.</div>
            ) : (
              recentApps.map((app) => (
                <div key={app._id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{app.name}</p>
                    <p className="text-xs text-gray-500 truncate">{app.email}</p>
                  </div>
                  <span className={`badge text-xs ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-600"}`}>
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
