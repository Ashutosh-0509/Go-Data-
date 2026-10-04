"use client";

import React from "react";
import { AlertTriangle, Award, CheckCircle2, ChevronRight, X, ShieldAlert } from "lucide-react";

export interface BenchmarkModelItem {
  name: string;
  family?: string;
  metric: string;
  score: string;
  rawScore?: number;
  latency?: string;
  statusTag?: string;
}

interface ProfessionalModelOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedModel: BenchmarkModelItem;
  selectedModel: BenchmarkModelItem;
  onConfirmOverride: () => void;
  onKeepRecommended: () => void;
}

export default function ProfessionalModelOverrideModal({
  isOpen,
  onClose,
  recommendedModel,
  selectedModel,
  onConfirmOverride,
  onKeepRecommended,
}: ProfessionalModelOverrideModalProps) {
  if (!isOpen) return null;

  // Calculate score delta for display if available
  const recVal =
    recommendedModel.rawScore ??
    parseFloat(recommendedModel.score.replace(/[^0-9.-]/g, "")) ??
    0;
  const selVal =
    selectedModel.rawScore ??
    parseFloat(selectedModel.score.replace(/[^0-9.-]/g, "")) ??
    0;
  const delta = (recVal - selVal).toFixed(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="override-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden text-slate-900 font-['Manrope',sans-serif]">
        {/* Header with warning icon */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-white to-amber-50/40 border-b border-amber-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                  Manual Validation Check
                </span>
              </div>
              <h2
                id="override-modal-title"
                className="text-base sm:text-lg font-black text-slate-900 mt-1 flex items-center gap-1.5"
              >
                ⚠️ Performance Warning
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                The algorithm you selected has a lower accuracy than the AutoAI-recommended model.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* AutoAI Recommendation */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-600" />
                  AutoAI Recommendation
                </span>
                <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md">
                  Optimal
                </span>
              </div>
              <div className="text-xs font-black text-slate-900 truncate">
                {recommendedModel.name}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-blue-700 font-mono">
                  {recommendedModel.score}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {recommendedModel.metric}
                </span>
              </div>
            </div>

            {/* Selected Model */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-600" />
                  Your Selection
                </span>
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md">
                  -{delta}% Delta
                </span>
              </div>
              <div className="text-xs font-black text-slate-900 truncate">
                {selectedModel.name}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-extrabold text-amber-700 font-mono">
                  {selectedModel.score}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {selectedModel.metric}
                </span>
              </div>
            </div>
          </div>

          {/* Explicit prompt question */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-800 leading-normal">
              Do you still want to continue with{" "}
              <span className="text-amber-800 font-black underline decoration-amber-400">
                {selectedModel.name}
              </span>
              ?
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Selecting your model will set it as the active algorithm across all downstream model training, evaluation, predictions, metrics, and report exports.
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onKeepRecommended}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer text-center"
          >
            No, Use Recommended Model
          </button>
          <button
            type="button"
            onClick={onConfirmOverride}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center"
          >
            <span>Yes, Continue with My Model</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
