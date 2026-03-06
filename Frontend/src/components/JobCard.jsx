import { Link } from "react-router-dom";
import CompanyLogo from "./CompanyLogo";

const TAG_COLORS = {
  "Full Time": "tag-green",
  "Part Time": "tag-blue",
  Remote: "tag-orange",
  Internship: "tag-purple",
};

const CATEGORY_COLORS = {
  "UI/UX Designer": "tag-blue",
  "Senior Software Engineer": "tag-purple",
  "Junior Software Engineer": "tag-orange",
  "Machine Learning Engineer": "tag-green",
  "Human Resources": "tag-orange",
  "DevOps Engineer": "tag-blue",
};

export default function JobCard({ job, variant = "grid" }) {
  if (variant === "list") {
    return (
      <Link to={`/jobs/${job._id}`} className="block">
        <div className="card flex items-center gap-4">
          <CompanyLogo company={job.company} logoUrl={job.logoUrl} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-dark text-base">{job.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {job.company} &bull; {job.location}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.type && <span className={`tag ${TAG_COLORS[job.type] || "tag-green"}`}>{job.type}</span>}
              {job.category && <span className={`tag ${CATEGORY_COLORS[job.category] || "tag-blue"}`}>{job.category}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/jobs/${job._id}`} className="block">
      <div className="card flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <CompanyLogo company={job.company} logoUrl={job.logoUrl} size="md" />
          {job.type && (
            <span className={`tag ${TAG_COLORS[job.type] || "tag-green"}`}>{job.type}</span>
          )}
        </div>
        <h3 className="font-semibold text-dark text-base mt-1">{job.title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {job.company} &bull; {job.location}
        </p>
        <p className="text-sm text-gray-400 mt-2 line-clamp-2 flex-1">
          {job.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {job.category && (
            <span className={`tag ${CATEGORY_COLORS[job.category] || "tag-blue"}`}>
              {job.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}