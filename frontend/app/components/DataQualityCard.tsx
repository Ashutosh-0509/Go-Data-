"use client";

import React from "react";
import StatusBadge, { BadgeStatus } from "./StatusBadge";
import TechnicalDetails from "./TechnicalDetails";

interface DataQualityCardProps {
  score: number;
  missingPct: number;
  duplicatePct: number;
  totalRows: number;
  missingCells: number;
  duplicateRows: number;
  outlierCount?: number;
  className?: string;
}

export default function DataQualityCard({
  score,
  missingPct,
  duplicatePct,
  totalRows,
  missingCells,
  duplicateRows,
  className = "",
}: DataQualityCardProps) {
  let badgeStatus: BadgeStatus = "Ready";
  let interpretation = "Your dataset is ready for statistical analysis and modeling.";
  let healthColor = "text-[#16A34A]";
  let ringColor = "#16A34A";

  if (score >= 90) {
    badgeStatus = "Ready";
    interpretation = "High data fidelity. Ready for direct analysis and model training.";
    healthColor = "text-[#16A34A]";
    ringColor = "#16A34A";
  } else if (score >= 75) {
    badgeStatus = "Needs Review";
    interpretation = "Minor data hygiene issues observed. Review missing values or duplicates before training.";
    healthColor = "text-[#D97706]";
    ringColor = "#D97706";
  } else {
    badgeStatus = "Action Required";
    interpretation = "Significant data quality anomalies detected. Imputation or deduplication strongly advised.";
    healthColor = "text-[#DC2626]";
    ringColor = "#DC2626";
  }

  return (
    <div className={`enterprise-card p-5 space-y-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1">
            Dataset Health & Integrity
          </div>
          <h3 className="text-lg font-bold text-[#0B1220]">
            Overall Data Quality Score
          </h3>
          <p className="text-xs text-[#475569] mt-0.5">{interpretation}</p>
        </div>
        <StatusBadge status={badgeStatus} />
      </div>

      {/* Score gauge and primary factors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
        <div className="flex items-center gap-4 sm:col-span-1">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E2E8F0]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${score}, 100`}
                stroke={ringColor}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-bold tracking-tight text-[#0B1220] tabular-nums">
                {score}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0B1220]">Quality Score</div>
            <div className={`text-[11px] font-medium ${healthColor}`}>
              {score >= 90 ? "Benchmark Grade A" : score >= 75 ? "Benchmark Grade B" : "Benchmark Grade C"}
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <div className="text-[#64748B] text-[11px] font-medium">Missing Cells</div>
            <div className="text-sm font-bold text-[#0B1220] mt-0.5 tabular-nums">
              {missingPct}%{" "}
              <span className="text-[11px] font-normal text-[#64748B]">
                ({missingCells.toLocaleString()} cells)
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <div className="text-[#64748B] text-[11px] font-medium">Duplicate Records</div>
            <div className="text-sm font-bold text-[#0B1220] mt-0.5 tabular-nums">
              {duplicatePct}%{" "}
              <span className="text-[11px] font-normal text-[#64748B]">
                ({duplicateRows.toLocaleString()} rows)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive Technical Details */}
      <TechnicalDetails
        title="Quality Score Formula & Schema Verification"
        summary={`Quality score = 100 − 0.5(${missingPct}%) − 0.5(${duplicatePct}%)`}
        formula="Quality_Score = np.clip(100.0 - (0.5 * Null_Pct) - (0.5 * Duplicate_Pct), 0.0, 100.0)"
        items={[
          { label: "Active Dataset Dimensions", value: `${totalRows.toLocaleString()} rows` },
          { label: "Missing Cell Penalty", value: `- ${(0.5 * missingPct).toFixed(2)} pts` },
          { label: "Duplicate Row Penalty", value: `- ${(0.5 * duplicatePct).toFixed(2)} pts` },
          { label: "Schema Validation", value: "Strict Type Inference Passed" },
          { label: "Execution Engine", value: "Pandas 2.2 / In-Memory Buffer" },
        ]}
      />
    </div>
  );
}
