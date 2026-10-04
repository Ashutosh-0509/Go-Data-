"use client";

import React from "react";
import TechnicalDetails, { TechnicalDetailItem } from "./TechnicalDetails";

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: string;
  statusBadge?: React.ReactNode;
  icon?: React.ReactNode;
  technicalDetails?: {
    summary?: string;
    formula?: string;
    items?: TechnicalDetailItem[];
  };
  trend?: {
    direction: "up" | "down" | "neutral";
    label: string;
  };
  className?: string;
}

export default function KpiCard({
  label,
  value,
  subtitle,
  statusBadge,
  icon,
  technicalDetails,
  trend,
  className = "",
}: KpiCardProps) {
  return (
    <div
      className={`enterprise-card p-4 flex flex-col justify-between transition-all ${className}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            {statusBadge}
            {icon && <div className="text-[#64748B]">{icon}</div>}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-bold tracking-tight text-[#0B1220] tabular-nums">
            {value}
          </span>
          {trend && (
            <span
              className={`text-xs font-medium ${
                trend.direction === "up"
                  ? "text-[#16A34A]"
                  : trend.direction === "down"
                  ? "text-[#DC2626]"
                  : "text-[#475569]"
              }`}
            >
              {trend.label}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {technicalDetails && (
        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9]">
          <TechnicalDetails
            title="Technical Details"
            summary={technicalDetails.summary}
            formula={technicalDetails.formula}
            items={technicalDetails.items}
          />
        </div>
      )}
    </div>
  );
}
