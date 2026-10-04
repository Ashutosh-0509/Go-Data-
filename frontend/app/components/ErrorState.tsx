"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  detail?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Analysis Error",
  message = "We couldn't complete the analysis. The dataset could not be processed. Please check that the file contains valid rows and columns and try again.",
  detail,
  onRetry,
  className = "",
}: ErrorStateProps) {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div
      className={`enterprise-card p-5 border-l-4 border-l-[#DC2626] bg-[#FEF2F2]/30 space-y-3.5 max-w-2xl mx-auto ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] flex-shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#0B1220] tracking-tight">
            {title}
          </h4>
          <p className="text-xs text-[#475569] mt-1 leading-relaxed">
            {message}
          </p>

          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#94A3B8] text-xs font-semibold text-[#0F172A] shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#475569]" />
                <span>Retry Operation</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {detail && (
        <div className="pt-2 border-t border-[#FCA5A5]/40 text-xs">
          <button
            type="button"
            onClick={() => setShowTechnical(!showTechnical)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#B91C1C] hover:underline"
          >
            <span>Technical Diagnostics</span>
            {showTechnical ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          {showTechnical && (
            <div className="mt-2 p-2.5 bg-white border border-[#FECACA] rounded font-mono text-[11px] text-[#7F1D1D] overflow-x-auto whitespace-pre-wrap">
              {detail}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
