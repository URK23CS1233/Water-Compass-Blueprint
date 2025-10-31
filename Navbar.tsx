import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import { Button } from "./ui/button";
import { Droplets, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/forecast", label: "Forecast" },
    { to: "/map", label: "Map" },
    { to: "/recharge", label: "Recharge" },
    { to: "/score", label: "Score" },
    { to: "/alerts", label: "Alerts" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-black shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center space-x-2"
          >
            <Droplets className="h-6 w-6 text-cyan-600 drop-shadow-sm" />
            <span className="text-lg font-bold text-slate-800 [text-shadow:_1px_1px_2px_rgb(255_255_255_/_50%)]">
              Water Compass Blueprint
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-700 hover:text-cyan-600 font-medium transition backdrop-blur-sm px-3 py-1 rounded-lg hover:bg-white/50 [text-shadow:_1px_1px_1px_rgb(255_255_255_/_40%)]"
                >
                  {link.label}
                </Link>
              ))}
              <Button onClick={handleLogout} variant="ghost" size="sm">
                Logout
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {user && (
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-slate-600 hover:text-cyan-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
