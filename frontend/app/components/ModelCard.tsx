"use client";

import React, { useState, useMemo } from "react";
import { Award, RotateCcw, ShieldAlert, Sliders, CheckCircle2, Cpu, Check } from "lucide-react";
import StatusBadge from "./StatusBadge";
import TechnicalDetails from "./TechnicalDetails";
import ProfessionalModelOverrideModal, {
  BenchmarkModelItem,
} from "./ProfessionalModelOverrideModal";
import { ModelLeaderboardItem } from "../config/api";

interface ModelCardProps {
  bestModelName: string;
  metricName: string;
  score: string;
  taskType: "Classification" | "Regression" | string;
  folds?: number;
  totalRows?: number;
  featuresCount?: number;
  className?: string;
  leaderboard?: ModelLeaderboardItem[];
  activeModelName?: string;
  isProfessionalOverride?: boolean;
  onSelectActiveModel?: (modelName: string, isOverride: boolean) => void;
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
  leaderboard = [],
  activeModelName: controlledActiveModel,
  isProfessionalOverride: controlledIsOverride,
  onSelectActiveModel,
}: ModelCardProps) {
  // Internal state fallback if not controlled
  const [internalActiveModel, setInternalActiveModel] = useState<string>(bestModelName);
  const [internalIsOverride, setInternalIsOverride] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const [pendingModel, setPendingModel] = useState<BenchmarkModelItem | null>(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [positiveMessage, setPositiveMessage] = useState<string | null>(null);

  const currentActiveModelName = controlledActiveModel ?? internalActiveModel;
  const currentIsOverride = controlledIsOverride ?? internalIsOverride;

  const autoAiItem: BenchmarkModelItem = useMemo(
    () => ({
      name: bestModelName,
      metric: metricName,
      score: score,
      rawScore: parseFloat(score.replace(/[^0-9.-]/g, "")) || 0,
      family: "AutoAI Top Candidate",
    }),
    [bestModelName, metricName, score]
  );

  const benchmarkItems: BenchmarkModelItem[] = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) {
      return [autoAiItem];
    }
    return leaderboard.map((item) => ({
      name: item.model,
      metric: item.metric,
      score: item.score,
      rawScore:
        item.raw_score ?? parseFloat(item.score.replace(/[^0-9.-]/g, "")) ?? 0,
      family: "Cross-Validated Candidate",
    }));
  }, [leaderboard, autoAiItem]);

  const activeModelItem = useMemo(() => {
    return benchmarkItems.find((m) => m.name === currentActiveModelName) || autoAiItem;
  }, [benchmarkItems, currentActiveModelName, autoAiItem]);

  const handleSelectAlgorithm = (targetName: string) => {
    setSelectedCandidate(targetName);
    const chosen = benchmarkItems.find((m) => m.name === targetName);
    if (!chosen) return;

    if (chosen.name === autoAiItem.name) {
      setInternalActiveModel(autoAiItem.name);
      setInternalIsOverride(false);
      setPositiveMessage(null);
      if (onSelectActiveModel) onSelectActiveModel(autoAiItem.name, false);
      return;
    }

    const recVal = autoAiItem.rawScore ?? parseFloat(autoAiItem.score.replace(/[^0-9.-]/g, "")) ?? 0;
    const selVal = chosen.rawScore ?? parseFloat(chosen.score.replace(/[^0-9.-]/g, "")) ?? 0;

    if (selVal < recVal) {
      setPendingModel(chosen);
      setIsWarningModalOpen(true);
      setPositiveMessage(null);
    } else {
      setInternalActiveModel(chosen.name);
      setInternalIsOverride(true);
      setPositiveMessage("Your selected algorithm performs as well as or better than the AutoAI recommendation.");
      if (onSelectActiveModel) onSelectActiveModel(chosen.name, true);
    }
  };

  const handleConfirmOverride = () => {
    if (pendingModel) {
      setInternalActiveModel(pendingModel.name);
      setInternalIsOverride(true);
      setPositiveMessage(null);
      if (onSelectActiveModel) onSelectActiveModel(pendingModel.name, true);
    }
    setIsWarningModalOpen(false);
  };

  const handleKeepRecommended = () => {
    setSelectedCandidate(autoAiItem.name);
    setInternalActiveModel(autoAiItem.name);
    setInternalIsOverride(false);
    setIsWarningModalOpen(false);
    setPositiveMessage(null);
    if (onSelectActiveModel) onSelectActiveModel(autoAiItem.name, false);
  };

  const handleResetToAutoAi = () => {
    setSelectedCandidate(autoAiItem.name);
    setInternalActiveModel(autoAiItem.name);
    setInternalIsOverride(false);
    setPositiveMessage(null);
    if (onSelectActiveModel) onSelectActiveModel(autoAiItem.name, false);
  };

  return (
    <div
      className={`enterprise-card p-5 border-l-4 border-l-[#2563EB] space-y-5 bg-white ${className}`}
    >
      {/* Active Model Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Model:
          </span>
          <span
            className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${
              currentIsOverride
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-blue-100 text-blue-900 border border-blue-300"
            }`}
          >
            {currentIsOverride ? (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            ) : (
              <Award className="w-3.5 h-3.5 text-blue-700" />
            )}
            <span>
              {activeModelItem.name} (
              {currentIsOverride ? "Professional Override" : "AutoAI Recommended"}
              )
            </span>
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-600">
            {activeModelItem.score}
          </span>
        </div>

        {currentIsOverride && (
          <button
            type="button"
            onClick={handleResetToAutoAi}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset to AutoAI ({autoAiItem.name})</span>
          </button>
        )}
      </div>

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

      {/* Manual Algorithm Override Option (For Professional Analysts) */}
      {benchmarkItems.length > 1 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-700" />
                Want to use your own algorithm?
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Professional data analysts can choose and continue with their own preferred algorithm, even if it has lower accuracy.
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-300 px-2 py-0.5 rounded-md self-start sm:self-auto">
              Professional Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="sm:col-span-2">
              <select
                aria-label="Select an algorithm"
                value={selectedCandidate || currentActiveModelName}
                onChange={(e) => handleSelectAlgorithm(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                {benchmarkItems.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} — {m.score} {m.name === autoAiItem.name ? "★ AutoAI Recommended" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="button"
                onClick={() => handleSelectAlgorithm(selectedCandidate || currentActiveModelName)}
                className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer text-center"
              >
                Apply Selection
              </button>
            </div>
          </div>

          {positiveMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold">✓ Selected Model Accepted: </span>
                <span>{positiveMessage}</span>
              </div>
            </div>
          )}

          {/* Comparison Cards */}
          <div className="pt-2 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-blue-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-blue-800 flex items-center gap-1">
                    <Award className="w-3 h-3 text-blue-600" />
                    AutoAI Recommended Model
                  </span>
                  <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                    Rank #1
                  </span>
                </div>
                <div className="font-extrabold text-slate-900">
                  Algorithm: {autoAiItem.name}
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  Accuracy: <strong className="text-blue-700">{autoAiItem.score}</strong>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg bg-white border shadow-2xs space-y-1 ${
                  currentIsOverride ? "border-amber-300 bg-amber-50/20" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-slate-600" />
                    Your Selected Model
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      currentIsOverride
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {currentIsOverride ? "Professional Override" : "Matches AutoAI"}
                  </span>
                </div>
                <div className="font-extrabold text-slate-900">
                  Algorithm: {activeModelItem.name}
                </div>
                <div className="text-slate-600 font-mono text-[11px]">
                  Accuracy:{" "}
                  <strong
                    className={
                      currentIsOverride ? "text-amber-700" : "text-blue-700"
                    }
                  >
                    {activeModelItem.score}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Confirmation Modal */}
      <ProfessionalModelOverrideModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        recommendedModel={autoAiItem}
        selectedModel={pendingModel || autoAiItem}
        onConfirmOverride={handleConfirmOverride}
        onKeepRecommended={handleKeepRecommended}
      />
    </div>
  );
}
