"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BarChart2,
  ExternalLink,
  LogIn,
  Menu,
  X,
  FileSpreadsheet,
  ArrowRight
} from "lucide-react";
import { getApiDocsUrl } from "../config/api";

interface NavbarProps {
  onLoadDemo?: () => void;
  onStartUpload?: () => void;
  hasDataset?: boolean;
  datasetName?: string;
  currentUser?: { name: string; email: string; role: string } | null;
  onRequireAuth?: () => void;
}

export default function Navbar({
  onLoadDemo,
  onStartUpload,
  hasDataset,
  datasetName,
  currentUser: propUser,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [internalUser, setInternalUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const apiDocsUrl = getApiDocsUrl();

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
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Understand", href: "/" },
    { name: "Clean", href: "/" },
    { name: "Explore", href: "/" },
    { name: "Models", href: "/" },
    { name: "System Status", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 transition-all">
      {/* Top Utility Accessibility Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 sm:px-8 py-1 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-mono text-[10px] text-slate-500 font-medium">
            SMART DATA ANALYST v2.5
          </span>
          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live In-Memory Engine
          </span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-3 font-mono">
            <button type="button" className="hover:text-slate-900 transition-colors cursor-pointer">A-</button>
            <button type="button" className="hover:text-slate-900 transition-colors font-bold cursor-pointer">A</button>
            <button type="button" className="hover:text-slate-900 transition-colors cursor-pointer">A+</button>
          </div>
          <a
            href={apiDocsUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-900 transition-colors hidden sm:inline-flex items-center gap-1 font-medium"
          >
            <span>API Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#2461ED] flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm tracking-tight">
                  Smart Data Analyst
                </div>
                <span className="text-[10px] text-slate-500 font-normal leading-none hidden sm:inline">
                  Interactive Profiling & AutoML
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, idx) => {
                const isActive = idx === 0 && pathname === "/";
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "text-[#2461ED] bg-blue-50 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Role pill, Sign in, and Start button */}
          <div className="hidden sm:flex items-center gap-2.5">
            {hasDataset && datasetName && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-700 font-mono border border-slate-200">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#2461ED]" />
                <span className="truncate max-w-[130px] font-medium">{datasetName}</span>
              </div>
            )}

            {onLoadDemo && (
              <button
                type="button"
                onClick={onLoadDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <span>Try Demo</span>
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[11px] font-mono text-[#2461ED] border border-blue-200 font-semibold">
                  {currentUser.role}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="https://preview--spirited-data-logic-lab.base44.app/login"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign in</span>
                </a>

                <button
                  type="button"
                  onClick={onStartUpload}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#2461ED] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm shadow-blue-500/25 hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onStartUpload}
              className="px-3.5 py-1.5 rounded-full bg-[#2461ED] text-white text-xs font-semibold shadow-xs"
            >
              Start
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-slate-200 space-y-1 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-600 font-medium"
                >
                  Sign Out ({currentUser.name})
                </button>
              ) : (
                <a
                  href="https://preview--spirited-data-logic-lab.base44.app/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#2461ED] font-semibold"
                >
                  Sign in
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
