"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Info, ArrowRight } from "lucide-react";

export interface InsightItem {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  metadata?: string;
}

interface InsightCardProps {
  insights: InsightItem[];
  title?: string;
  className?: string;
}

export default function InsightCard({
  insights,
  title = "What Needs Attention?",
  className = "",
}: InsightCardProps) {
  if (insights.length === 0) return null;

  return (
    <div className={`enterprise-card p-5 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1220]">
          {title}
        </h3>
        <span className="text-xs text-[#64748B] font-mono">
          {insights.filter((i) => i.type === "warning").length} items flagged
        </span>
      </div>

      <div className="space-y-2.5">
        {insights.map((item) => {
          const isSuccess = item.type === "success";
          const isWarning = item.type === "warning";

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isWarning
                  ? "bg-[#FFFBEB] border-[#FDE68A]/80 text-[#92400E]"
                  : isSuccess
                  ? "bg-[#F0FDF4] border-[#BBF7D0]/80 text-[#166534]"
                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#334155]"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-semibold text-[#0F172A]">
                    {item.title}
                  </div>
                  <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                  {item.metadata && (
                    <div className="text-[11px] font-mono text-[#64748B] mt-1">
                      {item.metadata}
                    </div>
                  )}
                </div>
              </div>

              {item.actionLabel && item.onAction && (
                <button
                  type="button"
                  onClick={item.onAction}
                  className="self-start sm:self-center inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#94A3B8] text-xs font-semibold text-[#0F172A] shadow-xs transition-colors cursor-pointer flex-shrink-0"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 text-[#64748B]" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
