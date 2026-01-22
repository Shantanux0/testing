import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/80 backdrop-blur-md border-b border-gray-100 py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container-cinematic flex items-center justify-between">
        {/* Logo */}
        <Logo scrolled={scrolled} />

        {/* Desktop Links - Conditionally Rendered */}
        <div className="hidden md:flex items-center gap-10">
          {isAuthenticated ? (
            <>
              <Link to="/create-swap" className="text-xs font-semibold uppercase tracking-widest hover:text-black/60 transition-colors relative group">
                Create Swap
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/dashboard" className="text-xs font-semibold uppercase tracking-widest hover:text-black/60 transition-colors relative group">
                Dashboard
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/about" className="text-xs font-semibold uppercase tracking-widest hover:text-black/60 transition-colors relative group">
                About Us
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          ) : (
            null /* Middle section is empty for unauthenticated users */
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile">
                <Button variant="ghost" className="uppercase text-xs tracking-widest hover:bg-transparent hover:text-black/60">Profile</Button>
              </Link>
              <Button
                onClick={logout}
                className="btn-cinematic-outline py-2 px-6 text-xs h-auto rounded-none border-gray-300"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="ghost" className="uppercase text-xs tracking-widest hover:bg-transparent hover:text-black/60">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-cinematic py-3 px-8 text-xs h-auto rounded-none bg-black text-white hover:bg-black/80">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-black hover:bg-gray-50 transition-colors"
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
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-x-0 top-[var(--nav-height,80px)] bg-white z-40 overflow-hidden"
          >
            <div className="px-6 py-12 space-y-8 flex flex-col items-center text-center">
              {isAuthenticated ? (
                <>
                  <Link to="/create-swap" className="text-2xl font-serif tracking-tight text-black hover:text-black/60 transition-colors">
                    Create Swap
                  </Link>
                  <Link to="/dashboard" className="text-2xl font-serif tracking-tight text-black hover:text-black/60 transition-colors">
                    Dashboard
                  </Link>
                  <a href="#about" className="text-2xl font-serif tracking-tight text-black hover:text-black/60 transition-colors">
                    About Us
                  </a>
                  <Link to="/profile" className="text-2xl font-serif tracking-tight text-black hover:text-black/60 transition-colors">
                    Profile
                  </Link>
                  <div className="pt-8 w-full max-w-xs">
                    <Button onClick={logout} className="w-full btn-cinematic-outline rounded-none py-4">
                      Log Out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="pt-8 w-full max-w-xs grid gap-4">
                  <Link to="/signin" className="w-full">
                    <Button variant="outline" className="w-full btn-cinematic-outline rounded-none py-4 border-gray-200">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button className="w-full btn-cinematic rounded-none py-4">
                      Join The Community
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
