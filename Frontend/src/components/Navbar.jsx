import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">Q</span>
            </div>
            <span className="text-xl font-bold text-dark">QuickHire</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/jobs" className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname.startsWith("/jobs") ? "text-primary" : "text-gray-600"}`}>
              Find Jobs
            </Link>
            <Link to="/companies" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Browse Companies
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 font-medium">
                  Hi, <span className="text-dark font-semibold">{user.name}</span>
                </span>
                <button onClick={handleLogout} className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-primary-dark transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-700 mb-1" />
            <div className="w-5 h-0.5 bg-gray-700 mb-1" />
            <div className="w-5 h-0.5 bg-gray-700" />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 flex flex-col gap-4">
            <Link to="/jobs" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Find Jobs</Link>
            <Link to="/jobs" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Browse Companies</Link>
            {user ? (
              <>
                <span className="text-sm text-gray-500">Hi, {user.name}</span>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded text-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
