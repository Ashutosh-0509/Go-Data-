"use client";

import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  badge,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E2E8F0] ${className}`}
    >
      <div>
        {eyebrow && (
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] mb-1">
            {eyebrow}
          </div>
        )}
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1220]">
            {title}
          </h2>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}
