import Link from "next/link";
import { BarChart2, ShieldCheck, ExternalLink } from "lucide-react";
import { getApiDocsUrl } from "../config/api";

export default function Footer() {
  const apiDocsUrl = getApiDocsUrl();

  return (
    <footer className="w-full bg-slate-50/80 text-slate-600 border-t border-slate-200/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2461ED] flex items-center justify-center text-white shadow-xs">
                <BarChart2 className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                Smart Data Analyst
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Automated data profiling, cleaning, outlier detection, visual exploration, and machine learning benchmarking in one interactive workspace.
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              In-Memory Engine • FastAPI & Scikit-Learn
            </div>
          </div>

          {/* Core Capabilities */}
          <div>
            <div className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Capabilities
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#2461ED] transition-colors">
                  Understand Your Data
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#2461ED] transition-colors">
                  Clean Data
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#2461ED] transition-colors">
                  Find Unusual Values
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#2461ED] transition-colors">
                  Explore Patterns
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#2461ED] transition-colors">
                  Build & Compare Models
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation & API */}
          <div>
            <div className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Platform
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#2461ED] transition-colors">
                  Interactive Workspace
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#2461ED] transition-colors">
                  Admin Console
                </Link>
              </li>
              <li>
                <a
                  href="https://preview--spirited-data-logic-lab.base44.app/workspace/help"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#2461ED] transition-colors inline-flex items-center gap-1"
                >
                  Feedback & Help
                </a>
              </li>
              <li>
                <a
                  href={apiDocsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#2461ED] transition-colors"
                >
                  <span>API Docs (Swagger)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#2461ED] transition-colors">
                  System Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy Guarantee Note */}
          <div>
            <div className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Privacy & Security
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                In-Memory Ephemeral Engine
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Privacy-first • Your dataset is processed in memory and never stored.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Smart Data Analyst • Privacy-first • Your dataset is processed in memory and never stored.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://preview--spirited-data-logic-lab.base44.app/?hide_badge=true&base44_data_env=prod&server_url=https%3A%2F%2Fpreview--spirited-data-logic-lab.base44.app&_b44_commit=00306aa3dba495daf7154c9c4d8e528abf969dad&previewFE_version=1#"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#2461ED] transition-colors inline-flex items-center gap-1 font-semibold text-slate-600"
            >
              API Docs <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span>•</span>
            <a
              href="https://preview--spirited-data-logic-lab.base44.app/workspace/help"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#2461ED] transition-colors font-semibold text-slate-600"
            >
              Feedback
            </a>
            <span>•</span>
            <Link href="/" className="hover:text-[#2461ED] transition-colors">
              Workspace
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
