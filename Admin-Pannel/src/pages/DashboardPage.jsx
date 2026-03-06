import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs, getAllApplications } from "../utils/api";

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Shortlisted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

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

  return (
    <div className="p-6 max-w-6xl">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, Admin
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here is your job listings statistic report
        </p>
      </div>

      {/* ── Stat cards — 3 across like the mockup ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        {/* New candidates / applications */}
        <div className="bg-blue-50 rounded-xl p-5">
          <div className={`text-3xl font-extrabold text-blue-600 leading-none ${loading ? "opacity-40" : ""}`}>
            {loading ? "—" : stats.applications}
          </div>
          <p className="text-gray-500 text-sm mt-2">Total applications</p>
        </div>

        {/* Pending */}
        <div className="bg-indigo-50 rounded-xl p-5">
          <div className={`text-3xl font-extrabold text-indigo-600 leading-none ${loading ? "opacity-40" : ""}`}>
            {loading ? "—" : stats.pending}
          </div>
          <p className="text-gray-500 text-sm mt-2">Pending review</p>
        </div>

        {/* Shortlisted */}
        <div className="bg-yellow-50 rounded-xl p-5">
          <div className={`text-3xl font-extrabold text-yellow-500 leading-none ${loading ? "opacity-40" : ""}`}>
            {loading ? "—" : stats.shortlisted}
          </div>
          <p className="text-gray-500 text-sm mt-2">Shortlisted</p>
        </div>
      </div>

      {/* ── Job statistics row ── */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Job statistics</p>
            <p className="text-xs text-gray-400">Overview of your active listings</p>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <p className="text-xs text-gray-400">Jobs Open</p>
              <p className={`text-2xl font-extrabold text-gray-800 ${loading ? "opacity-40" : ""}`}>
                {loading ? "—" : stats.jobs}
              </p>
              <p className="text-xs text-gray-400">Active listings</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Job Applied</p>
              <p className={`text-2xl font-extrabold text-gray-800 ${loading ? "opacity-40" : ""}`}>
                {loading ? "—" : stats.applications}
              </p>
              <p className="text-xs text-gray-400">Total applicants</p>
            </div>
          </div>
        </div>

        {/* Mini bar chart — proportional to stats */}
        <div className="mt-4 flex gap-1 items-end h-12">
          {recentJobs.map((job, i) => {
            const heights = [55, 40, 70, 60, 80, 50, 90];
            const ha = heights[i % heights.length];
            const hb = heights[(i + 1) % heights.length];
            return (
              <div key={job._id} className="flex-1 flex gap-px items-end">
                <div className="flex-1 bg-primary/20 rounded-sm" style={{ height: `${ha}%` }} />
                <div className="flex-1 bg-primary rounded-sm" style={{ height: `${hb}%` }} />
              </div>
            );
          })}
          {/* Fill remaining slots if fewer than 7 jobs */}
          {Array.from({ length: Math.max(0, 7 - recentJobs.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 flex gap-px items-end">
              <div className="flex-1 bg-gray-100 rounded-sm" style={{ height: "20%" }} />
              <div className="flex-1 bg-gray-200 rounded-sm" style={{ height: "20%" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Jobs + Recent Applications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Jobs */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Jobs</h2>
            <Link to="/jobs" className="text-xs text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse flex gap-3 items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1.5" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="w-12 h-5 bg-gray-100 rounded" />
                </div>
              ))
            ) : recentJobs.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400 text-sm">
                No jobs yet.{" "}
                <Link to="/jobs/new" className="text-primary hover:underline">Post one</Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job._id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center
                    text-primary font-bold text-sm flex-shrink-0">
                    {job.company[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.company} · {job.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 font-medium rounded-full flex-shrink-0
                    ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Applications</h2>
            <Link to="/applications" className="text-xs text-primary hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="px-5 py-3 animate-pulse flex gap-3 items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1.5" />
                    <div className="h-2.5 bg-gray-100 rounded w-2/3" />
                  </div>
                  <div className="w-16 h-5 bg-gray-100 rounded-full" />
                </div>
              ))
            ) : recentApps.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400 text-sm">
                No applications yet.
              </div>
            ) : (
              recentApps.map((app) => (
                <div key={app._id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{app.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {app.jobId?.title || app.email}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 font-medium rounded-full flex-shrink-0
                    ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-600"}`}>
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