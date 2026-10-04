"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ColdStartBannerProps {
  isWaking: boolean;
  message?: string;
  onDismiss?: () => void;
}

export default function ColdStartBanner({
  isWaking,
  message = "Starting analysis server… this can take up to a minute on the free tier.",
  onDismiss,
}: ColdStartBannerProps) {
  if (!isWaking) return null;

  return (
    <div className="bg-[#EFF6FF] border-b border-[#BFDBFE] px-4 py-2 text-xs text-[#1E40AF] transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB] flex-shrink-0" />
          <span className="font-medium">
            {message}
          </span>
          <span className="hidden md:inline text-[11px] text-[#3B82F6]">
            (Render spinning up in-memory Python container)
          </span>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-[11px] text-[#60A5FA] hover:text-[#1E40AF] transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
