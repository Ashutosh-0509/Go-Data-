"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Clock,
  TrendingUp,
  ArrowLeftRight,
  Copy,
  Share2,
  Globe,
  LayoutGrid,
  Flame,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Cpu,
  Filter,
  Layers,
  Wand2,
} from "lucide-react";

// =========================================================================
// TRANSITION TIMELINE CONSTANTS (Tweak durations and easing curves here)
// Entrance curve: cubic-bezier(0.2, 0.8, 0.2, 1)
// Exit curve: cubic-bezier(0.4, 0, 1, 1)
// =========================================================================
export const TIMING = {
  totalTransition: 0.6,
  easeEnter: [0.16, 1, 0.3, 1] as const,
  easeExit: [0.7, 0, 0.84, 0] as const,

  // Exit sequence timings (in seconds)
  exitCards: 0,
  exitChips: 0.05,
  exitPhone: 0.08,
  exitHeading: 0.1,

  // Entrance sequence timings (in seconds)
  enterBlob: 0.05,
  enterHeading: 0.04,
  enterPhone: 0.06,
  enterSubtext: 0.08,
  enterContent: 0.1,
  enterCards: 0.12,

  idleLoopDuration: 6.0,
  lockDurationMs: 0,
};

// =========================================================================
// SCENE DATA DEFINITIONS (Smart Data Analyst copy matching template specs)
// =========================================================================
export interface FloatingCardData {
  id: string;
  iconType: "grid" | "trend" | "clean" | "copy" | "nodes" | "globe" | "flame" | "clock";
  text: string;
  badge?: string;
  rotation: number;
  top: number;
  right: number;
  width: number;
  gradient: string;
}

export interface TypeChipData {
  name: string;
  icon?: string;
  isMore?: boolean;
}

export interface SceneData {
  id: number;
  titleLines: string[];
  subtext: string;
  ctaText: string;
  blobType: "checker" | "gradient-pink" | "indigo-stars";
  chips?: TypeChipData[];
  cards: FloatingCardData[];
}

export const SCENE_DATA: SceneData[] = [
  // -------------------------------------------------------------
  // SCENE 1: Understand Your Data
  // -------------------------------------------------------------
  {
    id: 0,
    titleLines: ["Understand", "Your Data."],
    subtext: "Profile columns, types, missing values and duplicates automatically.",
    ctaText: "Start with Your Dataset",
    blobType: "checker",
    chips: [
      { name: "CSV", icon: "📄" },
      { name: "XLSX", icon: "📊" },
      { name: "XLS", icon: "📈" },
      { name: "Numeric", icon: "#" },
      { name: "Categorical", icon: "🏷" },
      { name: "Date", icon: "📅" },
      { name: "Text", icon: "Aa" },
      { name: "+ more types", isMore: true },
    ],
    cards: [
      {
        id: "sc-card-profile",
        iconType: "grid",
        text: "Profile every column, type and distribution",
        rotation: -3.5,
        top: 60,
        right: -30,
        width: 245,
        gradient: "linear-gradient(135deg, rgba(24, 110, 245, 0.96) 0%, rgba(14, 165, 233, 0.92) 100%)",
      },
      {
        id: "sc-card-quality",
        iconType: "trend",
        text: "Data quality score with a clear breakdown",
        badge: "Technical Details",
        rotation: 3,
        top: 220,
        right: -15,
        width: 240,
        gradient: "linear-gradient(135deg, rgba(20, 105, 240, 0.96) 0%, rgba(14, 165, 233, 0.92) 100%)",
      },
    ],
  },

  // -------------------------------------------------------------
  // SCENE 2: Clean Your Data. Find Unusual Values.
  // -------------------------------------------------------------
  {
    id: 1,
    titleLines: ["Clean Your Data.", "Find Unusual Values."],
    subtext: "Fix missing values, duplicates and outliers with clear, reviewable actions.",
    ctaText: "Start with Your Dataset",
    blobType: "gradient-pink",
    cards: [
      {
        id: "sc-card-missing",
        iconType: "clean",
        text: "Handle missing values with mean, median or deletion",
        rotation: 4,
        top: 40,
        right: -35,
        width: 245,
        gradient: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
      },
      {
        id: "sc-card-duplicates",
        iconType: "copy",
        text: "Detect duplicate records automatically",
        rotation: -3,
        top: 165,
        right: -15,
        width: 240,
        gradient: "linear-gradient(135deg, #6d28d9 0%, #c026d3 100%)",
      },
      {
        id: "sc-card-outliers",
        iconType: "nodes",
        text: "Find outliers with Z-score and IQR methods",
        rotation: 2.5,
        top: 290,
        right: -30,
        width: 245,
        gradient: "linear-gradient(135deg, #5b21b6 0%, #a21caf 100%)",
      },
    ],
  },

  // -------------------------------------------------------------
  // SCENE 3: Explore Patterns. Build & Compare Models.
  // -------------------------------------------------------------
  {
    id: 2,
    titleLines: ["Explore Patterns.", "Build & Compare Models."],
    subtext: "Visualize relationships, then train and compare models on your target column.",
    ctaText: "Start with Your Dataset",
    blobType: "indigo-stars",
    cards: [
      {
        id: "sc-card-eda",
        iconType: "globe",
        text: "Distributions, relationships and correlations",
        rotation: -3.5,
        top: 40,
        right: -35,
        width: 240,
        gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      },
      {
        id: "sc-card-models",
        iconType: "grid",
        text: "Classification and regression models compared automatically",
        rotation: 3,
        top: 165,
        right: -15,
        width: 245,
        gradient: "linear-gradient(135deg, #1e1b78 0%, #3730a3 100%)",
      },
      {
        id: "sc-card-metrics",
        iconType: "flame",
        text: "Clear metrics: accuracy, F1, MAE, RMSE, R²",
        rotation: -2.5,
        top: 290,
        right: -30,
        width: 240,
        gradient: "linear-gradient(135deg, #172554 0%, #1e40af 100%)",
      },
    ],
  },
];

