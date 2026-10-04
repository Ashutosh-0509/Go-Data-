"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Users,
  Award,
  Zap,
  ExternalLink,
  Check,
} from "lucide-react";
import ShowcaseScroll from "./ShowcaseScroll";

interface CryptoLandingPageProps {
  onLoadDemo: () => void;
  onFileUpload: (file: File) => void;
}

// =========================================================================
// MASSIVE LEFT-TO-RIGHT GEOMETRIC SHAPE TRANSITION (Behind PC & Mobile)
// =========================================================================
function HeroGeometricTransition({
  mouseOffset,
}: {
  mouseOffset: { rx: number; ry: number; scale: number };
}) {
  return (
    <div className="absolute -inset-x-24 -inset-y-16 pointer-events-none z-5 overflow-visible select-none flex items-center justify-center">
      {/* 1. Deep 3D Perspective Isometric Grid Terrain (Fades from left to right) */}
      <motion.div
        animate={{
          x: [mouseOffset.ry * -1.2 - 6, mouseOffset.ry * -1.2 + 6, mouseOffset.ry * -1.2 - 6],
          y: [mouseOffset.rx * 1.2 - 4, mouseOffset.rx * 1.2 + 4, mouseOffset.rx * 1.2 - 4],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[860px] lg:w-[1000px] h-[500px] -left-16 lg:-left-28 top-4 opacity-40"
        style={{
          transform: "rotateX(54deg) rotateZ(-22deg) skewX(-14deg)",
          background:
            "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, black 35%, transparent 85%)",
        }}
      />

      {/* 2. Massive Angled Polygonal Facets & Dynamic Ribbons (Left-to-Right sweep) */}
      <svg
        viewBox="0 0 960 560"
        fill="none"
        className="absolute w-[920px] lg:w-[1080px] h-[540px] -left-20 lg:-left-32 -top-4 overflow-visible"
        style={{
          filter: "drop-shadow(0 25px 45px rgba(15, 23, 42, 0.28))",
        }}
      >
        <defs>
          {/* Multi-layered Gradients for massive faceted look */}
          <linearGradient id="heroGeomGradPrimary" x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#0ea5e9" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="heroGeomGradViolet" x1="5%" y1="0%" x2="95%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#4f46e5" stopOpacity="0.7" />
            <stop offset="85%" stopColor="#7c3aed" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="heroGeomGradCyanPink" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="heroGeomStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#67e8f9" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#c084fc" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Back Expansive Geometric Facet (Sweeping far left to far right) */}
        <motion.polygon
          points="20,100 420,30 680,180 920,95 940,380 520,500 140,460"
          fill="url(#heroGeomGradViolet)"
          stroke="url(#heroGeomStrokeGrad)"
          strokeWidth="1.6"
          strokeOpacity="0.45"
          initial={{ opacity: 0, scale: 0.9, x: -30 }}
          animate={{
            opacity: 0.7,
            scale: 1,
            x: [mouseOffset.ry * -0.6 - 5, mouseOffset.ry * -0.6 + 5, mouseOffset.ry * -0.6 - 5],
            y: [mouseOffset.rx * 0.6 - 4, mouseOffset.rx * 0.6 + 4, mouseOffset.rx * 0.6 - 4],
          }}
          transition={{
            opacity: { duration: 0.8 },
            x: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Primary Sharp Geometric Facet 1 (Left through center to right behind devices) */}
        <motion.polygon
          points="60,200 340,70 620,230 840,130 800,440 410,460"
          fill="url(#heroGeomGradPrimary)"
          stroke="url(#heroGeomStrokeGrad)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.94, x: -45 }}
          animate={{
            opacity: 0.88,
            scale: 1,
            x: [mouseOffset.ry * -0.9 - 7, mouseOffset.ry * -0.9 + 7, mouseOffset.ry * -0.9 - 7],
            y: [mouseOffset.rx * 0.9 - 5, mouseOffset.rx * 0.9 + 5, mouseOffset.rx * 0.9 - 5],
          }}
          transition={{
            opacity: { duration: 0.7, delay: 0.1 },
            x: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Crisp Angled Transition Slices (Creates dramatic faceted shift) */}
        <motion.polygon
          points="250,50 560,190 450,400 170,280"
          fill="url(#heroGeomGradCyanPink)"
          fillOpacity="0.55"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeOpacity="0.75"
          animate={{
            x: [mouseOffset.ry * -1.2, mouseOffset.ry * -1.2 + 8, mouseOffset.ry * -1.2],
            y: [mouseOffset.rx * 1.2, mouseOffset.rx * 1.2 - 6, mouseOffset.rx * 1.2],
          }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.polygon
          points="560,165 860,95 810,360 510,420"
          fill="url(#heroGeomGradViolet)"
          fillOpacity="0.5"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeOpacity="0.65"
          animate={{
            x: [mouseOffset.ry * -1.4 + 5, mouseOffset.ry * -1.4 - 5, mouseOffset.ry * -1.4 + 5],
            y: [mouseOffset.rx * 1.4 - 5, mouseOffset.rx * 1.4 + 5, mouseOffset.rx * 1.4 - 5],
          }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* High-speed Light Shimmer streak traversing left to right along geometric edges */}
        <motion.line
          x1="50"
          y1="190"
          x2="840"
          y2="130"
          stroke="url(#heroGeomStrokeGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray="180 700"
          animate={{
            strokeDashoffset: [-880, 880],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.line
          x1="130"
          y1="450"
          x2="930"
          y2="360"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="140 800"
          animate={{
            strokeDashoffset: [-940, 940],
          }}
          transition={{
            duration: 4.0,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
      </svg>

      {/* 3. Floating 3D Faceted Diamond / Polyhedral Crystals (Strategic anchor points) */}
      {/* Crystal 1: Top-Left above PC window */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-8, 8, -8],
        }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-8 w-14 h-14 z-10 pointer-events-none"
        style={{
          transform: `translate(${mouseOffset.ry * -0.5}px, ${mouseOffset.rx * 0.5}px)`,
        }}
      >
        <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_12px_24px_rgba(37,99,235,0.45)]">
          <polygon points="30,4 54,24 30,56 6,24" fill="#0ea5e9" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1.2" />
          <polygon points="30,4 54,24 30,34" fill="#38bdf8" fillOpacity="0.95" />
          <polygon points="30,4 6,24 30,34" fill="#7dd3fc" fillOpacity="0.8" />
          <polygon points="6,24 30,34 30,56" fill="#0284c7" fillOpacity="0.9" />
          <polygon points="54,24 30,34 30,56" fill="#0369a1" fillOpacity="0.95" />
        </svg>
      </motion.div>

      {/* Crystal 2: Between PC window and phone */}
      <motion.div
        animate={{
          y: [12, -12, 12],
          rotate: [10, -10, 10],
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute left-[44%] -top-4 w-12 h-12 z-18 pointer-events-none"
        style={{
          transform: `translate(${mouseOffset.ry * -0.8}px, ${mouseOffset.rx * 0.8}px)`,
        }}
      >
        <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_12px_24px_rgba(124,58,237,0.5)]">
          <polygon points="30,4 54,24 30,56 6,24" fill="#8b5cf6" fillOpacity="0.85" stroke="#ffffff" strokeWidth="1.2" />
          <polygon points="30,4 54,24 30,34" fill="#a78bfa" fillOpacity="0.95" />
          <polygon points="30,4 6,24 30,34" fill="#c4b5fd" fillOpacity="0.85" />
          <polygon points="6,24 30,34 30,56" fill="#7c3aed" fillOpacity="0.9" />
          <polygon points="54,24 30,34 30,56" fill="#6d28d9" fillOpacity="0.95" />
        </svg>
      </motion.div>

      {/* Crystal 3: Bottom-Right behind mobile */}
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotate: [-12, 12, -12],
        }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="absolute -right-8 bottom-16 w-16 h-16 z-10 pointer-events-none"
        style={{
          transform: `translate(${mouseOffset.ry * -1.1}px, ${mouseOffset.rx * 1.1}px)`,
        }}
      >
        <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_14px_28px_rgba(14,165,233,0.45)]">
          <polygon points="30,4 54,24 30,56 6,24" fill="#06b6d4" fillOpacity="0.8" stroke="#ffffff" strokeWidth="1.2" />
          <polygon points="30,4 54,24 30,34" fill="#22d3ee" fillOpacity="0.95" />
          <polygon points="30,4 6,24 30,34" fill="#67e8f9" fillOpacity="0.9" />
          <polygon points="6,24 30,34 30,56" fill="#0891b2" fillOpacity="0.9" />
          <polygon points="54,24 30,34 30,56" fill="#0e7490" fillOpacity="0.95" />
        </svg>
      </motion.div>
    </div>
  );
}

export default function CryptoLandingPage({
  onLoadDemo,
  onFileUpload,
}: CryptoLandingPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState<"workspace" | "tech">("workspace");

  // Phone hover 3D tilt for top hero phone
  const [heroTilt, setHeroTilt] = useState({ rx: 4, ry: -8, scale: 1 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroTilt({
      rx: 4 - y * 18,
      ry: -8 + x * 22,
      scale: 1.02,
    });
  };

  const handleHeroMouseLeave = () => {
    setHeroTilt({ rx: 4, ry: -8, scale: 1 });
  };

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // =========================================================================
  // SCROLL-DRIVEN FIRST-IN FIRST-OUT (FIFO) STACK SHUFFLE DECK
  // =========================================================================
  const reviews = [
    {
      bg: "linear-gradient(140deg, #2563eb, #1d4ed8)",
      text: "Analysts: profile and clean a dataset in minutes.",
      handle: "Data Analyst",
    },
    {
      bg: "linear-gradient(140deg, #db2777, #be185d)",
      text: "Data scientists: benchmark models before building your own.",
      handle: "Data Scientist",
    },
    {
      bg: "linear-gradient(140deg, #0f172a, #1e293b)",
      text: "Business teams: understand your data without writing code.",
      handle: "Business Operations",
    },
    {
      bg: "linear-gradient(140deg, #9333ea, #7e22ce)",
      text: "Students: learn statistical methods with clear explanations.",
      handle: "Student / Learner",
    },
    {
      bg: "linear-gradient(140deg, #4f46e5, #4338ca)",
      text: "Researchers: check data quality before analysis.",
      handle: "Academic Researcher",
    },
    {
      bg: "linear-gradient(140deg, #0284c7, #0369a1)",
      text: "Interview portfolios: show a complete data workflow.",
      handle: "Portfolio Builder",
    },
  ];

  const deckSectionRef = useRef<HTMLDivElement>(null);
  const [deckScrollPos, setDeckScrollPos] = useState<number>(0);

  // Scroll listener for sticky FIFO review stack
  useEffect(() => {
    const handleScroll = () => {
      const el = deckSectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const denom = rect.height - window.innerHeight;
      if (denom <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / denom));
      setDeckScrollPos(progress * (reviews.length - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reviews.length]);

  const currDeckIdx = Math.min(reviews.length - 1, Math.floor(deckScrollPos));
  const deckFrac = deckScrollPos - currDeckIdx;

  const handleJumpToReview = (idx: number) => {
    const el = deckSectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const denom = rect.height - window.innerHeight;
    const targetScroll = scrollTop + (idx / (reviews.length - 1)) * denom;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-['Manrope',var(--font-manrope),sans-serif] selection:bg-[#3A35E0] selection:text-white antialiased">
      {/* Hidden File Input for Data Analyst Upload Integration */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          if (e.target.files?.[0]) onFileUpload(e.target.files[0]);
        }}
      />

      {/* ============================================================
          1. TOP NAVIGATION BAR (As in Screenshot 2)
          ============================================================ */}
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 w-[min(1080px,94%)] z-50 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,40,0.08)] border border-slate-100/80">
        {/* Brand Logo & Workspace / Technical Details Segmented Switch */}
        <div className="flex items-center gap-3">
          <div
            onClick={onLoadDemo}
            className="cursor-pointer border-[1.5px] border-[#3a5bff] px-2.5 py-1 rounded text-[#2f35d9] font-black text-sm tracking-tight whitespace-nowrap"
          >
            Smart Data Analyst
          </div>

          <div className="flex bg-[#eceef6] p-1 rounded-full text-xs font-bold">
            <span
              onClick={() => setActiveSegment("workspace")}
              className={`px-3.5 py-1 rounded-full cursor-pointer transition-all duration-150 ${
                activeSegment === "workspace"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Workspace
            </span>
            <span
              onClick={() => {
                setActiveSegment("tech");
                scrollToStory();
              }}
              className={`px-3.5 py-1 rounded-full cursor-pointer transition-all duration-150 ${
                activeSegment === "tech"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Technical Details
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-[13px] font-bold text-slate-700">
          <span onClick={scrollToStory} className="cursor-pointer hover:text-[#2f35d9] transition-colors">
            Features
          </span>
          <span onClick={scrollToStory} className="cursor-pointer hover:text-[#2f35d9] transition-colors">
            Resources
          </span>
          <span onClick={scrollToStory} className="cursor-pointer hover:text-[#2f35d9] transition-colors">
            About
          </span>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#2f35d9] hover:bg-[#252ac0] text-white text-xs font-extrabold px-4 py-2.5 rounded-full shadow-[0_2px_10px_rgba(47,53,217,0.25)] hover:shadow-[0_4px_14px_rgba(47,53,217,0.35)] transition-all cursor-pointer"
          >
            Start with Your Dataset
          </button>
        </div>
      </nav>

      {/* ============================================================
          2. HERO SECTION
          ============================================================ */}
      <header className="relative w-full bg-gradient-to-r from-[#3b9bff] via-[#3fc4f5] to-[#3eeaee] pt-24 pb-16 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Main Hero Container */}
        <div className="max-w-[1120px] w-[94%] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
          {/* Left Column: Top-to-Bottom Cascading Entrance */}
          <div className="text-white flex flex-col items-start">
            {/* Sleek Minimalist Feature Pill */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold mb-5 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Automated EDA, Cleaning & AutoML Platform</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-black leading-[1.08] tracking-tight">
              {/* Heading Line 1 */}
              <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="whitespace-normal sm:whitespace-nowrap"
              >
                From raw data
              </motion.div>
              {/* Heading Line 2 */}
              <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="whitespace-normal sm:whitespace-nowrap text-white/95 mt-1"
              >
                to ready insights.
              </motion.div>
            </h1>

            {/* Subtext (Drops in from top) */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.40, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-base sm:text-lg text-white/95 max-w-[44ch] leading-relaxed font-semibold"
            >
              Upload a CSV or Excel dataset and turn raw data into analysis-ready insights with automated profiling, cleaning, exploration and model benchmarking.
            </motion.p>

            {/* CTA Buttons (Pop in with bouncy spring) */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.52, type: "spring", stiffness: 320, damping: 22 }}
              className="flex items-center gap-3.5 mt-7 flex-wrap"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white hover:bg-slate-50 text-slate-900 font-black text-xs px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                Start with Your Dataset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLoadDemo}
                className="bg-[#2f6bff] hover:bg-[#255de0] text-white font-black text-xs px-6 py-3 rounded-full shadow-[0_2px_10px_rgba(47,107,255,0.3)] transition-shadow cursor-pointer"
              >
                Try Demo Dataset
              </motion.button>
            </motion.div>

            {/* Small trust line under buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-[12px] font-semibold text-white/90 mt-3 flex items-center gap-1.5"
            >
              Privacy-first • Automated analysis • Technical transparency
            </motion.div>

            {/* 4 Stats Chips (Cascading Drop from top) */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/20 w-full max-w-[500px]">
              {[
                { val: "3", label: "File formats (CSV, XLSX, XLS)" },
                { val: "5", label: "Step workflow" },
                { val: "2", label: "Outlier methods" },
                { val: "100%", label: "In-memory processing" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.65 + i * 0.08,
                    type: "spring",
                    stiffness: 320,
                    damping: 22,
                  }}
                >
                  <div className="text-xl sm:text-2xl font-black text-white">{stat.val}</div>
                  <div className="text-[10px] font-bold text-white/80 leading-snug">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>



          {/* Right Column: Clean Dual-Device Showcase (Desktop Web App + Companion Phone) */}
          <div
            className="relative flex justify-center items-center h-[560px] perspective-[1200px]"
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
          >
            {/* Massive Left-to-Right Geometric Shape Transition */}
            <HeroGeometricTransition mouseOffset={heroTilt} />

            {/* Clean Ambient Radial Glow */}
            <motion.div
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[440px] h-[440px] rounded-full bg-gradient-to-tr from-cyan-300/30 via-blue-500/20 to-indigo-500/20 blur-3xl pointer-events-none z-6"
            />

            {/* ========================================================
                COMPUTER / DESKTOP WEB APPLICATION TOUCH
                Layered behind mobile phone for complete web + mobile experience
                ======================================================== */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20, scale: 0.92 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -6, 0],
                scale: 1,
              }}
              transition={{
                opacity: { duration: 0.7, delay: 0.25 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              }}
              className="hidden sm:flex flex-col absolute w-[450px] lg:w-[490px] h-[325px] -left-8 lg:-left-16 top-10 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_24px_50px_rgba(15,23,42,0.22)] z-15 overflow-hidden select-none font-['Manrope',sans-serif]"
            >
              {/* Desktop Window Header / Chrome Bar */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/90 border-b border-slate-200/80">
                {/* Traffic Light Window Controls */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block shadow-2xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block shadow-2xs" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block shadow-2xs" />
                </div>
                {/* Address Bar */}
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-md text-[10px] font-semibold text-slate-600 border border-slate-200/60 shadow-2xs max-w-[240px] w-full justify-center">
                  <span className="text-emerald-500 text-[9px]">🔒</span>
                  <span className="truncate">smartdataanalyst.ai/app/workspace</span>
                </div>
                {/* Status Indicator */}
                <div className="flex items-center gap-1 text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  <span>Desktop Web App</span>
                </div>
              </div>

              {/* Desktop Workspace Subheader */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50/70 border-b border-slate-200/50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800">sales_data.xlsx</span>
                  <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    94% Health
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-white text-blue-600 font-extrabold shadow-2xs">Overview</span>
                  <span className="px-2 py-0.5 rounded hover:bg-slate-200/50">Profile</span>
                  <span className="px-2 py-0.5 rounded hover:bg-slate-200/50">Auto-Clean</span>
                  <span className="px-2 py-0.5 rounded hover:bg-slate-200/50">AutoML</span>
                </div>
              </div>

              {/* Desktop Visual Analytics Dashboard (Replaced raw table with rich visual charts) */}
              <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden bg-white">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    <span className="font-black text-slate-800 tracking-tight">Regional Revenue Analytics</span>
                  </div>
                  <span className="text-[8px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Live Visual Mode
                  </span>
                </div>

                {/* Visual Bar Chart: Revenue by Market Segment */}
                <div className="py-1">
                  <div className="flex items-center justify-between text-[8.5px] text-slate-500 mb-1">
                    <span className="font-bold text-slate-700">Gross Sales by Region ($k)</span>
                    <span className="font-mono text-emerald-600 font-extrabold">↑ +18.4% Quality Gain</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 items-end h-20 pt-1.5 px-2 bg-gradient-to-b from-slate-50/80 to-blue-50/20 rounded-xl border border-slate-100">
                    {/* Bar 1 */}
                    <div className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[8px] font-bold text-slate-700">$148k</span>
                      <div className="w-full bg-blue-100 rounded-t-sm h-[72%] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-sm" />
                      </div>
                      <span className="text-[7.5px] font-semibold text-slate-600 truncate w-full text-center">N.Amer</span>
                    </div>
                    {/* Bar 2 */}
                    <div className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[8px] font-bold text-slate-700">$92k</span>
                      <div className="w-full bg-blue-100 rounded-t-sm h-[48%] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-blue-500 rounded-t-sm" />
                      </div>
                      <span className="text-[7.5px] font-semibold text-slate-600 truncate w-full text-center">EMEA</span>
                    </div>
                    {/* Bar 3 */}
                    <div className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[8px] font-bold text-slate-700">$213k</span>
                      <div className="w-full bg-blue-100 rounded-t-sm h-[94%] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-sm" />
                      </div>
                      <span className="text-[7.5px] font-semibold text-slate-600 truncate w-full text-center">APAC</span>
                    </div>
                    {/* Bar 4 */}
                    <div className="flex flex-col items-center gap-1 h-full justify-end">
                      <span className="text-[8px] font-bold text-slate-700">$89k</span>
                      <div className="w-full bg-blue-100 rounded-t-sm h-[44%] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-sm" />
                      </div>
                      <span className="text-[7.5px] font-semibold text-slate-600 truncate w-full text-center">LATAM</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Desktop Summary Bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-bold">
                  <span>24,580 records analyzed • 0 critical errors</span>
                  <span className="text-blue-600 font-extrabold flex items-center gap-1">
                    <span>In-Memory RAM: 4.2 MB</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Hero Phone Mockup: Titanium Bezel with 3D Tilt & Idle Float */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{
                opacity: 1,
                y: [0, -8, 0],
                scale: heroTilt.scale,
                rotateY: heroTilt.ry,
                rotateX: heroTilt.rx,
              }}
              transition={{
                opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 0.15, ease: "linear" },
                rotateX: { duration: 0.15, ease: "linear" },
              }}
              className="relative sm:ml-auto lg:translate-x-10 w-[245px] sm:w-[255px] h-[510px] rounded-[44px] bg-white p-[7px] shadow-[0_30px_70px_rgba(15,23,42,0.35)] z-20 will-change-transform"
              style={{
                boxShadow:
                  "0 0 0 1px #cbd0dc, 0 0 0 3px #f4f6fa, -14px 22px 50px rgba(15, 23, 42, 0.28), 0 30px 70px rgba(30, 41, 59, 0.2)",
              }}
            >
              {/* Inner Screen */}
              <div className="w-full h-full rounded-[38px] overflow-hidden bg-white flex flex-col text-[#111827] select-none font-['Manrope',sans-serif]">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-4 pt-3 text-[11px] font-bold">
                  <span>9:41</span>
                  <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end pr-2">
                    <div className="w-2 h-2 bg-[#222] rounded-full" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>􀙇</span>
                    <span>􀐫</span>
                  </div>
                </div>

                {/* App Nav Header */}
                <div className="flex items-center justify-between px-4 mt-2">
                  <span className="text-lg leading-none cursor-pointer">‹</span>
                  <div className="text-center">
                    <div className="text-[11px] font-bold text-slate-800">sales_data.xlsx</div>
                    <div className="text-[8.5px] text-slate-400 font-semibold">
                      24,580 rows • Ready ⌄
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>

                {/* Hero Dataset Quality Metric (Spring Pop in) */}
                <motion.div
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 320, damping: 22 }}
                  className="flex items-center gap-2.5 px-4 mt-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                    📊
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 tracking-tight">
                      24,580 rows
                    </div>
                    <div className="text-[9.5px] font-bold text-emerald-600">
                      Data Quality 94% • Ready
                    </div>
                  </div>
                </motion.div>

                {/* 4 Action Buttons (Staggered Entrance) */}
                <div className="grid grid-cols-4 gap-1.5 px-3 mt-3">
                  {[
                    { icon: "📁", label: "Upload" },
                    { icon: "📊", label: "Profile" },
                    { icon: "✨", label: "Clean" },
                    { icon: "🔍", label: "Explore" },
                  ].map((act, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12, scale: 0.82 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.45 + i * 0.06,
                        type: "spring",
                        stiffness: 350,
                        damping: 20,
                      }}
                      className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                    >
                      <span className="text-xs">{act.icon}</span>
                      <span className="text-[9px] font-bold text-slate-700 mt-0.5">
                        {act.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-3 px-4 mt-3 border-b border-slate-100 text-[10px] font-bold text-slate-400">
                  <span className="text-[#0f172a] border-b-2 border-[#0f172a] pb-1">
                    Summary
                  </span>
                  <span>Columns</span>
                  <span>Quality</span>
                  <span>Insights</span>
                </div>

                {/* Chart Card with animated SVG stroke draw */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.4 }}
                  className="mx-3 mt-2 p-2.5 rounded-2xl bg-white border border-slate-100 shadow-sm"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <b className="text-slate-900">Dataset health 94% ⓘ</b>
                    <span className="text-emerald-600 font-bold">3 columns need review</span>
                  </div>
                  <div className="h-8 mt-1">
                    <svg
                      viewBox="0 0 200 48"
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d="M0 38 L25 32 L50 38 L75 24 L100 30 L125 18 L150 24 L175 12 L200 20"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.75, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </svg>
                  </div>
                  <div className="flex justify-between mt-1 text-[8.5px] font-bold text-slate-400">
                    <span>All</span>
                    <span className="bg-slate-900 text-white px-1.5 py-0.2 rounded-full">
                      Numeric
                    </span>
                    <span>Categorical</span>
                    <span>Date</span>
                    <span>Missing</span>
                  </div>
                </motion.div>

                {/* Column Rows (Slide in from bottom) */}
                <div className="px-3 mt-2 space-y-1">
                  <motion.div
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85, duration: 0.35 }}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 text-[10px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#3b82f6] text-white flex items-center justify-center font-bold text-[9px]">
                        #
                      </div>
                      <div>
                        <b className="text-slate-800">Sales</b>
                        <div className="text-[8px] text-slate-400">Numeric, 0.4% missing</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <b>24,482 valid</b>
                      <div className="text-[8px] text-emerald-600 font-bold">99.6%</div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.95, duration: 0.35 }}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 text-[10px]"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold text-[9px]">
                        🏷
                      </div>
                      <div>
                        <b className="text-slate-800">Region</b>
                        <div className="text-[8px] text-slate-400">Categorical, 12 unique</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <b>24,580 valid</b>
                      <div className="text-[8px] text-emerald-600 font-bold">100%</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Luminous Ground Pedestal & Floating Status Chips Underneath Devices */}
            <div className="absolute -bottom-10 inset-x-0 flex flex-col items-center pointer-events-none z-10">
              {/* Luminous Neon Ground Glow */}
              <div className="w-[85%] h-12 bg-gradient-to-r from-blue-500/25 via-cyan-400/35 to-purple-500/25 blur-2xl rounded-full" />
              
              {/* Perspective Ground Pedestal Plate */}
              <div className="relative w-[92%] h-7 rounded-[26px] bg-gradient-to-b from-white/70 via-slate-100/30 to-transparent border border-white/80 shadow-[0_16px_36px_rgba(37,99,235,0.12)] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(37,99,235,0.35) 1px, transparent 1px), linear-gradient(0deg, rgba(37,99,235,0.35) 1px, transparent 1px)",
                    backgroundSize: "22px 11px",
                  }}
                />
                <div className="w-56 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8]" />
              </div>

              {/* Floating Ground Feature Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pointer-events-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs text-[10px] font-black text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>⚡ Zero-Install Browser RAM</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md border border-blue-500 shadow-xs text-[10px] font-black text-white">
                  <span>📊 Visual Analytics Active</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs text-[10px] font-black text-slate-800">
                  <span className="text-purple-600 font-extrabold">🛡️ 100% Privacy Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          3. PINNED 3-SCENE SHOWCASE (MOUNTED IN THE MIDDLE / "BICHMEIN")
          - Scene 1: "Your Portfolio. All of It." (with staged spring popups)
          - Scene 2: "Trade Anything. From Anywhere."
          - Scene 3: "Explore the Market"
          ============================================================ */}
      <div ref={storyRef} id="showcase-section">
        <ShowcaseScroll />
      </div>

      {/* ============================================================
          4. PRIVACY SECTION (Privacy you can verify)
          ============================================================ */}
      <section className="w-full py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-[1080px] mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Privacy you can verify
          </h2>
          <p className="mt-3 text-slate-500 font-medium text-base max-w-[55ch] mx-auto">
            Your dataset is processed in memory and is not retained after the analysis session.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-[920px] mx-auto text-left">
            {/* Card 1: Privacy-first analysis */}
            <div className="p-8 rounded-3xl bg-[#f8fafc] border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <b className="text-xl font-black text-slate-900">Privacy-first analysis</b>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Files are analyzed in memory during your session. Nothing is kept afterwards.
                </p>

                <div className="flex items-center gap-2.5 mt-6 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] shadow-2xs">
                    In-memory processing
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] shadow-2xs">
                    Z-score & Tukey IQR
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] shadow-2xs">
                    5-fold validation
                  </span>
                </div>
              </div>

              <button
                onClick={onLoadDemo}
                className="mt-8 bg-[#2f35d9] hover:bg-[#252ac0] text-white text-xs font-extrabold px-5 py-2.5 rounded-full w-fit flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Read how it works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Technical transparency */}
            <div className="p-8 rounded-3xl bg-[#f8fafc] border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <b className="text-xl font-black text-slate-900">Technical transparency</b>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Every method is visible: formulas, parameters, validation strategy and processing details.
                </p>
              </div>

              <button
                onClick={scrollToStory}
                className="mt-8 bg-[#2f35d9] hover:bg-[#252ac0] text-white text-xs font-extrabold px-5 py-2.5 rounded-full w-fit flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Technical Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. USE-CASES SECTION: PINNED SCROLL FIRST-IN FIRST-OUT (FIFO) STACK
          ============================================================ */}
      <section
        ref={deckSectionRef}
        id="reviews-section"
        className="relative w-full bg-[#f8fafc] border-t border-slate-100"
        style={{ height: "240vh" }} // Sticky scroll duration for FIFO deck
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6">
          <div className="max-w-[1080px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            {/* Left: Heading & Subtitle */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-black text-[#0f172a] leading-tight tracking-tight">
                Built for everyone
                <br />
                who <span className="text-[#3A35E0]">works with data.</span>
              </h2>
              <p className="mt-3 text-slate-500 font-medium text-base max-w-[34ch] leading-relaxed">
                Different roles, one workspace.
              </p>

              {/* Interactive FIFO Deck Dots */}
              <div className="flex items-center gap-2 mt-8">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleJumpToReview(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currDeckIdx === i
                        ? "w-8 bg-[#3A35E0]"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to role ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Scroll-Driven FIFO 3D Peeling Stack */}
            <div className="relative h-[340px] flex items-center justify-center">
              {reviews.map((rev, i) => {
                let transformStyle = "";
                let opacity = 1;
                let zIndex = 10;
                let pointerEvents: "auto" | "none" = "auto";

                if (i < currDeckIdx) {
                  // Card has already peeled away to the left (First In, First Out)
                  transformStyle = "translateX(-150%) rotate(-12deg) scale(0.85)";
                  opacity = 0;
                  pointerEvents = "none";
                  zIndex = 1;
                } else if (i === currDeckIdx) {
                  // Current front card: peeling away smoothly as user scrolls
                  const tx = -deckFrac * 140;
                  const rot = -deckFrac * 9;
                  const scale = 1 - deckFrac * 0.05;
                  opacity = Math.max(0, 1 - deckFrac * 0.85);
                  transformStyle = `translateX(${tx}%) rotate(${rot}deg) scale(${scale})`;
                  pointerEvents = deckFrac > 0.5 ? "none" : "auto";
                  zIndex = 40;
                } else if (i === currDeckIdx + 1) {
                  // Next card advancing from behind to the front
                  const d = 1 - deckFrac;
                  const tx = d * 26;
                  const ty = d * 6;
                  const scale = 1 - d * 0.05;
                  transformStyle = `translateX(${tx}px) translateY(${ty}px) scale(${scale})`;
                  opacity = 1;
                  pointerEvents = deckFrac > 0.5 ? "auto" : "none";
                  zIndex = 30;
                } else if (i === currDeckIdx + 2) {
                  // Third card in the stack
                  transformStyle = `translateX(${52}px) translateY(${12}px) scale(0.92)`;
                  opacity = 0.9;
                  pointerEvents = "none";
                  zIndex = 20;
                } else {
                  // Remaining cards hidden in the deck
                  transformStyle = `translateX(${78}px) translateY(${18}px) scale(0.88)`;
                  opacity = 0;
                  pointerEvents = "none";
                  zIndex = 10;
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleJumpToReview((currDeckIdx + 1) % reviews.length)}
                    className="absolute w-[280px] sm:w-[320px] h-[310px] p-7 rounded-3xl text-white shadow-2xl cursor-pointer select-none transition-transform duration-100 ease-out flex flex-col justify-between will-change-transform"
                    style={{
                      background: rev.bg,
                      transform: transformStyle,
                      opacity,
                      zIndex,
                      pointerEvents,
                      boxShadow: "0 24px 50px -12px rgba(15, 23, 42, 0.35)",
                    }}
                  >
                    <div>
                      <div className="text-3xl opacity-40 font-serif leading-none mb-3">
                        “
                      </div>
                      <p className="text-lg font-bold leading-relaxed">{rev.text}</p>
                    </div>
                    <div className="text-sm font-extrabold opacity-95 tracking-wide">
                      {rev.handle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. WORKSPACE SECTION: "Everything in one workspace."
          ============================================================ */}
      <section className="w-full py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-[1080px] mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
            Everything in one workspace.
          </h2>
          <p className="mt-3 text-slate-500 font-medium text-base max-w-[42ch] mx-auto leading-relaxed">
            From first upload to final report.
          </p>

          {/* 4 Workspace Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 text-left">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#16135f] to-[#4b2a9a] text-white shadow-lg flex flex-col justify-between min-h-[220px]">
              <div>
                <b className="text-lg font-black">Demo Dataset</b>
                <p className="text-xs text-white/80 mt-1 font-medium">
                  Explore the platform instantly with sample data.
                </p>
              </div>
              <button
                onClick={onLoadDemo}
                className="bg-white text-slate-900 text-xs font-extrabold py-2 px-4 rounded-full mt-4 w-fit hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Try the demo →
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#f4f4f8] text-slate-900 shadow-sm flex flex-col justify-between min-h-[220px]">
              <div>
                <b className="text-lg font-black">Model Comparison</b>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  See which model performs best and why.
                </p>
              </div>
              <button
                onClick={onLoadDemo}
                className="bg-[#2f35d9] text-white text-xs font-extrabold py-2 px-4 rounded-full mt-4 w-fit hover:opacity-90 transition-opacity cursor-pointer"
              >
                View comparison →
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#7c6cff] text-white shadow-lg flex flex-col justify-between min-h-[220px]">
              <div>
                <b className="text-3xl font-black">5</b>
                <p className="text-xs text-white/80 mt-1 font-medium">Steps from upload to insight</p>
              </div>
              <button
                onClick={scrollToStory}
                className="bg-white text-slate-900 text-xs font-extrabold py-2 px-4 rounded-full mt-4 w-fit hover:bg-slate-100 transition-colors cursor-pointer"
              >
                See the workflow →
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2a2fd6] to-[#16135f] text-white shadow-lg flex flex-col justify-between min-h-[220px]">
              <div>
                <b className="text-lg font-black">Export Report</b>
                <p className="text-xs text-white/80 mt-1 font-medium">
                  Download insights and results for your team.
                </p>
              </div>
              <button
                onClick={onLoadDemo}
                className="bg-white text-slate-900 text-xs font-extrabold py-2 px-4 rounded-full mt-4 w-fit hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Learn more →
              </button>
            </div>
          </div>

          {/* Help & System Status Links */}
          <div className="mt-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
              HELP & RESOURCES
            </span>
            <div className="flex justify-center gap-4">
              <span
                onClick={scrollToStory}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Help Center
              </span>
              <span
                onClick={scrollToStory}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                System Status
              </span>
            </div>
          </div>

          {/* Pipeline Banner */}
          <div className="mt-12 p-8 rounded-3xl bg-[#0f172a] text-white text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded">
                  Data Pipeline
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Raw dataset (CSV / Excel) → Smart Data Analyst → Insights & models
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mt-2">
                From raw file to model-ready data
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-[54ch] font-medium">
                Upload once. Get profiling, cleaning, exploration and model results from the same workspace.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[11px] font-bold text-slate-300">
                <span className="px-2.5 py-1 bg-slate-800 rounded-md">Profiling</span>
                <span>•</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded-md">Cleaning</span>
                <span>•</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded-md">EDA</span>
                <span>•</span>
                <span className="px-2.5 py-1 bg-slate-800 rounded-md">AutoML</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-medium">
                Upload • Understand • Clean • Explore • Predict
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-slate-900 font-black text-xs px-6 py-3 rounded-full hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              Start with Your Dataset
            </button>
          </div>

          {/* Guides Banner */}
          <div className="mt-6 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded">
                Guides & Methods
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-2">
                Learn the methods
              </h3>
              <p className="text-xs text-white/80 mt-1 max-w-[50ch] font-medium">
                Short guides on data quality, outliers, missing values and model evaluation.
              </p>
            </div>
            <button
              onClick={scrollToStory}
              className="bg-white text-slate-900 font-black text-xs px-6 py-3 rounded-full hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              Read the guides
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. FAQ SECTION
          ============================================================ */}
      <section className="w-full py-20 px-6 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-[780px] mx-auto">
          <h2 className="text-3xl font-black text-center text-[#0f172a] mb-10 tracking-tight">
            FAQ
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Is my data safe?",
                a: "Your dataset is processed in memory during analysis and is not retained after the session.",
              },
              {
                q: "Which file formats are supported?",
                a: "CSV, XLSX and XLS files.",
              },
              {
                q: "How is the data quality score calculated?",
                a: "It combines the share of missing values and duplicate records into a single score. Full formula in Technical Details.",
              },
              {
                q: "How are outliers detected?",
                a: "With Z-score or Tukey IQR methods. You review them before anything is changed.",
              },
              {
                q: "Which models are compared?",
                a: "Classification and regression models such as Random Forest, XGBoost, Decision Tree and Logistic Regression, ranked by validation performance.",
              },
              {
                q: "Do I need to know statistics?",
                a: "No. Each step uses plain language, and technical details are available when you want them.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group p-4 rounded-2xl bg-white border border-slate-200/80 cursor-pointer shadow-2xs"
              >
                <summary className="font-extrabold text-sm text-slate-800 list-none flex justify-between items-center">
                  <span>{faq.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    ⌄
                  </span>
                </summary>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. CALL TO ACTION & FOOTER
          ============================================================ */}
      <div className="w-full bg-[#2f35d9] py-20 px-6 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
          Analyze Your First Dataset
        </h2>
        <p className="mt-3 text-sm text-white/80 max-w-[36ch] mx-auto font-medium">
          Private, automated and built for real analysis.
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-6 bg-white text-slate-900 font-black text-xs px-8 py-3.5 rounded-full shadow-xl hover:bg-slate-100 hover:scale-105 transition-all cursor-pointer"
        >
          Start with Your Dataset
        </button>
      </div>

      <footer className="w-full bg-white py-12 px-6 border-t border-slate-100 text-xs text-slate-500">
        <div className="max-w-[1080px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <span className="border-[1.5px] border-[#3a5bff] px-2.5 py-1 rounded text-[#2f35d9] font-black text-xs inline-block">
              Smart Data Analyst
            </span>
            <p className="mt-3 text-[11px] text-slate-400 font-medium">
              Automated data profiling, cleaning, EDA and model benchmarking.
            </p>
            <p className="mt-4 text-[11px] text-slate-400">
              © 2026 Smart Data Analyst. All rights reserved.
            </p>
          </div>
          <div>
            <b className="text-slate-900 uppercase font-black text-[10px] tracking-wider block mb-2">
              Product
            </b>
            <div className="space-y-1.5 cursor-pointer font-medium">
              <div>Overview</div>
              <div>Understand Your Data</div>
              <div>Clean Your Data</div>
              <div>Explore Your Data</div>
              <div>Build & Compare Models</div>
            </div>
          </div>
          <div>
            <b className="text-slate-900 uppercase font-black text-[10px] tracking-wider block mb-2">
              Support
            </b>
            <div className="space-y-1.5 cursor-pointer font-medium">
              <div>Help Center</div>
              <div>System Status</div>
              <div>Technical Details</div>
            </div>
          </div>
          <div>
            <b className="text-slate-900 uppercase font-black text-[10px] tracking-wider block mb-2">
              Legal
            </b>
            <div className="space-y-1.5 cursor-pointer font-medium">
              <div>Privacy</div>
              <div>Terms</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
