"use client";

import React from "react";
import { FileSpreadsheet, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  title = "No dataset uploaded yet",
  description = "Upload a CSV or Excel file to start analyzing your data.",
  actionLabel = "Upload Data",
  onAction,
  icon,
  badge,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`enterprise-card p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#475569] mb-4">
        {icon || <FileSpreadsheet className="w-6 h-6 stroke-[1.75]" />}
      </div>

      {badge && <div className="mb-2">{badge}</div>}

      <h3 className="text-base font-bold text-[#0B1220] tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#475569] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
