"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import StatusBadge from "./StatusBadge";

export interface LeaderboardEntry {
  model: string;
  metric: string;
  score: string;
  raw_score?: number;
  precision?: number | string;
  Precision?: number | string;
  recall?: number | string;
  Recall?: number | string;
  f1_score?: number | string;
  F1_Score?: number | string;
}

interface ModelComparisonTableProps {
  leaderboard: LeaderboardEntry[];
  taskType: string;
  className?: string;
}

export default function ModelComparisonTable({
  leaderboard,
  taskType,
  className = "",
}: ModelComparisonTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  // Check if any optional extra metrics were returned by the backend
  const hasPrecision = leaderboard.some((item) => item.precision !== undefined || item.Precision !== undefined);
  const hasRecall = leaderboard.some((item) => item.recall !== undefined || item.Recall !== undefined);
  const hasF1 = leaderboard.some((item) => item.f1_score !== undefined || item.F1_Score !== undefined);

  const filteredAndSorted = useMemo(() => {
    let result = [...leaderboard];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.model.toLowerCase().includes(q) ||
          m.metric.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const valA = parseFloat(a.score.replace("%", "")) || a.raw_score || 0;
      const valB = parseFloat(b.score.replace("%", "")) || b.raw_score || 0;
      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [leaderboard, searchTerm, sortAsc]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search and control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search benchmarked models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
          />
        </div>

        <div className="text-xs text-[#64748B] flex items-center gap-2">
          <span>{filteredAndSorted.length} models benchmarked</span>
          <span>•</span>
          <span className="font-mono text-[#0B1220] font-medium">{taskType}</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th className="w-12 text-center">Rank</th>
              <th className="text-left">Model Algorithm</th>
              <th className="text-left">Benchmark Metric</th>
              <th
                onClick={() => setSortAsc(!sortAsc)}
                className="text-right cursor-pointer hover:text-[#0F172A] transition-colors select-none"
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>Score</span>
                  <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                </div>
              </th>
              {hasPrecision && <th className="text-right">Precision</th>}
              {hasRecall && <th className="text-right">Recall</th>}
              {hasF1 && <th className="text-right">F1-Score</th>}
              <th className="text-center w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((item, idx) => {
              const isBest = idx === 0 && !sortAsc;

              return (
                <tr
                  key={item.model}
                  className={isBest ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]"}
                >
                  <td className="text-center font-mono font-medium text-[#64748B]">
                    {isBest ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold">
                        1
                      </span>
                    ) : (
                      idx + 1
                    )}
                  </td>
                  <td className="font-medium text-[#0B1220]">
                    <div className="flex items-center gap-2">
                      <span>{item.model}</span>
                      {isBest && (
                        <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                          Top Candidate
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-[#475569] text-xs font-mono">
                    {item.metric}
                  </td>
                  <td className="text-right font-mono font-bold text-[#0B1220] tabular-nums text-xs">
                    {item.score}
                  </td>
                  {hasPrecision && (
                    <td className="text-right font-mono text-xs tabular-nums text-[#475569]">
                      {item.precision ?? item.Precision ?? "—"}
                    </td>
                  )}
                  {hasRecall && (
                    <td className="text-right font-mono text-xs tabular-nums text-[#475569]">
                      {item.recall ?? item.Recall ?? "—"}
                    </td>
                  )}
                  {hasF1 && (
                    <td className="text-right font-mono text-xs tabular-nums text-[#475569]">
                      {item.f1_score ?? item.F1_Score ?? "—"}
                    </td>
                  )}
                  <td className="text-center">
                    <StatusBadge
                      status={isBest ? "Ready" : "Complete"}
                      size="sm"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
        <span>Evaluated with cross_val_score on scaled numerical + one-hot encoded variables</span>
        <span className="font-mono">Negative R² preserved without artificial clipping</span>
      </div>
    </div>
  );
}
