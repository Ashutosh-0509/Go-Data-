"use client";

import React, { useState } from "react";

interface HistogramBin {
  bin: string;
  count: number;
}

interface HistogramChartProps {
  data: HistogramBin[];
  columnName: string;
  className?: string;
}

export function HistogramChart({ data, columnName, className = "" }: HistogramChartProps) {
  const [hoveredBin, setHoveredBin] = useState<HistogramBin | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        No numeric frequency data available for distribution plotting.
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const totalCount = data.reduce((acc, d) => acc + d.count, 0);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Chart container */}
      <div className="relative pt-6 pb-2">
        {/* Hover Tooltip */}
        {hoveredBin && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0B1220] text-white text-[11px] px-2.5 py-1 rounded shadow-md z-20 pointer-events-none flex items-center gap-2">
            <span className="font-mono text-blue-300">Bin: {hoveredBin.bin}</span>
            <span>•</span>
            <span className="font-semibold">{hoveredBin.count.toLocaleString()} occurrences</span>
            <span>({((hoveredBin.count / totalCount) * 100).toFixed(1)}%)</span>
          </div>
        )}

        {/* Bars */}
        <div className="h-48 flex items-end gap-1.5 sm:gap-2 px-2 border-b border-l border-[#CBD5E1]">
          {data.map((item, idx) => {
            const heightPct = Math.max(4, Math.round((item.count / maxCount) * 100));
            const isHovered = hoveredBin?.bin === item.bin;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBin(item)}
                onMouseLeave={() => setHoveredBin(null)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
              >
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-sm transition-all duration-150 ${
                    isHovered
                      ? "bg-[#1D4ED8]"
                      : "bg-[#2563EB] hover:bg-[#1D4ED8]"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between px-2 pt-1.5 text-[10px] font-mono text-[#64748B] overflow-x-hidden">
          <span>{data[0]?.bin.split("-")[0] || "Min"}</span>
          <span className="text-center font-sans font-medium text-[#475569]">
            {columnName} Values
          </span>
          <span>{data[data.length - 1]?.bin.split("-")[1] || "Max"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1">
        <span>Y-Axis: Frequency (Sample Count)</span>
        <span className="font-mono">Total Samples: {totalCount.toLocaleString()}</span>
      </div>
    </div>
  );
}

interface CorrelationHeatmapProps {
  correlation: Record<string, Record<string, number>>;
  columns: string[];
  className?: string;
}

export function CorrelationHeatmap({
  correlation,
  columns,
  className = "",
}: CorrelationHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{
    col1: string;
    col2: string;
    value: number;
  } | null>(null);

  if (!columns || columns.length === 0 || !correlation) {
    return (
      <div className="p-8 text-center text-xs text-[#64748B]">
        Correlation matrix requires at least two numerical columns.
      </div>
    );
  }

  // Cell color helper: Blue for positive correlation, Teal/Slate for neutral, Amber/Red for negative
  const getCellBg = (val: number) => {
    if (val === 1) return "bg-[#1E3A8A] text-white"; // Exact diagonal
    if (val >= 0.7) return "bg-[#2563EB] text-white"; // Strong positive
    if (val >= 0.4) return "bg-[#60A5FA] text-[#0F172A]"; // Moderate positive
    if (val >= 0.15) return "bg-[#DBEAFE] text-[#1E3A8A]"; // Weak positive
    if (val > -0.15) return "bg-[#F1F5F9] text-[#475569]"; // Near zero / neutral
    if (val > -0.4) return "bg-[#FED7AA] text-[#7C2D12]"; // Weak negative
    if (val > -0.7) return "bg-[#F97316] text-white"; // Moderate negative
    return "bg-[#DC2626] text-white"; // Strong negative
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {hoveredCell && (
        <div className="text-xs bg-[#0B1220] text-white px-3 py-1.5 rounded flex items-center justify-between font-mono">
          <span>
            {hoveredCell.col1} ↔ {hoveredCell.col2}
          </span>
          <span className="font-bold text-blue-300">
            r = {hoveredCell.value >= 0 ? `+${hoveredCell.value.toFixed(2)}` : hoveredCell.value.toFixed(2)}
          </span>
        </div>
      )}

      <div className="table-container">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th className="bg-[#F8FAFC] border-b border-[#E2E8F0] font-semibold text-left">
                Feature
              </th>
              {columns.map((c) => (
                <th
                  key={c}
                  className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-center font-semibold max-w-[100px] truncate"
                  title={c}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map((rowCol) => (
              <tr key={rowCol}>
                <td className="font-medium text-[#0F172A] bg-[#F8FAFC] border-r border-[#E2E8F0]">
                  {rowCol}
                </td>
                {columns.map((colCol) => {
                  const val = correlation[rowCol]?.[colCol] ?? (rowCol === colCol ? 1.0 : 0.0);
                  const isDiag = rowCol === colCol;

                  return (
                    <td
                      key={colCol}
                      onMouseEnter={() =>
                        setHoveredCell({ col1: rowCol, col2: colCol, value: val })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`text-center font-mono font-medium text-xs py-2 px-1 cursor-pointer transition-colors ${getCellBg(
                        val
                      )} ${isDiag ? "ring-1 ring-inset ring-white/30" : ""}`}
                    >
                      {val.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Matrix Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B] pt-1">
        <span>Pearson Correlation Coefficient (r ∈ [-1, +1])</span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#DC2626]" /> Inverse
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F1F5F9] border border-[#CBD5E1]" /> Neutral
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB]" /> Positive
          </span>
        </div>
      </div>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({
  title,
  description,
  badge,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div className={`enterprise-card p-5 space-y-4 ${className}`}>
      <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <h3 className="text-sm font-bold text-[#0B1220] tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {badge}
      </div>
      <div>{children}</div>
    </div>
  );
}
