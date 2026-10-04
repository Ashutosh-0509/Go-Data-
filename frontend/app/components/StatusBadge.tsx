"use client";

import React from "react";

export type BadgeStatus =
  | "Ready"
  | "Analyzing"
  | "Needs Review"
  | "Action Required"
  | "Coming Soon"
  | "Complete"
  | "Neutral";

interface StatusBadgeProps {
  status: BadgeStatus | string;
  className?: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, className = "", size = "md" }: StatusBadgeProps) {
  const norm = status.toLowerCase();

  let styles = "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]";
  let dotColor = "bg-[#94A3B8]";
  let isPulsing = false;

  if (norm === "ready" || norm === "complete" || norm === "healthy") {
    styles = "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]";
    dotColor = "bg-[#16A34A]";
  } else if (norm === "analyzing" || norm === "processing" || norm === "in progress") {
    styles = "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]";
    dotColor = "bg-[#2563EB]";
    isPulsing = true;
  } else if (norm === "needs review" || norm === "warning") {
    styles = "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]";
    dotColor = "bg-[#D97706]";
  } else if (norm === "action required" || norm === "error" || norm === "critical") {
    styles = "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]";
    dotColor = "bg-[#DC2626]";
  } else if (norm.includes("coming soon")) {
    styles = "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]";
    dotColor = "bg-[#94A3B8]";
  }

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1.5 font-medium"
      : "text-xs px-2.5 py-1 gap-1.5 font-medium";

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-tight ${sizeClasses} ${styles} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColor} ${
          isPulsing ? "animate-pulse" : ""
        }`}
      />
      {status}
    </span>
  );
}
