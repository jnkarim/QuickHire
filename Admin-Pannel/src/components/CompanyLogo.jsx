
const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-red-500",
];

const SIZE_CLASSES = {
  sm: "w-10 h-10 text-base",
  md: "w-12 h-12 text-lg",
  lg: "w-20 h-20 text-3xl",
};

export default function CompanyLogo({ company = "", logoUrl = null, size = "md" }) {
  const colorClass = COLORS[company.charCodeAt(0) % COLORS.length] || COLORS[0];
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${company} logo`}
        className={`${sizeClass} object-contain rounded-lg border border-gray-100 bg-white flex-shrink-0`}
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextSibling.style.display = "flex";
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white font-bold">{company[0]?.toUpperCase() || "?"}</span>
    </div>
  );
}