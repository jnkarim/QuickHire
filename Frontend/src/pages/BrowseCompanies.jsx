import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../utils/api";
import CompanyLogo from "../components/CompanyLogo";

export default function BrowseCompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await getJobs({ limit: 50 });
                const jobs = res.data.data || [];

                const map = new Map();
                jobs.forEach((job) => {
                    if (!map.has(job.company)) {
                        map.set(job.company, {
                            name: job.company,
                            logoUrl: job.logoUrl || null,
                            jobCount: 1,
                            categories: new Set([job.category].filter(Boolean)),
                            location: job.location,
                        });
                    } else {
                        const existing = map.get(job.company);
                        existing.jobCount += 1;
                        if (job.logoUrl && !existing.logoUrl) existing.logoUrl = job.logoUrl;
                        if (job.category) existing.categories.add(job.category);
                    }
                });

                setCompanies(
                    Array.from(map.values()).map((c) => ({
                        ...c,
                        categories: Array.from(c.categories),
                    }))
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filtered = companies.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen">

            {/* Hero header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-2xl">
                        <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-widest">
                            Companies
                        </p>
                        <h1 className="text-4xl font-extrabold text-dark leading-tight mb-3">
                            Browse{" "}
                            <span className="text-primary relative inline-block">
                                Companies
                                <svg className="absolute -bottom-1 left-0 w-full" height="6"
                                    viewBox="0 0 200 6" fill="none">
                                    <path d="M0 4 Q50 1 100 4 Q150 7 200 4"
                                        stroke="#26A4FF" strokeWidth="2" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-gray-500 text-base">
                            Discover{" "}
                            <span className="font-semibold text-dark">{companies.length}</span>{" "}
                            companies actively hiring right now
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mt-8 flex gap-3 max-w-xl">
                        <div className="relative flex-1">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by company name..."
                                className="input-field pl-10 w-full"
                            />
                        </div>
                        {search && (
                            <button onClick={() => setSearch("")} className="btn-outline text-sm px-4">
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Result count */}
                {!loading && (
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm text-gray-500">
                            Showing{" "}
                            <span className="font-bold text-dark">{filtered.length}</span>{" "}
                            {filtered.length === 1 ? "company" : "companies"}
                            {search && <span className="text-gray-400"> for "{search}"</span>}
                        </p>
                    </div>
                )}

                {/* Skeleton */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 p-6 animate-pulse">
                                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                                <div className="h-px bg-gray-100 mb-3" />
                                <div className="h-3 bg-gray-100 rounded w-1/3" />
                            </div>
                        ))}
                    </div>

                ) : filtered.length === 0 ? (
                    <div className="bg-white border border-gray-200 py-24 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-1">No companies found</h3>
                        <p className="text-gray-400 text-sm mb-5">No results for "{search}"</p>
                        <button onClick={() => setSearch("")} className="btn-primary text-sm">
                            Clear search
                        </button>
                    </div>

                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((company) => (
                            <Link
                                key={company.name}
                                to={`/jobs?search=${encodeURIComponent(company.name)}`}
                                className="block group"
                            >
                                <div className="bg-white border-2 border-gray-100 p-6 h-full relative overflow-hidden
                  group-hover:border-primary group-hover:shadow-lg transition-all duration-200">


                                    <div className="absolute top-0 left-0 w-full h-0.5 bg-primary
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />


                                    <div className="flex items-start justify-between mb-4">
                                        <CompanyLogo
                                            company={company.name}
                                            logoUrl={company.logoUrl}
                                            size="md"
                                        />
                                        <span className="text-xs font-semibold text-primary bg-blue-50 px-2 py-1 rounded-full flex-shrink-0">
                                            {company.jobCount} {company.jobCount === 1 ? "job" : "jobs"}
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <h3 className="font-bold text-dark text-base leading-snug
                    group-hover:text-primary transition-colors duration-200">
                                        {company.name}
                                    </h3>

                                    {/* Location */}
                                    {company.location && (
                                        <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span className="truncate">{company.location}</span>
                                        </p>
                                    )}

                                    {/* Category pills  */}
                                    {company.categories.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {company.categories.slice(0, 2).map((cat) => (
                                                <span key={cat}
                                                    className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                                    {cat.replace(" Engineer", "").replace(" Designer", "")}
                                                </span>
                                            ))}
                                            {company.categories.length > 2 && (
                                                <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                                                    +{company.categories.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">View open roles</span>
                                        <svg className="w-4 h-4 text-primary
                      transform group-hover:translate-x-1 transition-transform duration-200"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}