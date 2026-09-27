"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BarChart3,
  ShieldCheck,
  MessageSquare,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  FileSpreadsheet
} from "lucide-react";

interface NavbarProps {
  onLoadDemo?: () => void;
  hasDataset?: boolean;
  currentUser?: { name: string; email: string; role: string } | null;
  onRequireAuth?: () => void;
}

export default function Navbar({ onLoadDemo, hasDataset, currentUser: propUser, onRequireAuth }: NavbarProps) {
  const pathname = usePathname();
  const [internalUser, setInternalUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkStoredUser = () => {
      const storedUser = localStorage.getItem("sda_user");
      if (storedUser) {
        try {
          setInternalUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user session", e);
        }
      } else {
        setInternalUser(null);
      }
    };

    checkStoredUser();
    window.addEventListener("storage", checkStoredUser);
    return () => window.removeEventListener("storage", checkStoredUser);
  }, [pathname]);

  const currentUser = propUser !== undefined ? propUser : internalUser;

  const handleLogout = () => {
    localStorage.removeItem("sda_user");
    setInternalUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Workspace", href: "/" },
    { name: "Admin Console", href: "/admin" },
    { name: "Feedback", href: "/feedback" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#18332F] flex items-center justify-center text-white shadow-sm">
              <BarChart3 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-[#18332F] text-base tracking-tight flex items-center gap-1.5">
                Smart Data Analyst
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#2D6A59]/15 text-[#2D6A59]">
                  v2.5
                </span>
              </div>
              <span className="text-[11px] text-[#5A6B65] font-normal leading-none block">
                Automated Data Cleaning, EDA & Machine Learning
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[#18332F] text-white shadow-sm"
                      : "text-[#18332F] hover:bg-[#DFDBD0]/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            {onLoadDemo && !hasDataset && pathname === "/" && (
              <button
                type="button"
                onClick={() => {
                  if (!currentUser && onRequireAuth) {
                    onRequireAuth();
                  } else if (onLoadDemo) {
                    onLoadDemo();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#2D6A59] bg-[#2D6A59]/10 hover:bg-[#2D6A59]/20 border border-[#2D6A59]/25 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#2D6A59]" />
                Demo Dataset
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#DFDBD0]">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/70 border border-[#DFDBD0]">
                  <div className="w-6 h-6 rounded-full bg-[#18332F] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-[#18332F]">{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-[#5A6B65] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-[#18332F] bg-white border border-[#DFDBD0] hover:bg-[#EBE7DC] transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#5A6B65]" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#18332F] hover:bg-[#DFDBD0]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EBE7DC] border-t border-[#DFDBD0] px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                  isActive ? "bg-[#18332F] text-white" : "text-[#18332F]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#DFDBD0]">
            {currentUser ? (
              <div className="flex items-center justify-between py-2">
                <span className="text-xs font-bold text-[#18332F]">{currentUser.name}</span>
                <button onClick={handleLogout} className="text-xs font-bold text-red-700">Sign Out</button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-bold text-white bg-[#18332F] rounded-lg"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
