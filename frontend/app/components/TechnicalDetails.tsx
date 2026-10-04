"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Code2 } from "lucide-react";

export interface TechnicalDetailItem {
  label: string;
  value: React.ReactNode;
  hint?: string;
}

interface TechnicalDetailsProps {
  title?: string;
  summary?: string;
  items?: TechnicalDetailItem[];
  formula?: string;
  codeSnippet?: string;
  defaultOpen?: boolean;
  className?: string;
}

export default function TechnicalDetails({
  title = "Technical Details",
  summary,
  items,
  formula,
  codeSnippet,
  defaultOpen = false,
  className = "",
}: TechnicalDetailsProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={`border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] overflow-hidden transition-all text-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-[#F1F5F9] transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-[#475569] group-hover:text-[#0F172A]" />
          <span className="font-medium text-[#0F172A] tracking-tight">
            {title}
          </span>
          {summary && !isOpen && (
            <span className="text-[#64748B] text-[11px] truncate max-w-xs sm:max-w-md">
              — {summary}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
          <span>{isOpen ? "Hide" : "Expand"}</span>
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-3.5 py-3 border-t border-[#E2E8F0] bg-white space-y-3">
          {formula && (
            <div>
              <div className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">
                Mathematical Formula / Specification
              </div>
              <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded font-mono text-[11px] text-[#0F172A] overflow-x-auto">
                {formula}
              </div>
            </div>
          )}

          {items && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-2 rounded bg-[#F8FAFC] border border-[#E2E8F0]/80"
                >
                  <span className="text-[#475569] font-medium">{item.label}:</span>
                  <span className="font-mono text-[#0F172A] text-right font-medium ml-2">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {codeSnippet && (
            <div>
              <div className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider mb-1">
                Execution Logic
              </div>
              <pre className="p-2.5 bg-[#0B1220] text-[#E2E8F0] rounded font-mono text-[11px] overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
