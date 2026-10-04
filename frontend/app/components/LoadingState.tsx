"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  type?: "card" | "table" | "kpi" | "full";
  className?: string;
}

export default function LoadingState({
  message = "Profiling your dataset…",
  subtext = "Computing statistical distributions and schema fidelity.",
  type = "card",
  className = "",
}: LoadingStateProps) {
  if (type === "kpi") {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="enterprise-card p-4 space-y-3">
            <div className="h-3 w-20 skeleton-shimmer rounded" />
            <div className="h-7 w-28 skeleton-shimmer rounded" />
            <div className="h-3 w-full skeleton-shimmer rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`enterprise-card p-4 space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 skeleton-shimmer rounded" />
          <div className="h-7 w-48 skeleton-shimmer rounded" />
        </div>
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-full skeleton-shimmer rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`enterprise-card p-10 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[#0B1220] tracking-tight">
          {message}
        </h4>
        {subtext && (
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            {subtext}
          </p>
        )}
      </div>

      <div className="w-48 h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div className="h-full bg-[#2563EB] rounded-full skeleton-shimmer" />
      </div>
    </div>
  );
}
