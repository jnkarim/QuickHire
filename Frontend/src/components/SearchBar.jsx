import { useState } from "react";

export default function SearchBar({ onSearch, initialSearch = "", initialLocation = "" }) {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, location });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center">
      {/* Keyword */}
      <div className="flex items-center gap-3 flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Job title or keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 focus:outline-none text-sm font-medium text-dark placeholder-gray-400"
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-3 flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 focus:outline-none text-sm font-medium text-dark placeholder-gray-400"
        />
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary text-sm m-0 whitespace-nowrap px-8 py-4">
        Search my job
      </button>
    </form>
  );
}
