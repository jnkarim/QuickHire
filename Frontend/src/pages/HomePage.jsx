import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";
import { getJobs, getCategories } from "../utils/api";
import { SiVodafone, SiIntel, SiTesla, SiAmd } from "react-icons/si";

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

const HERO_IMAGE_URL = "/hero.png";

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
      <section className="bg-gray-50 relative overflow-hidden">

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-8">

          {/* Left: copy + search */}
          <div className="flex-1 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark leading-tight">
              Discover <br />
              more than{" "}
              <span className="text-accent relative inline-block">
                5000+ Jobs
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M0 6 Q50 2 100 6 Q150 10 200 6"
                    stroke="#26A4FF"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-6 text-gray-500 text-base max-w-md">
              Great platform for the job seeker that searching for new career
              heights and passionate about startups.
            </p>
            <div className="mt-8">
              <SearchBar onSearch={handleSearch} />
              <p className="mt-3 text-sm text-gray-500">
                <span className="font-medium">Popular:</span>{" "}
                {["UI Designer", "UX Researcher", "Android", "Admin"].map(
                  (tag, i, arr) => (
                    <span key={tag}>
                      <button
                        onClick={() => handleSearch({ search: tag, location: "" })}
                        className="hover:text-primary hover:underline transition-colors"
                      >
                        {tag}
                      </button>
                      {i < arr.length - 1 && ", "}
                    </span>
                  )
                )}
              </p>
            </div>
          </div>

          <div className="flex-1 relative hidden lg:flex justify-center items-end h-96">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="120" y="20" width="240" height="300" stroke="#c7d2fe" strokeWidth="1.2" transform="rotate(8 240 170)" />
              <rect x="140" y="45" width="200" height="260" stroke="#c7d2fe" strokeWidth="1" transform="rotate(4 240 175)" />
              <rect x="160" y="70" width="160" height="220" stroke="#dbeafe" strokeWidth="0.8" transform="rotate(1 240 180)" />
            </svg>
            <img
              src={HERO_IMAGE_URL}
              alt="Job seeker"
              className="relative z-10 h-full object-contain object-bottom"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        </div>

        {/*Company logos*/}
        <div className="border-t border-gray-200 bg-white w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm text-gray-400 mb-5">Companies we helped grow</p>
            <div className="flex justify-between items-center">

              {/* Vodafone */}
              <div className="flex items-center gap-2 text-gray-400">
                <SiVodafone className="w-5 h-5" />
                <span className="text-base font-normal tracking-wide">vodafone</span>
              </div>

              {/* Intel */}
              <div className="text-gray-400">
                <SiIntel className="h-5 w-auto" />
              </div>

              {/* Tesla */}
              <div className="flex items-center gap-2 text-gray-400">
                <SiTesla className="w-5 h-5" />
                <span className="text-base font-semibold tracking-widest uppercase">Tesla</span>
              </div>

              {/* AMD */}
              <div className="flex items-center gap-2 text-gray-400">
                <SiAmd className="w-5 h-5" />
                <span className="text-base font-bold tracking-wider">AMD</span>
              </div>

              {/* Talkit */}
              <div className="text-gray-400">
                <span
                  className="text-base font-semibold tracking-wide"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Talkit
                </span>
              </div>

            </div>
          </div>
        </div>

      </section>


      {/* Categories  */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-dark">
            Explore by <span className="text-primary">category</span>
          </h2>
          <Link
            to="/jobs"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
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

      {/*  CTA Banner*/}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative flex items-center min-h-[300px]">

          <div className="relative w-full lg:w-[56%] min-h-[300px] rounded-2xl overflow-hidden flex items-center shrink-0">
            <div className="absolute inset-0 bg-primary" />
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(49,46,129,0.5)",
                clipPath: "polygon(72% 0, 100% 0, 100% 100%, 62% 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "rgba(67,56,202,0.4)",
                clipPath: "polygon(62% 0, 72% 0, 62% 100%, 52% 100%)",
              }}
            />
            <div className="relative z-10 px-10 py-12">
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-3">
                Start posting<br />jobs today
              </h2>
              <p className="text-blue-200 text-sm mb-6">Start posting jobs for only $10.</p>
              <Link
                to="/admin/new"
                className="inline-block border-2 border-white text-white px-7 py-3 font-semibold hover:bg-white hover:text-primary transition-colors text-sm"
              >
                Sign Up For Free
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-20" style={{ width: "52%" }}>
            <div className="bg-white rounded-xl shadow-2xl p-4 text-xs border border-gray-100">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-[9px]">Q</span>
                  </div>
                  <span className="font-bold text-gray-800 text-sm">QuickHire</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                    <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    <span className="text-gray-500 text-[10px]">Company Named ∨</span>
                  </div>
                  <button className="bg-primary text-white text-[10px] px-3 py-1.5 rounded font-semibold">+ Post Job</button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-32 shrink-0 border-r border-gray-100 pr-2">
                  <div className="bg-indigo-50 rounded px-2 py-1.5 mb-1">
                    <span className="text-primary font-semibold text-[10px]">Dashboard</span>
                  </div>
                  {["Messages", "Company Profile", "All Applicants", "Job Listing", "My Schedule"].map((item) => (
                    <div key={item} className="px-2 py-1.5 text-gray-400 text-[10px] hover:text-gray-600">{item}</div>
                  ))}
                  <div className="mt-3 border-t border-gray-100 pt-2">
                    {["Settings", "Help Center"].map((item) => (
                      <div key={item} className="px-2 py-1.5 text-gray-400 text-[10px]">{item}</div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-bold text-sm mb-0.5">Good morning, Maria</p>
                  <p className="text-gray-400 text-[9px] mb-3">Here is your job listings statistic report from July 19 - July 25</p>

                  <div className="grid grid-cols-3 gap-1.5 mb-3">
                    {[
                      { n: "76", label: "New candidates to review", num: "text-blue-600", bg: "bg-blue-50" },
                      { n: "3", label: "Schedule for today", num: "text-indigo-600", bg: "bg-indigo-50" },
                      { n: "24", label: "Messages received", num: "text-yellow-500", bg: "bg-yellow-50" },
                    ].map(({ n, label, num, bg }) => (
                      <div key={label} className={`${bg} rounded p-2`}>
                        <div className={`font-extrabold text-base leading-none ${num}`}>{n}</div>
                        <div className="text-[8px] mt-1 text-gray-500 leading-tight">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 bg-gray-50 rounded p-2">
                    <div className="flex-1">
                      <div className="text-[9px] font-semibold text-gray-700 mb-1">Job statistics</div>
                      <div className="flex gap-0.5 items-end h-10">
                        {[
                          [55, 40], [45, 65], [70, 50], [60, 80], [80, 55], [50, 70], [90, 65]
                        ].map(([a, b], i) => (
                          <div key={i} className="flex-1 flex gap-px items-end">
                            <div className="flex-1 bg-primary/25 rounded-sm" style={{ height: `${a}%` }} />
                            <div className="flex-1 bg-primary rounded-sm" style={{ height: `${b}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-right pl-2 border-l border-gray-200">
                      <div>
                        <div className="text-[8px] text-gray-400">Jobs Open</div>
                        <div className="font-extrabold text-sm text-gray-800">12</div>
                        <div className="text-[8px] text-gray-400">Jobs Opened</div>
                      </div>
                      <div className="mt-1">
                        <div className="text-[8px] text-gray-400">Job Applied</div>
                        <div className="font-extrabold text-sm text-gray-800">654</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <span className="text-[9px] text-gray-400">Logged in as Maria</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Featured Jobs  */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-dark">
            Featured <span className="text-accent">jobs</span>
          </h2>
          <Link
            to="/jobs"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
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
            <p>
              No jobs yet.{" "}
              <Link to="/admin/new" className="text-primary underline">
                Post the first one!
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Latest Jobs*/}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-dark">
            Latest <span className="text-accent">jobs open</span>
          </h2>
          <Link
            to="/jobs"
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
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