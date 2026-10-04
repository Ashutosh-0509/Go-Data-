"use client";

import React, { useRef, useState } from "react";
import { Upload, ShieldCheck, Database } from "lucide-react";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onLoadDemo: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function UploadDropzone({
  onFileSelect,
  onLoadDemo,
  isLoading = false,
  className = "",
}: UploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`enterprise-card p-8 sm:p-10 border-2 border-dashed transition-all cursor-pointer text-center relative ${
          isDragOver
            ? "border-[#2563EB] bg-[#EFF6FF]/60"
            : "border-[#CBD5E1] hover:border-[#94A3B8] bg-white hover:bg-[#F8FAFC]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] mb-4">
            <Upload className="w-6 h-6 stroke-[1.75]" />
          </div>

          <div className="text-base font-semibold text-[#0B1220] mb-1">
            Drop your file here <span className="font-normal text-[#475569]">/ or choose a file from your computer</span>
          </div>

          <p className="text-xs text-[#64748B] mb-5">
            CSV • XLSX • XLS • max 10 MB
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Browse Files
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLoadDemo();
              }}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white hover:bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 mr-1.5 text-[#2563EB]" />
              Try Demo Dataset
            </button>
          </div>
        </div>
      </div>

      {/* Privacy guarantee banner */}
      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between text-xs text-[#475569]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0F766E] flex-shrink-0" />
          <span>
            <strong className="text-[#0B1220] font-semibold">Privacy-first analysis:</strong> Your dataset is processed in memory and not stored persistently.
          </span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] text-[#64748B]">
          Zero Disk Retention
        </span>
      </div>
    </div>
  );
}
