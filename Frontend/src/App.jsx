import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";


function ScrollToTop() {
  return null;
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route
              path="*"
              element={
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                  <h1 className="text-6xl font-black text-gray-200 mb-4">404</h1>
                  <p className="text-gray-500 mb-6">Page not found</p>
                  <a href="/" className="btn-primary text-sm">Go Home</a>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
