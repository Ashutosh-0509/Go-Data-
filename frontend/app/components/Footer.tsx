import Link from "next/link";
import { BarChart3, Shield, ExternalLink } from "lucide-react";

import { getApiDocsUrl } from "../config/api";

export default function Footer() {
  const apiDocsUrl = getApiDocsUrl();
  return (
    <footer className="w-full bg-[#18332F] text-[#EBE7DC] border-t border-[#2D6A59]/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2D6A59] flex items-center justify-center text-white">
                <BarChart3 className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">Smart Data Analyst</span>
            </div>
            <p className="text-xs text-[#EBE7DC]/70 leading-relaxed">
              Automated data cleaning, statistical outlier treatment, exploratory data visualization, and machine learning benchmarking.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Workspace</h4>
            <ul className="space-y-2 text-xs text-[#EBE7DC]/75">
              <li><Link href="/" className="hover:text-emerald-300 transition-colors">Data Profiling</Link></li>
              <li><Link href="/" className="hover:text-emerald-300 transition-colors">Data Cleaning</Link></li>
              <li><Link href="/" className="hover:text-emerald-300 transition-colors">Outlier Treatment</Link></li>
              <li><Link href="/" className="hover:text-emerald-300 transition-colors">Machine Learning</Link></li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-[#EBE7DC]/75">
              <li><Link href="/admin" className="hover:text-emerald-300 transition-colors">Admin Console</Link></li>
              <li><Link href="/feedback" className="hover:text-emerald-300 transition-colors">User Feedback</Link></li>
              <li><Link href="/login" className="hover:text-emerald-300 transition-colors">Sign In</Link></li>
              <li>
                <a
                  href={apiDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-300 transition-colors"
                >
                  API Docs (FastAPI) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy Guarantee */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Privacy Guarantee</h4>
            <div className="p-3 rounded-xl bg-[#2D6A59]/20 border border-[#2D6A59]/40 text-xs text-[#EBE7DC]/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <Shield className="w-3.5 h-3.5" />
                In-Memory Processing
              </div>
              <p className="text-[11px] leading-relaxed text-[#EBE7DC]/70">
                Datasets are processed in memory, not stored persistently. No user spreadsheets are retained on cloud servers.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#2D6A59]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#EBE7DC]/60 gap-4">
          <div>
            © {new Date().getFullYear()} Smart Data Analyst Studio.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-emerald-300">Workspace</Link>
            <span>•</span>
            <Link href="/feedback" className="hover:text-emerald-300">Share Feedback</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-emerald-300">System Telemetry</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