// Helper: Card Icon Resolver
function ScCardIcon({ type }: { type: FloatingCardData["iconType"] }) {
  switch (type) {
    case "clock":
      return <Clock className="w-4 h-4 text-white" />;
    case "trend":
      return <TrendingUp className="w-4 h-4 text-white" />;
    case "clean":
      return <ArrowLeftRight className="w-4 h-4 text-white" />;
    case "copy":
      return <Copy className="w-4 h-4 text-white" />;
    case "nodes":
      return <Share2 className="w-4 h-4 text-white" />;
    case "globe":
      return <Globe className="w-4 h-4 text-white" />;
    case "grid":
      return <LayoutGrid className="w-4 h-4 text-white" />;
    case "flame":
      return <Flame className="w-4 h-4 text-white" />;
    default:
      return <Sparkles className="w-4 h-4 text-white" />;
  }
}

// =========================================================================
// SCREEN 1: UNDERSTAND YOUR DATA (Laptop Desktop Widescreen View)
// =========================================================================
function LaptopPortfolioScreen() {
  return (
    <div className="flex flex-col h-full select-none text-[#111827] bg-[#f8fafc] font-['Manrope',sans-serif] overflow-hidden text-[10px]">
      {/* Laptop Window Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-2xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-2xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-2xs" />
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200/70 text-[9px] font-semibold text-slate-600 max-w-[270px] w-full justify-center">
          <span className="text-emerald-500 text-[8.5px]">🔒</span>
          <span className="truncate">smartdataanalyst.ai/workspace • sales_data.xlsx</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8.5px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
            ● 94% Quality
          </span>
          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px]">
            👤
          </div>
        </div>
      </div>

      {/* Sub-header Navigation */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-black text-slate-900 text-[10.5px]">sales_data.xlsx</span>
          <span className="text-[8.5px] text-slate-400 font-bold">24,580 rows • 14 cols • 4.2 MB</span>
        </div>
        <div className="flex items-center gap-1 text-[8.5px] font-bold">
          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">Overview</span>
          <span className="px-2 py-0.5 rounded-full text-slate-500 hover:bg-slate-100">Profile</span>
          <span className="px-2 py-0.5 rounded-full text-slate-500 hover:bg-slate-100">Clean</span>
          <span className="px-2 py-0.5 rounded-full text-slate-500 hover:bg-slate-100">AutoML</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col gap-2 overflow-hidden">
        {/* 4 Metric Cards */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white p-2 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="text-[8px] font-bold text-slate-400">Total Records</div>
            <div className="text-[13px] font-black text-slate-900 mt-0.5 leading-tight">24,580</div>
            <div className="text-[7.5px] font-extrabold text-emerald-600">↑ 100% parsed</div>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="text-[8px] font-bold text-slate-400">Data Quality</div>
            <div className="text-[13px] font-black text-emerald-600 mt-0.5 leading-tight">94.2%</div>
            <div className="text-[7.5px] font-bold text-slate-400">Grade: Excellent</div>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="text-[8px] font-bold text-slate-400">Columns</div>
            <div className="text-[13px] font-black text-slate-900 mt-0.5 leading-tight">14</div>
            <div className="text-[7.5px] font-bold text-blue-600">8 num • 4 cat</div>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/70 shadow-2xs">
            <div className="text-[8px] font-bold text-slate-400">Missing Rate</div>
            <div className="text-[13px] font-black text-amber-600 mt-0.5 leading-tight">0.4%</div>
            <div className="text-[7.5px] font-bold text-slate-400">128 cells only</div>
          </div>
        </div>

        {/* Split Grid: Quality Chart + Columns Profiler Table */}
        <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
          {/* Quality Distribution Curve */}
          <div className="col-span-5 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800 text-[9.5px]">Quality Distribution</span>
              <span className="text-[7.5px] font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded">
                Auto-Profiled
              </span>
            </div>
            {/* SVG Health Area */}
            <div className="h-14 w-full relative mt-1">
              <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="laptopHealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M0 45 L30 38 L60 32 L90 22 L120 18 L150 12 L180 8 L200 6 L200 60 L0 60 Z" fill="url(#laptopHealthGrad)" />
                <motion.path
                  d="M0 45 L30 38 L60 32 L90 22 L120 18 L150 12 L180 8 L200 6"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
            </div>
            {/* Filter Pills */}
            <div className="flex items-center justify-between text-[7.5px] font-bold pt-1 border-t border-slate-100">
              <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full">All (14)</span>
              <span className="text-slate-500">Numeric (8)</span>
              <span className="text-slate-500">Categorical (4)</span>
              <span className="text-slate-500">Date (2)</span>
            </div>
          </div>

          {/* Visual Analytics Mode (Replaced raw table with interactive visual charts) */}
          <div className="col-span-7 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider">
                  Visual Distribution Mode
                </span>
              </div>
              <span className="text-[7.5px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200/60">
                Live Interactive Chart
              </span>
            </div>

            {/* Visual Bar Chart: Revenue by Market Segment */}
            <div className="py-1">
              <div className="flex items-center justify-between text-[8px] text-slate-500 mb-1">
                <span className="font-bold text-slate-700">Net Revenue by Region ($k)</span>
                <span className="font-mono text-emerald-600 font-extrabold">↑ +24.8% YoY</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-end h-16 pt-1 px-1 bg-slate-50/80 rounded-lg border border-slate-100">
                {/* Bar 1 */}
                <div className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[7px] font-bold text-slate-700">$148k</span>
                  <div className="w-full bg-blue-100 rounded-t-xs h-[75%] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-xs" />
                  </div>
                  <span className="text-[7px] font-semibold text-slate-500 truncate w-full text-center">N.Amer</span>
                </div>
                {/* Bar 2 */}
                <div className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[7px] font-bold text-slate-700">$92k</span>
                  <div className="w-full bg-blue-100 rounded-t-xs h-[50%] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-blue-500 rounded-t-xs" />
                  </div>
                  <span className="text-[7px] font-semibold text-slate-500 truncate w-full text-center">EMEA</span>
                </div>
                {/* Bar 3 */}
                <div className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[7px] font-bold text-slate-700">$184k</span>
                  <div className="w-full bg-blue-100 rounded-t-xs h-[92%] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xs" />
                  </div>
                  <span className="text-[7px] font-semibold text-slate-500 truncate w-full text-center">APAC</span>
                </div>
                {/* Bar 4 */}
                <div className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[7px] font-bold text-slate-700">$64k</span>
                  <div className="w-full bg-blue-100 rounded-t-xs h-[38%] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-xs" />
                  </div>
                  <span className="text-[7px] font-semibold text-slate-500 truncate w-full text-center">LATAM</span>
                </div>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-100 text-[7.5px] text-slate-400 font-bold flex justify-between items-center">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                4 Key Segments Analyzed
              </span>
              <span className="text-blue-600 font-black">Visual Analytics Active ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// SCREEN 2: CLEAN YOUR DATA (Laptop Desktop Widescreen View)
// =========================================================================
function LaptopCleanDataScreen() {
  return (
    <div className="flex flex-col h-full select-none text-[#111827] bg-[#f8fafc] font-['Manrope',sans-serif] overflow-hidden text-[10px]">
      {/* Laptop Window Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-2xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-2xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-2xs" />
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200/70 text-[9px] font-semibold text-purple-700 max-w-[270px] w-full justify-center">
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span className="truncate">Auto-Clean Studio • Missing Values & Outliers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8.5px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            ● 3 Actions Pending
          </span>
          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px]">
            👤
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col gap-2 overflow-hidden">
        {/* Smart Issue Detected Banner */}
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/80 to-purple-50/80 p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9.5px] font-black text-slate-900 flex items-center gap-1.5">
                <span>Data Issue Detected: Customer_Age column</span>
                <span className="text-[7.5px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.2 rounded-full">
                  128 Missing Values
                </span>
              </div>
              <div className="text-[8px] font-semibold text-slate-600 mt-0.5">
                Recommended action: <span className="font-black text-slate-900">Median imputation (value = 34.2)</span> & IQR Winsorization
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              className="px-2 py-0.5 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 text-[8.5px] shadow-2xs hover:bg-slate-50 cursor-pointer"
            >
              Review
            </button>
            <button
              type="button"
              className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#db2777] text-white font-black text-[8.5px] shadow-sm hover:opacity-95 cursor-pointer flex items-center gap-1"
            >
              <span>Apply Fix</span>
              <CheckCircle2 className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* Split Grid: Clean Rules Breakdown + Live Audit Preview Table */}
        <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
          {/* Cleaning Breakdown Summary Card */}
          <div className="col-span-4 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <span className="font-black text-slate-900 text-[9.5px] border-b border-slate-100 pb-1">
              Active Cleaning Engine
            </span>
            <div className="space-y-1 py-0.5">
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-slate-500 font-medium">Missing (Age)</span>
                <span className="font-extrabold text-amber-600 bg-amber-50 px-1 rounded">1.8% • Median</span>
              </div>
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-slate-500 font-medium">Outliers (IQR)</span>
                <span className="font-extrabold text-purple-600 bg-purple-50 px-1 rounded">3.4% Flagged</span>
              </div>
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-slate-500 font-medium">Duplicates</span>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-1 rounded">0.2% Auto-dedup</span>
              </div>
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="text-slate-500 font-medium">Schema Health</span>
                <span className="font-extrabold text-emerald-600 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Passed 14/14
                </span>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[7.5px] text-slate-400 font-bold">
              <span>Method: Median Imputation</span>
              <span className="text-purple-600 font-black">Audit Validated ✓</span>
            </div>
          </div>

          {/* Visual Outlier Bell Curve & Imputation Scatter Mode (Replaced raw table) */}
          <div className="col-span-8 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                <span className="text-[8.5px] font-black text-slate-800 uppercase tracking-wider">
                  Outlier Bell Curve & Normalization
                </span>
              </div>
              <span className="text-[7.5px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full border border-purple-200">
                Gaussian Curve Mode
              </span>
            </div>

            {/* SVG Gaussian Bell Curve & Scatter Distribution */}
            <div className="relative py-1 flex flex-col justify-center">
              <svg viewBox="0 0 240 60" className="w-full h-15 overflow-visible">
                <defs>
                  <linearGradient id="bellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Normal Distribution Fill */}
                <path
                  d="M 10 52 C 40 52, 60 48, 80 34 C 100 18, 110 8, 120 8 C 130 8, 140 18, 160 34 C 180 48, 200 52, 230 52 Z"
                  fill="url(#bellGrad)"
                />
                {/* Normal Distribution Stroke */}
                <path
                  d="M 10 52 C 40 52, 60 48, 80 34 C 100 18, 110 8, 120 8 C 130 8, 140 18, 160 34 C 180 48, 200 52, 230 52"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Mean Line */}
                <line x1="120" y1="8" x2="120" y2="52" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="2 2" />

                {/* IQR Clean Zone Shading */}
                <rect x="80" y="20" width="80" height="32" fill="#10b981" fillOpacity="0.08" rx="2" />

                {/* Clean Sample Dots */}
                <circle cx="95" cy="42" r="2.5" fill="#3b82f6" />
                <circle cx="108" cy="24" r="2.5" fill="#3b82f6" />
                <circle cx="120" cy="12" r="3" fill="#6366f1" />
                <circle cx="132" cy="22" r="2.5" fill="#3b82f6" />
                <circle cx="145" cy="38" r="2.5" fill="#3b82f6" />

                {/* Fixed Outlier Markers (Capped to IQR boundary) */}
                <circle cx="215" cy="50" r="3.5" fill="#ec4899" className="animate-pulse" />
                <line x1="215" y1="50" x2="160" y2="34" stroke="#ec4899" strokeWidth="1" strokeDasharray="1.5 1.5" />
                <text x="180" y="44" fill="#be185d" fontSize="6.5" fontWeight="bold">Capped</text>
              </svg>
            </div>

            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[7.5px] text-slate-400 font-bold">
              <span>Visual Filter: 128 cells normalized • 0 data points deleted</span>
              <span className="text-emerald-600 font-black">Clean Data Ready ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// SCREEN 3: BUILD & COMPARE MODELS (Laptop Desktop Widescreen View)
// =========================================================================
function LaptopExploreScreen() {
  return (
    <div className="flex flex-col h-full select-none text-[#111827] bg-[#f8fafc] font-['Manrope',sans-serif] overflow-hidden text-[10px]">
      {/* Laptop Window Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white border-b border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-2xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-2xs" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-2xs" />
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200/70 text-[9px] font-semibold text-indigo-700 max-w-[290px] w-full justify-center">
          <Cpu className="w-3 h-3 text-indigo-600" />
          <span className="truncate">AutoML Benchmarking • Target: Customer Churn</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8.5px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
            ● 4 Models Trained
          </span>
          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px]">
            👤
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col gap-2 overflow-hidden">
        {/* Split Grid: AutoML Leaderboard Table + Top Factors Bar Chart */}
        <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
          {/* Models Leaderboard Table */}
          <div className="col-span-7 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
              <span>Model Architecture</span>
              <span>Accuracy</span>
              <span>F1 Score</span>
              <span>Latency</span>
            </div>
            <div className="space-y-1 py-0.5">
              <div className="flex items-center justify-between p-1 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[8.5px]">
                <div className="flex items-center gap-1 font-black text-slate-900">
                  <span className="text-amber-500">★</span>
                  <span>XGBoost</span>
                  <span className="text-[7.5px] bg-emerald-600 text-white font-extrabold px-1 rounded">Top</span>
                </div>
                <span className="font-extrabold text-emerald-700">93.1%</span>
                <span className="font-bold text-slate-700">0.92</span>
                <span className="font-mono text-[8px] text-slate-500">14ms</span>
              </div>
              <div className="flex items-center justify-between p-1 rounded-lg bg-slate-50 border border-slate-100 text-[8.5px]">
                <span className="font-bold text-slate-800">Random Forest</span>
                <span className="font-extrabold text-slate-700">91.4%</span>
                <span className="font-semibold text-slate-600">0.89</span>
                <span className="font-mono text-[8px] text-slate-500">42ms</span>
              </div>
              <div className="flex items-center justify-between p-1 rounded-lg bg-slate-50 border border-slate-100 text-[8.5px]">
                <span className="font-bold text-slate-800">Logistic Regression</span>
                <span className="font-extrabold text-slate-700">88.6%</span>
                <span className="font-semibold text-slate-600">0.84</span>
                <span className="font-mono text-[8px] text-slate-500">5ms</span>
              </div>
              <div className="flex items-center justify-between p-1 rounded-lg bg-slate-50 border border-slate-100 text-[8.5px]">
                <span className="font-bold text-slate-800">Decision Tree</span>
                <span className="font-extrabold text-slate-700">87.2%</span>
                <span className="font-semibold text-slate-600">0.82</span>
                <span className="font-mono text-[8px] text-slate-500">4ms</span>
              </div>
            </div>
            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[7.5px] text-slate-400 font-bold">
              <span>5-Fold Cross Validated • Hyperparameters Optimized</span>
              <span className="text-indigo-600 font-black">XGBoost Selected</span>
            </div>
          </div>

          {/* Top Feature Importance Card */}
          <div className="col-span-5 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs flex flex-col justify-between">
            <span className="font-black text-slate-900 text-[9.5px] border-b border-slate-100 pb-1">
              Top Feature Importance
            </span>
            <div className="space-y-1.5 py-1">
              {[
                { label: "Monthly Spend", pct: 88, color: "bg-indigo-600" },
                { label: "Account Tenure", pct: 74, color: "bg-blue-600" },
                { label: "Contract Type", pct: 62, color: "bg-cyan-600" },
                { label: "Support Tickets", pct: 45, color: "bg-slate-500" },
              ].map((f, i) => (
                <div key={i} className="text-[8px]">
                  <div className="flex justify-between font-bold text-slate-700 mb-0.5">
                    <span>{f.label}</span>
                    <span>{f.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[7.5px] text-slate-400 font-bold">
              <span>AUC: 0.96 • Latency: 14ms</span>
              <span className="text-emerald-600 font-black">Ready ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MASSIVE LEFT-TO-RIGHT GEOMETRIC SHAPE TRANSITION (Behind Laptop)
// =========================================================================
function ScGeometricTransition({ activeScene }: { activeScene: number }) {
  return (
    <div className="absolute -inset-x-24 -inset-y-16 pointer-events-none z-5 overflow-visible select-none flex items-center justify-center">
      <AnimatePresence mode="wait">
        {activeScene === 0 && (
          <motion.div
            key="sc-geom-0"
            initial={{ opacity: 0, x: -50, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.94 }}
            transition={{ duration: 0.5, ease: TIMING.easeEnter }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Massive Royal Blue & Cyan Faceted Geometric Transition from left to right */}
            <svg
              viewBox="0 0 920 540"
              fill="none"
              className="absolute w-[880px] lg:w-[1000px] h-[520px] -left-16 lg:-left-24 top-0 overflow-visible"
              style={{ filter: "drop-shadow(0 20px 40px rgba(37,99,235,0.22))" }}
            >
              <defs>
                <linearGradient id="scGeomGrad0A" x1="0%" y1="10%" x2="100%" y2="90%">
                  <stop offset="0%" stopColor="#1e40af" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="scGeomGrad0B" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              {/* Large sweeping faceted polygon */}
              <polygon
                points="40,120 380,40 680,190 880,110 840,420 440,470 120,410"
                fill="url(#scGeomGrad0A)"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
              <polygon
                points="220,60 520,200 420,410 160,280"
                fill="url(#scGeomGrad0B)"
                fillOpacity="0.5"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              <line
                x1="60"
                y1="130"
                x2="860"
                y2="110"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="140 600"
                className="animate-pulse"
              />
            </svg>
          </motion.div>
        )}

        {activeScene === 1 && (
          <motion.div
            key="sc-geom-1"
            initial={{ opacity: 0, x: -50, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.94 }}
            transition={{ duration: 0.5, ease: TIMING.easeEnter }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Massive Electric Purple & Magenta Faceted Geometric Transition from left to right */}
            <svg
              viewBox="0 0 920 540"
              fill="none"
              className="absolute w-[880px] lg:w-[1000px] h-[520px] -left-16 lg:-left-24 top-0 overflow-visible"
              style={{ filter: "drop-shadow(0 20px 40px rgba(168,85,247,0.25))" }}
            >
              <defs>
                <linearGradient id="scGeomGrad1A" x1="0%" y1="10%" x2="100%" y2="90%">
                  <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.8" />
                  <stop offset="45%" stopColor="#9333ea" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#db2777" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="scGeomGrad1B" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <polygon
                points="30,140 360,50 660,210 890,120 850,440 460,480 110,430"
                fill="url(#scGeomGrad1A)"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.45"
              />
              <polygon
                points="240,70 540,220 440,430 180,300"
                fill="url(#scGeomGrad1B)"
                fillOpacity="0.55"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeOpacity="0.7"
              />
              <line
                x1="50"
                y1="150"
                x2="870"
                y2="120"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="140 600"
                className="animate-pulse"
              />
            </svg>
          </motion.div>
        )}

        {activeScene === 2 && (
          <motion.div
            key="sc-geom-2"
            initial={{ opacity: 0, x: -50, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.94 }}
            transition={{ duration: 0.5, ease: TIMING.easeEnter }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Massive Deep Midnight Indigo & Cyber Violet Geometric Transition from left to right */}
            <svg
              viewBox="0 0 920 540"
              fill="none"
              className="absolute w-[880px] lg:w-[1000px] h-[520px] -left-16 lg:-left-24 top-0 overflow-visible"
              style={{ filter: "drop-shadow(0 20px 40px rgba(30,27,75,0.35))" }}
            >
              <defs>
                <linearGradient id="scGeomGrad2A" x1="0%" y1="10%" x2="100%" y2="90%">
                  <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#3730a3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="scGeomGrad2B" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <polygon
                points="40,110 390,30 700,170 910,90 870,410 480,460 130,420"
                fill="url(#scGeomGrad2A)"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeOpacity="0.45"
              />
              <polygon
                points="230,50 550,190 430,390 170,270"
                fill="url(#scGeomGrad2B)"
                fillOpacity="0.5"
                stroke="#ffffff"
                strokeWidth="1.3"
                strokeOpacity="0.65"
              />
              <line
                x1="60"
                y1="120"
                x2="890"
                y2="90"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="140 600"
                className="animate-pulse"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================================
// LAPTOP MOCKUP SHELL (MacBook Pro Aluminum Chassis with 16:10 Display)
// =========================================================================
interface LaptopMockupProps {
  sceneIndex: number;
}

function LaptopMockup({ sceneIndex }: LaptopMockupProps) {
  return (
    <div className="relative w-full max-w-[590px] sm:max-w-[630px] lg:max-w-[660px] select-none">
      {/* 1. Laptop Screen Lid (Space Gray Aluminum Chassis with Thin Bezel & Camera) */}
      <div
        className="relative w-full rounded-t-[20px] rounded-b-[4px] p-[7px] sm:p-[9px] bg-gradient-to-b from-[#2b3544] via-[#1a202c] to-[#0f172a] shadow-[0_30px_70px_rgba(15,23,42,0.38)]"
        style={{
          boxShadow:
            "0 0 0 1px #475569, 0 0 0 3px #1e293b, -18px 25px 55px rgba(15, 23, 42, 0.35), 0 35px 80px rgba(30, 41, 59, 0.28)",
        }}
      >
        {/* Top Bezel Center Camera Housing */}
        <div className="absolute top-[3px] sm:top-[4px] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 z-30">
          <div className="w-1.5 h-1.5 rounded-full bg-black ring-1 ring-slate-700/60 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-emerald-500/80" />
          </div>
        </div>

        {/* Screen Display Area (16:10 Aspect Ratio) */}
        <div className="relative w-full aspect-[16/10] rounded-[6px] overflow-hidden bg-white shadow-inner">
          <AnimatePresence mode="wait">
            {sceneIndex === 0 && (
              <motion.div
                key="laptop-scene-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: TIMING.easeEnter }}
                className="w-full h-full"
              >
                <LaptopPortfolioScreen />
              </motion.div>
            )}

            {sceneIndex === 1 && (
              <motion.div
                key="laptop-scene-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: TIMING.easeEnter }}
                className="w-full h-full"
              >
                <LaptopCleanDataScreen />
              </motion.div>
            )}

            {sceneIndex === 2 && (
              <motion.div
                key="laptop-scene-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: TIMING.easeEnter }}
                className="w-full h-full"
              >
                <LaptopExploreScreen />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Anti-glare specular glass reflection overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-25"
            style={{
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0) 60%)",
            }}
          />
        </div>
      </div>

      {/* 2. Recessed Metallic Center Hinge */}
      <div className="w-28 sm:w-36 h-2 mx-auto bg-gradient-to-b from-[#111827] to-[#030712] rounded-b-xs shadow-inner" />

      {/* 3. Aluminum Laptop Base / Deck (Slightly wider than lid with front thumb notch) */}
      <div
        className="w-[106%] -mx-[3%] h-3.5 sm:h-4 rounded-b-xl bg-gradient-to-b from-[#cbd5e1] via-[#94a3b8] to-[#64748b] border-t border-white/70 relative shadow-[0_20px_45px_rgba(15,23,42,0.3)] flex flex-col justify-start"
      >
        {/* Top Chamfer Edge Highlight */}
        <div className="w-full h-[1px] bg-white/90" />
        {/* Front Thumb Cutout for opening lid */}
        <div className="w-14 sm:w-16 h-1 mx-auto bg-slate-500/70 rounded-b-xs shadow-2xs" />
        {/* Bottom Dark Under-lip */}
        <div className="w-full h-1 mt-auto bg-gradient-to-b from-slate-600 to-slate-800 rounded-b-xl" />
      </div>

      {/* 4. Ambient Contact Drop Shadow under Laptop */}
      <div className="w-[94%] mx-auto h-4 bg-gradient-to-b from-slate-900/30 to-transparent blur-md -mt-1 rounded-full pointer-events-none" />

      {/* 5. Futuristic Reflective Ground Pedestal & Floating Status Chips */}
      <div className="relative w-[114%] -mx-[7%] pt-3 pb-2 flex flex-col items-center pointer-events-none">
        {/* Luminous Neon Ground Glow */}
        <div className="absolute inset-x-4 top-0 h-10 bg-gradient-to-r from-blue-500/20 via-cyan-400/30 to-purple-500/20 blur-xl rounded-full" />

        {/* Reflective Ground Plate (Perspective Plane) */}
        <div className="relative w-full h-8 rounded-[28px] bg-gradient-to-b from-white/60 via-slate-100/30 to-transparent border border-white/80 shadow-[0_12px_30px_rgba(37,99,235,0.08)] flex items-center justify-center overflow-hidden">
          {/* Subtle Grid Lines on Ground Plane */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(37,99,235,0.3) 1px, transparent 1px), linear-gradient(0deg, rgba(37,99,235,0.3) 1px, transparent 1px)",
              backgroundSize: "20px 10px",
            }}
          />
          {/* Central Ground Beam */}
          <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8]" />
        </div>

        {/* Floating Feature Status Pills Underneath */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs text-[10px] font-black text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>⚡ 100% In-Memory RAM</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md border border-blue-500 shadow-xs text-[10px] font-black text-white">
            <span>📊 Visual Analytics Active</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs text-[10px] font-black text-slate-800">
            <span className="text-purple-600 font-extrabold">🛡️ 94% Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MAIN SELF-CONTAINED EXPORT: ShowcaseScroll
// =========================================================================
export default function ShowcaseScroll() {
  const outerWrapperRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<number>(0);
  const [isTransitionLocked, setIsTransitionLocked] = useState<boolean>(false);
  const [isNearViewport, setIsNearViewport] = useState<boolean>(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const shouldReduceMotion = useReducedMotion();

  // IntersectionObserver: only listen to scroll and mouse events while section is near viewport
  useEffect(() => {
    const el = outerWrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: "200px 0px 200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Window scroll calculation (active only when near viewport)
  useEffect(() => {
    if (!isNearViewport) return;

    const handleScroll = () => {
      const el = outerWrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const denom = rect.height - window.innerHeight;
      if (denom <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / denom));
      const targetScene = progress < 0.33 ? 0 : progress < 0.67 ? 1 : 2;

      if (targetScene !== activeScene) {
        setActiveScene(targetScene);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isNearViewport, activeScene]);

  // Subtle interactive 3D mouse parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isNearViewport) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMouseOffset({
      x: (clientX / innerWidth - 0.5) * 16,
      y: (clientY / innerHeight - 0.5) * 16,
    });
  };

  // Jump to specific scene when clicking stage tabs or side progress bars
  const handleJumpToScene = (index: number) => {
    setActiveScene(index);
    const el = outerWrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const denom = rect.height - window.innerHeight;
    const targetScroll = scrollTop + (index / 2) * denom;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const currentScene = SCENE_DATA[activeScene];

  return (
    <section
      ref={outerWrapperRef}
      onMouseMove={handleMouseMove}
      className="sc-showcase-section relative w-full bg-white text-slate-900 select-none overflow-x-clip font-['Manrope',sans-serif]"
      style={{
        height: "280vh",
        ["--sc-royal-blue" as string]: "#3A35E0",
        ["--sc-royal-blue-hover" as string]: "#2d28cb",
      }}
    >
      {/* Inner Sticky Container (100vh pinned to top) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        <div className="max-w-[1260px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
          {/* ========================================================
              LEFT COLUMN: HEADING, SUBTEXT, CTA & INTERACTIVE TABS
              ======================================================== */}
          <div className="flex flex-col items-start z-20 lg:col-span-5">
            {/* Interactive Step Switcher Tabs (Click to instantly switch scenes) */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-full mb-5 border border-slate-200/80 shadow-xs">
              {[
                { id: 0, label: "01 • Understand", icon: "📊" },
                { id: 1, label: "02 • Clean", icon: "✨" },
                { id: 2, label: "03 • Models", icon: "🤖" },
              ].map((step) => {
                const isActive = activeScene === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleJumpToScene(step.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#3A35E0] text-white shadow-md shadow-[#3A35E0]/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <span className="text-xs">{step.icon}</span>
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`sc-text-${currentScene.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{
                  duration: shouldReduceMotion ? 0.15 : 0.4,
                  ease: TIMING.easeEnter,
                }}
                className="flex flex-col items-start"
              >
                {/* Heading Lines (revealed with stagger) */}
                <h2 className="text-4xl sm:text-5xl lg:text-[52px] font-black text-[#0f172a] leading-[1.08] tracking-tight">
                  {currentScene.titleLines.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: TIMING.enterHeading + idx * 0.05,
                        duration: 0.35,
                        ease: TIMING.easeEnter,
                      }}
                    >
                      {line}
                    </motion.div>
                  ))}
                </h2>

                {/* Subtext */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: TIMING.enterSubtext,
                    duration: 0.35,
                    ease: TIMING.easeEnter,
                  }}
                  className="text-slate-500 font-semibold text-base sm:text-lg mt-4 max-w-[34ch] leading-snug"
                >
                  {currentScene.subtext}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: TIMING.enterSubtext + 0.05,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 280,
                    damping: 20,
                  }}
                  className="mt-6 flex items-center gap-4 flex-wrap"
                >
                  <button
                    type="button"
                    style={{ backgroundColor: "var(--sc-royal-blue)" }}
                    className="hover:opacity-95 text-white font-extrabold text-sm px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    {currentScene.ctaText}
                  </button>

                  {/* Scene Navigation Links */}
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                    {activeScene > 0 && (
                      <button
                        type="button"
                        onClick={() => handleJumpToScene(activeScene - 1)}
                        className="text-slate-600 hover:text-[#3A35E0] cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <span>‹ Prev</span>
                      </button>
                    )}
                    {activeScene < 2 && (
                      <button
                        type="button"
                        onClick={() => handleJumpToScene(activeScene + 1)}
                        className="text-[#3A35E0] hover:underline cursor-pointer flex items-center gap-1 font-extrabold"
                      >
                        <span>Next: {activeScene === 0 ? "Clean Data" : "Models"} ›</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ========================================================
              RIGHT COLUMN: LAPTOP VIEW + MASSIVE GEOMETRIC TRANSITION + CARDS
              ======================================================== */}
          <div className="relative flex justify-center items-center h-[580px] perspective-[1200px] lg:col-span-7">
            {/* Massive Left-to-Right Geometric Shape Transition */}
            <ScGeometricTransition activeScene={activeScene} />

            {/* Central Laptop Mockup with idle float and mouse tilt */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotateY: mouseOffset.x * 0.5,
                rotateX: -mouseOffset.y * 0.5,
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: TIMING.idleLoopDuration,
                  ease: "easeInOut",
                },
                rotateY: { duration: 0.2, ease: "linear" },
                rotateX: { duration: 0.2, ease: "linear" },
              }}
              className="relative z-20 w-full flex justify-center will-change-transform"
            >
              <LaptopMockup sceneIndex={activeScene} />
            </motion.div>

            {/* Floating Tilted Cards with soft shadow and spring popup entrance */}
            <div className="absolute inset-0 pointer-events-none z-35">
              <AnimatePresence mode="sync">
                {currentScene.cards.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    initial={{
                      opacity: 0,
                      scale: 0.85,
                      x: 60,
                      rotate: card.rotation + 6,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      rotate: card.rotation,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      x: 60,
                      transition: {
                        duration: 0.35,
                        delay: idx * 0.08,
                        ease: TIMING.easeExit,
                      },
                    }}
                    transition={{
                      delay: TIMING.enterCards + idx * 0.12,
                      type: "spring",
                      stiffness: 280,
                      damping: 20,
                    }}
                    style={{
                      top: `${card.top}px`,
                      right: `${card.right}px`,
                      width: `${card.width}px`,
                      background: card.gradient,
                      boxShadow:
                        "0 18px 40px -10px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.2) inset",
                      transform: `translate(${mouseOffset.x * (1 + idx * 0.2)}px, ${mouseOffset.y * (1 + idx * 0.2)}px)`,
                    }}
                    className="absolute p-4 rounded-2xl text-white shadow-2xl backdrop-blur-md will-change-transform"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                        <ScCardIcon type={card.iconType} />
                      </div>
                      {card.badge && (
                        <span className="text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black leading-snug drop-shadow-sm">
                      {card.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 3-Segment Progress Indicator */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-40">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleJumpToScene(idx)}
              className="group flex items-center gap-2 cursor-pointer p-1"
              aria-label={`Jump to scene ${idx + 1}`}
            >
              <div
                className={`h-8 w-1 rounded-full transition-all duration-300 ${
                  activeScene === idx
                    ? "bg-[#3A35E0] h-10 w-1.5"
                    : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
