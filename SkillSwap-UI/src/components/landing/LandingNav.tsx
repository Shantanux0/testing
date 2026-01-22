import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const LandingNav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, signOut: logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 backdrop-blur-md border-b border-white/20 shadow-elevation-1 py-4"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Logo scrolled={scrolled} />

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-navy-900 transition-colors relative group">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <Button variant="ghost" className="rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-50">Profile</Button>
              </Link>
              <Button
                onClick={logout}
                className="rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" className="rounded-lg font-medium text-slate-600 hover:text-navy-900 hover:bg-slate-50">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="rounded-lg px-6 font-semibold bg-navy-900 text-white shadow-elevation-2 hover:shadow-elevation-3 hover:translate-y-[-2px] transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden shadow-elevation-3"
          >
            <div className="px-6 py-6 space-y-4">
              <Link to="/" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium select-none">
                Home <ChevronRight className="w-4 h-4 text-slate-300" />
              </Link>
              <a href="#features" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium select-none">
                Features <ChevronRight className="w-4 h-4 text-slate-300" />
              </a>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium select-none">
                    Dashboard <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                  <Link to="/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium select-none">
                    Profile <ChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                  <div className="pt-4">
                    <Button onClick={logout} className="w-full rounded-xl bg-slate-900 text-white py-6">
                      Log Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-4 grid gap-3">
                  <Link to="/signin" className="w-full">
                    <Button variant="outline" className="w-full rounded-xl border-slate-200 py-6">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full rounded-xl bg-navy-900 text-white py-6 shadow-lg">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default LandingNav;
