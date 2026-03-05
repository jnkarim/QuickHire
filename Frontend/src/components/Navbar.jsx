import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Q</span>
            </div>
            <span className="text-xl font-bold text-dark">QuickHire</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/jobs"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname.startsWith("/jobs") ? "text-primary" : "text-gray-600"
              }`}
            >
              Find Jobs
            </Link>
            <Link
              to="/admin"
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname.startsWith("/admin") ? "text-primary" : "text-gray-600"
              }`}
            >
              Admin
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/jobs"
              className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link to="/admin" className="btn-primary text-sm">
              Post a Job
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 h-0.5 bg-gray-700 mb-1" />
            <div className="w-5 h-0.5 bg-gray-700 mb-1" />
            <div className="w-5 h-0.5 bg-gray-700" />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 flex flex-col gap-4">
            <Link to="/jobs" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>
              Find Jobs
            </Link>
            <Link to="/admin" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
            <Link to="/admin/new" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>
              Post a Job
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
