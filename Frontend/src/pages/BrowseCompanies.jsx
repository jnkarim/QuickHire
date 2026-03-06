import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../utils/api";

const CompanyLogo = ({ company, logoUrl, size = "md" }) => {
    const sizeClasses = size === "lg" ? "w-16 h-16 text-2xl" : "w-12 h-12 text-lg";
    const firstLetter = company ? company.charAt(0).toUpperCase() : "?";

    return (
        <div className={`${sizeClasses} flex-shrink-0`}>
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={company}
                    className="w-full h-full rounded-full object-cover"
                />
            ) : (
                <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 border border-indigo-100">
                    {firstLetter}
                </div>
            )}
        </div>
    );
};

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
                        <p className="text-blue-600 text-sm font-semibold mb-2 uppercase tracking-widest">
                            Companies
                        </p>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                            Browse{" "}
                            <span className="text-blue-600 relative inline-block">
                                Companies
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-blue-400 rounded-full opacity-50"></span>
                            </span>
                        </h1>
                        <p className="text-gray-500 text-base">
                            Discover{" "}
                            <span className="font-semibold text-gray-900">{companies.length}</span>{" "}
                            companies actively hiring right now
                        </p>
                    </div>

                    {/* Search bar*/}
                    <div className="mt-8 flex gap-3 max-w-xl">
                        <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-gray-400 rounded-full">
                                <div className="absolute -right-1 -bottom-1 w-2 h-0.5 bg-gray-400 rotate-45"></div>
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by company name..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        {search && (
                            <button 
                                onClick={() => setSearch("")} 
                                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {!loading && (
                    <div className="mb-6">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-bold text-gray-900">{filtered.length}</span> {filtered.length === 1 ? "company" : "companies"}
                        </p>
                    </div>
                )}

                {loading ? (
                    /* Skeleton Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-100 p-6 animate-pulse rounded-xl">
                                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white border border-gray-100 py-20 text-center rounded-2xl">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                           <div className="w-6 h-6 border-2 border-gray-300 rounded-sm"></div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No companies found</h3>
                        <p className="text-gray-400 text-sm mb-6">Try adjusting your search terms</p>
                        <button onClick={() => setSearch("")} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm">
                            Clear search
                        </button>
                    </div>
                ) : (
                    /* Company Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((company) => (
                            <Link
                                key={company.name}
                                to={`/jobs?search=${encodeURIComponent(company.name)}`}
                                className="block group"
                            >
                                <div className="bg-white border-2 border-gray-100 p-6 h-full relative overflow-hidden rounded-xl group-hover:border-blue-500 group-hover:shadow-xl transition-all duration-300">
                                    
                                    {/* Animated Top Bar */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                                    <div className="flex items-start justify-between mb-5">
                                        <CompanyLogo
                                            company={company.name}
                                            logoUrl={company.logoUrl}
                                            size="md"
                                        />
                                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                            {company.jobCount} {company.jobCount === 1 ? "role" : "roles"}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                        {company.name}
                                    </h3>

                                    {company.location && (
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                            <span className="truncate">{company.location}</span>
                                        </p>
                                    )}

                                    {/* Categories */}
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {company.categories.slice(0, 2).map((cat) => (
                                            <span key={cat} className="text-[10px] font-semibold bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">
                                                {cat.replace(" Engineer", "").replace(" Designer", "")}
                                            </span>
                                        ))}
                                        {company.categories.length > 2 && (
                                            <span className="text-[10px] font-semibold bg-gray-50 text-gray-400 px-2 py-1 rounded border border-gray-100">
                                                +{company.categories.length - 2}
                                            </span>
                                        )}
                                    </div>


                                    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors">View open roles</span>
                                        <div className="w-5 h-5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                            <div className="w-2 h-2 border-t-2 border-r-2 border-blue-600 rotate-45"></div>
                                        </div>
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