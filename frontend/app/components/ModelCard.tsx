"use client";

import React from "react";
import { Award } from "lucide-react";
import StatusBadge from "./StatusBadge";
import TechnicalDetails from "./TechnicalDetails";

interface ModelCardProps {
  bestModelName: string;
  metricName: string;
  score: string;
  taskType: "Classification" | "Regression" | string;
  folds?: number;
  totalRows?: number;
  featuresCount?: number;
  className?: string;
}

export default function ModelCard({
  bestModelName,
  metricName,
  score,
  taskType,
  folds = 5,
  totalRows,
  featuresCount,
  className = "",
}: ModelCardProps) {
  return (
    <div
      className={`enterprise-card p-5 border-l-4 border-l-[#2563EB] space-y-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-[#2563EB]" />
            Optimal Validation Candidate
          </div>
          <h3 className="text-lg font-bold text-[#0B1220]">
            {bestModelName} performed best on this validation set
          </h3>
          <p className="text-xs text-[#475569] mt-0.5">
            Ranked #1 across {folds}-fold stratified cross-validation on normalized feature matrices.
          </p>
        </div>
        <StatusBadge status="Ready" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <div className="text-[11px] font-medium text-[#64748B]">Primary Metric</div>
          <div className="text-base font-bold text-[#0B1220] mt-0.5 tabular-nums">
            {score}
          </div>
          <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
            {metricName}
          </div>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <div className="text-[11px] font-medium text-[#64748B]">Task Archetype</div>
          <div className="text-base font-bold text-[#0B1220] mt-0.5">
            {taskType}
          </div>
          <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
            Target Supervised
          </div>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <div className="text-[11px] font-medium text-[#64748B]">Validation Strategy</div>
          <div className="text-base font-bold text-[#0B1220] mt-0.5 tabular-nums">
            {folds}-Fold CV
          </div>
          <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
            Out-of-sample test
          </div>
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
          <div className="text-[11px] font-medium text-[#64748B]">Active Dimensions</div>
          <div className="text-base font-bold text-[#0B1220] mt-0.5 tabular-nums">
            {totalRows ? `${totalRows.toLocaleString()} rows` : "Valid rows"}
          </div>
          <div className="text-[10px] text-[#64748B] font-mono mt-0.5">
            {featuresCount ? `${featuresCount} features` : "Cleaned X matrix"}
          </div>
        </div>
      </div>

      <TechnicalDetails
        title="Cross-Validation Protocol & Evaluation Details"
        summary={`${folds}-fold cross-validation • True unclipped mean`}
        formula={
          taskType === "Regression"
            ? "R² = 1 - (SS_res / SS_tot)  [Preserved raw value without artificial zero clipping]"
            : "Accuracy = Correct_Predictions / Total_Samples"
        }
        items={[
          { label: "Best Candidate", value: bestModelName },
          { label: "Evaluation Metric", value: metricName },
          { label: "Cross-Validation Folds", value: `${folds} splits` },
          { label: "Cross-Validation Random State", value: "42 (Deterministic Seed)" },
          { label: "Handling of Missing Values in X", value: "Column Median Imputation" },
          { label: "Categorical Encoding", value: "Pandas One-Hot Encoding (drop_first=True)" },
        ]}
      />
    </div>
  );
}
