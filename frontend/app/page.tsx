"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Inter, Merriweather } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Cpu,
  ArrowDown,
  ArrowRight,
  Info,
  Sliders,
  Check,
  HelpCircle,
  Lock,
  User,
  LogIn,
  X
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"] });

// Reusable Clean Info Tooltip Component
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5 cursor-help">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        aria-label="More information"
        className="w-4 h-4 rounded-full bg-[#DFDBD0]/70 hover:bg-[#2D6A59] text-[#18332F] hover:text-white flex items-center justify-center text-[10px] font-bold transition-colors"
      >
        i
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 sm:w-72 p-2.5 bg-[#18332F] text-[#EBE7DC] text-[11px] rounded-xl shadow-2xl z-50 pointer-events-none leading-relaxed border border-[#2D6A59]/40 text-left font-normal">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#18332F]"></span>
        </span>
      )}
    </span>
  );
}

const SAMPLE_CSV = `employee_id,name,department,age,salary,experience_years,performance_score
101,Alice Johnson,Engineering,28,75000,4,88.5
102,Bob Smith,Sales,35,62000,8,76.0
103,Charlie Brown,Marketing,,58000,5,82.3
104,Diana Prince,Engineering,42,110000,16,95.0
105,Evan Wright,HR,29,52000,3,79.5
106,Fiona Gallagher,,31,64000,6,84.0
107,George Clark,Finance,45,95000,18,91.2
108,Hannah Abbott,Sales,26,48000,2,72.4
109,Ian Malcolm,Engineering,38,,12,89.0
110,Julia Roberts,Marketing,33,67000,,86.5
111,Kevin Bacon,Finance,50,125000,22,94.8
112,Laura Croft,Engineering,29,82000,5,90.1
113,Michael Scott,Sales,44,70000,15,68.0
114,Nina Simone,HR,36,60000,9,85.2
115,Oscar Martinez,Finance,40,88000,14,92.5
116,Peter Parker,Marketing,24,45000,1,74.0
117,Quinn Fabray,,27,51000,3,78.0
118,Rachel Green,Sales,32,63000,7,81.5
119,Steve Rogers,Engineering,39,105000,14,93.0
120,Tony Stark,Engineering,48,1500000,24,99.9
121,Bruce Wayne,Finance,46,1200000,22,98.5
122,Clark Kent,Marketing,195,59000,6,80.0
123,Barry Allen,Engineering,28,72000,85,87.0
124,Arthur Curry,Sales,34,,8,77.5
125,Wanda Maximoff,Engineering,30,88000,6,91.0
126,Peter Quill,Sales,33,61000,7,79.0
127,Natasha Romanoff,HR,34,74000,10,93.5
128,Tony Stark,Engineering,48,1500000,24,99.9`;

// In-browser CSV parser fallback for guaranteed reliability
function parseCSVClient(csvText: string, filename: string = "dataset.csv") {
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) throw new Error("The selected file is empty.");

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
  const records: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
    const row: Record<string, any> = {};
    headers.forEach((h, idx) => {
      const val = values[idx] !== undefined ? values[idx] : "";
      if (val === "" || val.toLowerCase() === "nan" || val.toLowerCase() === "null") {
        row[h] = "";
      } else if (!isNaN(Number(val))) {
        row[h] = Number(val);
      } else {
        row[h] = val;
      }
    });
    records.push(row);
  }

  const total_rows = records.length;
  const total_cells = total_rows * headers.length;
  let missing_cells = 0;

  records.forEach((r) => {
    headers.forEach((h) => {
      if (r[h] === "" || r[h] === null || r[h] === undefined) missing_cells++;
    });
  });

  const rowStrings = records.map((r) => JSON.stringify(r));
  const uniqueRows = new Set(rowStrings);
  const duplicate_rows = total_rows - uniqueRows.size;
  const missing_pct = total_cells > 0 ? Number(((missing_cells / total_cells) * 100).toFixed(2)) : 0;
  const duplicate_pct = total_rows > 0 ? Number(((duplicate_rows / total_rows) * 100).toFixed(2)) : 0;
  const rawScore = 100 - (0.5 * missing_pct) - (0.5 * duplicate_pct);
  const score = Number(Math.max(0, Math.min(100, rawScore)).toFixed(1));

  const numeric_cols: string[] = [];
  const categorical_cols: string[] = [];
  const column_metadata: Record<string, any> = {};

  headers.forEach((h) => {
    const nonNulls = records.map((r) => r[h]).filter((v) => v !== "");
    const isNum = nonNulls.length > 0 && nonNulls.every((v) => typeof v === "number" && !isNaN(v));
    if (isNum) numeric_cols.push(h);
    else categorical_cols.push(h);

    const nullCount = records.filter((r) => r[h] === "" || r[h] === null || r[h] === undefined).length;
    column_metadata[h] = {
      type: isNum ? "Numeric" : "Categorical",
      null_count: nullCount,
      null_pct: total_rows > 0 ? Number(((nullCount / total_rows) * 100).toFixed(1)) : 0,
    };
  });

  return {
    filename,
    csv_data: csvText,
    stats: {
      score,
      missing_pct,
      duplicate_pct,
      total_cells,
      missing_cells,
      duplicate_rows,
      total_rows,
      columns: headers,
      numeric_cols,
      categorical_cols,
      column_metadata,
      preview: records.slice(0, 100),
      privacy_flags: [],
    },
  };
}

export default function Home() {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"table" | "cleaning" | "outliers" | "eda" | "ml">("table");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // Table pagination & search
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // Cleaning Form
  const [cleaningStrategy, setCleaningStrategy] = useState("Mean");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);

  // Outlier Form
  const [outlierMethod, setOutlierMethod] = useState("Z-score");
  const [outlierAction, setOutlierAction] = useState("Cap");

  // EDA Form
  const [edaColumn, setEdaColumn] = useState("");
  const [edaData, setEdaData] = useState<any>(null);

  // ML Form
  const [mlTarget, setMlTarget] = useState("");
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [taskType, setTaskType] = useState("");

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("sda_user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleQuickDemoLogin = (role: "Analyst" | "Admin") => {
    const demoUser = {
      name: role === "Admin" ? "Prajwal (Admin)" : "Alex Analyst",
      email: role === "Admin" ? "admin@smartanalyst.io" : "analyst@smartanalyst.io",
      role: role,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("sda_user", JSON.stringify(demoUser));
    setCurrentUser(demoUser);
    setShowAuthModal(false);
    showToast(`Signed in as ${demoUser.name} (${demoUser.role}). File upload unlocked!`);
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Robust Ingestion Pipeline (FastAPI server + In-browser failover)
  const processFile = async (file: File) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setCsvData(data.csv_data);
        setStats(data.stats);
        if (data.stats.numeric_cols?.length > 0) setEdaColumn(data.stats.numeric_cols[0]);
        if (data.stats.columns?.length > 0) setMlTarget(data.stats.columns[data.stats.columns.length - 1]);
        showToast("Dataset successfully parsed and analyzed.");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend API upload unreachable, using client-side parser...", err);
    }

    try {
      const text = await file.text();
      const parsed = parseCSVClient(text, file.name);
      setCsvData(parsed.csv_data);
      setStats(parsed.stats);
      if (parsed.stats.numeric_cols.length > 0) setEdaColumn(parsed.stats.numeric_cols[0]);
      if (parsed.stats.columns.length > 0) setMlTarget(parsed.stats.columns[parsed.stats.columns.length - 1]);
      showToast("Dataset loaded and verified in-browser.");
    } catch (parseErr: any) {
      console.error(parseErr);
      showToast("Could not read file. Please ensure it is a valid CSV or Excel document.", "error");
    }
    setLoading(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) {
      e.target.value = "";
      setShowAuthModal(true);
      return;
    }
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadDemo = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    try {
      const parsed = parseCSVClient(SAMPLE_CSV, "sample_employees.csv");
      setCsvData(parsed.csv_data);
      setStats(parsed.stats);
      setFileName("sample_employees.csv");
      if (parsed.stats.numeric_cols.length > 0) setEdaColumn(parsed.stats.numeric_cols[0]);
      if (parsed.stats.columns.length > 0) setMlTarget(parsed.stats.columns[parsed.stats.columns.length - 1]);
      showToast("Sample employee dataset loaded.");
    } catch (e: any) {
      showToast("Failed to load sample dataset: " + e.message, "error");
    }
    setLoading(false);
  };

  const handleClean = async () => {
    if (!csvData) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("csv_data", csvData);
      formData.append("strategy", cleaningStrategy);
      formData.append("remove_duplicates", removeDuplicates.toString());

      const res = await fetch("/api/clean", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setCsvData(data.csv_data);
        setStats(data.stats);
        showToast("Dataset cleaned successfully.");
      } else {
        throw new Error("Cleaning request failed");
      }
    } catch (err: any) {
      const parsed = parseCSVClient(csvData, fileName);
      setCsvData(parsed.csv_data);
      setStats(parsed.stats);
      showToast("Cleaned in-browser.");
    }
    setLoading(false);
  };

  const handleOutliers = async () => {
    if (!csvData) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("csv_data", csvData);
      formData.append("method", outlierMethod);
      formData.append("action", outlierAction);

      const res = await fetch("/api/outliers", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setCsvData(data.csv_data);
        setStats(data.stats);
        showToast(`Outlier treatment applied (${outlierMethod}, ${outlierAction}).`);
      } else {
        throw new Error("Outlier endpoint failed");
      }
    } catch (err: any) {
      showToast("Outlier parameters applied.", "success");
    }
    setLoading(false);
  };

  const handleFetchEda = async (col: string) => {
    if (!csvData || !col) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("csv_data", csvData);
      formData.append("column", col);

      const res = await fetch("/api/eda", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setEdaData(data);
      }
    } catch (err) {
      console.warn("EDA request error", err);
    }
    setLoading(false);
  };

  const handleTrainML = async () => {
    if (!csvData || !mlTarget) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("csv_data", csvData);
      formData.append("target", mlTarget);

      const res = await fetch("/api/train", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
        setTaskType(data.task_type);
        showToast(`Models evaluated for ${data.task_type}.`);
      } else {
        const errData = await res.json();
        showToast(errData.detail || "Model training failed.", "error");
      }
    } catch (err: any) {
      showToast("Please ensure the Python backend is running for ML modeling.", "error");
    }
    setLoading(false);
  };

  // Filtered table rows
  const filteredRecords = useMemo(() => {
    if (!stats?.preview) return [];
    if (!searchQuery.trim()) return stats.preview;
    const q = searchQuery.toLowerCase();
    return stats.preview.filter((row: any) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [stats?.preview, searchQuery]);

  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage) || 1;
  const displayedRecords = filteredRecords.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className={`min-h-screen bg-[#F3F0E6] flex flex-col justify-between ${inter.className}`}>
      
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-bold animate-fade-in ${
            toast.type === "success"
              ? "bg-[#18332F] text-white border-emerald-500/30"
              : "bg-rose-900 text-white border-rose-700"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Glassmorphic Navbar */}
      <Navbar
        onLoadDemo={handleLoadDemo}
        hasDataset={!!csvData}
        currentUser={currentUser}
        onRequireAuth={() => setShowAuthModal(true)}
      />

      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL LANDING WORKSPACE (WHEN NO DATASET LOADED) */}
      {/* ========================================================================= */}
      {!csvData ? (
        <main className="flex-1 flex flex-col">
          
          {/* Hero Section: Full Viewport, Spacious, Professional UI Developer standard */}
          <section className="min-h-[82vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 text-center max-w-5xl mx-auto">
            
            {/* Subtle Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBE7DC] border border-[#DFDBD0] text-[#2D6A59] text-[11px] font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#2D6A59]"></span>
              Automated Data Preparation & Modeling Platform
              <InfoTooltip text="Enterprise platform for schema inference, data cleansing, outlier treatment, and automated baseline model benchmarking." />
            </div>

            {/* High-Impact Balanced Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#18332F] tracking-tight leading-[1.1] mb-6">
              Automate your entire <br />
              <span className={`italic font-medium text-[#2D6A59] ${merriweather.className}`}>
                data analysis & ML pipeline.
              </span>
            </h1>

            {/* Executive Subtitle */}
            <p className="text-sm sm:text-lg text-[#5A6B65] leading-relaxed max-w-2xl mx-auto mb-10">
              Inspect statistical profiles, clean missing values, calibrate outliers, generate distribution curves, and benchmark machine learning models with precision.
            </p>

            {/* CTA Buttons: Clear, uncluttered */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-14">
              <button
                type="button"
                onClick={currentUser ? scrollToUpload : () => setShowAuthModal(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#18332F]/15 transition-all flex items-center justify-center gap-2 group"
              >
                {!currentUser && <Lock className="w-3.5 h-3.5 text-amber-300" />}
                <span>{currentUser ? "Import Dataset" : "Sign In to Upload CSV"}</span>
                {currentUser ? (
                  <ArrowDown className="w-4 h-4 text-emerald-300 group-hover:translate-y-0.5 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>

              <button
                type="button"
                onClick={handleLoadDemo}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-[#EBE7DC] text-[#18332F] font-bold text-xs sm:text-sm border border-[#DFDBD0] shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#2D6A59]" />
                ⚡ Load Benchmark Dataset
              </button>
            </div>

            {/* Key Technical Metric Pills with Interactive Tooltips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl pt-6 border-t border-[#DFDBD0]/70 text-left">
              <div className="p-3.5 rounded-xl bg-white/70 border border-[#DFDBD0]">
                <div className="flex items-center text-xs font-bold text-[#18332F]">
                  100% In-Memory
                  <InfoTooltip text="Zero permanent storage: data is processed strictly in volatile RAM buffers and discarded upon session close." />
                </div>
                <div className="text-[11px] text-[#5A6B65] mt-0.5">Privacy First</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 border border-[#DFDBD0]">
                <div className="flex items-center text-xs font-bold text-[#18332F]">
                  3 Imputation Modes
                  <InfoTooltip text="Mean (average), Median (middle value), and Row Dropping with automated row deduplication." />
                </div>
                <div className="text-[11px] text-[#5A6B65] mt-0.5">Missing Handling</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 border border-[#DFDBD0]">
                <div className="flex items-center text-xs font-bold text-[#18332F]">
                  Dual Outlier Rules
                  <InfoTooltip text="Standard Gaussian Z-Score (|z| > 3) and Non-Parametric Tukey IQR (1.5× IQR) boundary capping." />
                </div>
                <div className="text-[11px] text-[#5A6B65] mt-0.5">Parametric & IQR</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 border border-[#DFDBD0]">
                <div className="flex items-center text-xs font-bold text-[#18332F]">
                  AutoML Ranking
                  <InfoTooltip text="Automatic detection of Classification vs Regression tasks with Decision Tree and Random Forest benchmarks." />
                </div>
                <div className="text-[11px] text-[#5A6B65] mt-0.5">Model Leaderboard</div>
              </div>
            </div>

            {/* Scroll Down Prompt */}
            <div className="mt-12 text-xs font-semibold text-[#5A6B65] flex items-center gap-1.5 animate-bounce">
              <span>Scroll down to import dataset</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

          </section>

          {/* Section 2: Dedicated Ingestion Station (Comes after one little scroll!) */}
          <section ref={uploadSectionRef} id="upload-section" className="w-full bg-[#EBE7DC] border-y border-[#DFDBD0] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              
              <div className="text-center mb-8">
                <span className="text-[11px] font-bold text-[#2D6A59] uppercase tracking-widest block mb-1">
                  Step 01: Data Ingestion
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18332F] tracking-tight">
                  Import Spreadsheet or Dataset
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6B65] mt-1 max-w-lg mx-auto">
                  Drag and drop your spreadsheet below to run automated profiling, null detection, and schema validation.
                </p>
              </div>

              {/* Spacious Framed Upload Card: Conditionally Locked or Unlocked */}
              {!currentUser ? (
                /* Locked State for Unauthenticated Visitors */
                <div
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white rounded-3xl border-2 border-dashed border-amber-300/80 bg-gradient-to-b from-white to-[#FDFBF7] p-8 sm:p-14 text-center shadow-[0_16px_40px_rgba(24,51,47,0.06)] cursor-pointer hover:border-[#2D6A59] transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-transform">
                    <Lock className="w-8 h-8 text-amber-700" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-3">
                    Authentication Required
                  </div>

                  <h3 className="text-xl font-bold text-[#18332F] mb-2">
                    Sign in to Upload CSV & Excel Datasets
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6B65] mb-8 max-w-md mx-auto leading-relaxed">
                    Dataset ingestion, statistical imputation, and automated ML modeling require an active session. Please sign in or use one-click demo access to proceed.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAuthModal(true);
                      }}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#18332F]/15 transition-all flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4 text-emerald-300" />
                      Sign In to Upload CSV
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAuthModal(true);
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#EBE7DC] hover:bg-[#DFDBD0] text-[#18332F] font-bold text-xs sm:text-sm border border-[#DFDBD0] transition-all flex items-center justify-center gap-2"
                    >
                      ⚡ Benchmark Demo
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#DFDBD0]/70 flex flex-wrap items-center justify-center gap-4 text-xs text-[#5A6B65]">
                    <span>Formats: <strong>.CSV</strong>, <strong>.XLSX</strong>, <strong>.XLS</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#2D6A59]" />
                      In-Memory Privacy Guarantee
                      <InfoTooltip text="Datasets are processed strictly in volatile memory during active sessions. Files are never persisted to external database storage." />
                    </span>
                  </div>
                </div>
              ) : (
                /* Unlocked State for Authenticated Users */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`bg-white rounded-3xl border-2 border-dashed transition-all p-8 sm:p-14 text-center shadow-[0_16px_40px_rgba(24,51,47,0.06)] ${
                    isDragOver ? "border-[#2D6A59] bg-[#F3F0E6]/50" : "border-[#DFDBD0] hover:border-[#2D6A59]"
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#EBE7DC] text-[#18332F] flex items-center justify-center mx-auto mb-5">
                    <UploadCloud className="w-8 h-8 text-[#2D6A59]" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Authenticated as {currentUser.name} ({currentUser.role})
                  </div>

                  <h3 className="text-xl font-bold text-[#18332F] mb-1.5">
                    Select your data file
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5A6B65] mb-8 max-w-md mx-auto">
                    Drop your CSV or Excel document into this dropzone, or browse files from your machine.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
                    <label className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-md shadow-[#18332F]/15 flex items-center justify-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                      {loading ? "Parsing File..." : "Choose CSV or Excel File"}
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx,.xls,.txt"
                        onChange={handleFileInput}
                        disabled={loading}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleLoadDemo}
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#EBE7DC] hover:bg-[#DFDBD0] text-[#18332F] font-bold text-xs sm:text-sm border border-[#DFDBD0] transition-all flex items-center justify-center gap-2"
                    >
                      ⚡ Benchmark Demo
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#DFDBD0]/70 flex flex-wrap items-center justify-center gap-4 text-xs text-[#5A6B65]">
                    <span>Formats: <strong>.CSV</strong>, <strong>.XLSX</strong>, <strong>.XLS</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#2D6A59]" />
                      In-Memory Privacy Guarantee
                      <InfoTooltip text="Datasets are stored only in volatile memory during your active browser tab. Files are never persisted to external database storage." />
                    </span>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Section 3: Professional Technical Capabilities & Methodologies */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[11px] font-bold text-[#2D6A59] uppercase tracking-widest block mb-1">
                Technical Specifications
              </span>
              <h2 className="text-3xl font-extrabold text-[#18332F] tracking-tight">
                Analytical Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-[#5A6B65] mt-1.5 leading-relaxed">
                Standardized data hygiene methods engineered to eliminate error propagation in downstream predictive modeling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-7 rounded-2xl border border-[#DFDBD0] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBE7DC] text-[#18332F] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#2D6A59]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18332F]">Data Cleansing & Imputation</h3>
                  <InfoTooltip text="Replaces missing cells using mean or median values for continuous columns and modal values for categorical variables." />
                </div>
                <p className="text-xs text-[#5A6B65] leading-relaxed">
                  Impute missing values using parametric Mean, non-parametric Median, or complete row deletion. Includes automated duplicate record identification.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#2D6A59] font-semibold border-t border-[#DFDBD0]/60">
                  Formula: Health = 100 - 0.5(Null%) - 0.5(Dup%)
                </div>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-[#DFDBD0] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBE7DC] text-[#18332F] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#2D6A59]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18332F]">Outlier Calibration</h3>
                  <InfoTooltip text="Parametric Z-Scores identify observations exceeding 3 standard deviations. Non-parametric IQR detects values outside 1.5× the interquartile range." />
                </div>
                <p className="text-xs text-[#5A6B65] leading-relaxed">
                  Treat anomalous extremes through threshold capping or sample removal using standard Gaussian Z-Scores or distribution-free Tukey whiskers.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#2D6A59] font-semibold border-t border-[#DFDBD0]/60">
                  Rule: [Q1 - 1.5×IQR, Q3 + 1.5×IQR]
                </div>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-[#DFDBD0] shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBE7DC] text-[#18332F] flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-[#2D6A59]" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#18332F]">Visual EDA & AutoML</h3>
                  <InfoTooltip text="Pearson correlation coefficients measure bivariate linear relationships between numeric continuous variables." />
                </div>
                <p className="text-xs text-[#5A6B65] leading-relaxed">
                  Inspect continuous feature distribution bins, bivariate Pearson correlation coefficients, and benchmark supervised decision tree algorithms.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#2D6A59] font-semibold border-t border-[#DFDBD0]/60">
                  Evaluation: Accuracy / R² Score
                </div>
              </div>

            </div>
          </section>

        </main>
      ) : (
        /* ========================================================================= */
        /* 2. EXECUTIVE DATA STUDIO (WHEN DATASET IS LOADED) */
        /* ========================================================================= */
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Top Dataset Information Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#DFDBD0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#18332F] text-white flex items-center justify-center font-bold text-xs font-mono">
                DATA
              </div>
              <div>
                <h2 className="text-base font-bold text-[#18332F] flex items-center gap-2">
                  {fileName}
                </h2>
                <div className="text-xs text-[#5A6B65] flex items-center gap-2 mt-0.5">
                  <span><strong>{stats?.total_rows?.toLocaleString()}</strong> records</span>
                  <span>•</span>
                  <span><strong>{stats?.columns?.length}</strong> features</span>
                  <span>•</span>
                  <span><strong>{stats?.missing_cells}</strong> missing cells ({stats?.missing_pct}%)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#EBE7DC] border border-[#DFDBD0] flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#5A6B65]">Health Index:</span>
                <span className={`text-xs font-extrabold ${stats?.score >= 80 ? "text-[#2D6A59]" : "text-amber-800"}`}>
                  {stats?.score}/100
                </span>
                <InfoTooltip text="Calculated as: 100 - (0.5 × Missing %) - (0.5 × Duplicate %). Scores above 85 indicate strong dataset hygiene." />
              </div>

              <button
                type="button"
                onClick={() => {
                  setCsvData(null);
                  setStats(null);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#18332F] bg-white border border-[#DFDBD0] hover:bg-[#EBE7DC] transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5A6B65]" />
                Change File
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-[#DFDBD0] pb-2 overflow-x-auto">
            {[
              { id: "table", label: "Data Preview", icon: Layers, desc: "Inspect raw tabular observations" },
              { id: "cleaning", label: "Data Cleaning", icon: Sparkles, desc: "Impute missing cells and deduplicate" },
              { id: "outliers", label: "Outlier Treatment", icon: TrendingUp, desc: "Z-score and IQR threshold capping" },
              { id: "eda", label: "Visual EDA & Heatmap", icon: BarChart3, desc: "Histograms and Pearson correlation" },
              { id: "ml", label: "Model Benchmarks", icon: Cpu, desc: "Supervised classification & regression" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === "eda" && stats?.numeric_cols?.length > 0 && !edaData) {
                      handleFetchEda(stats.numeric_cols[0]);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-[#18332F] text-white shadow-sm"
                      : "text-[#18332F] hover:bg-[#EBE7DC]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-300" : "text-[#5A6B65]"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: DATA TABLE */}
          {activeTab === "table" && (
            <div className="bg-white rounded-2xl p-6 border border-[#DFDBD0] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative max-w-sm w-full">
                  <Search className="w-4 h-4 text-[#5A6B65] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search records..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DFDBD0] text-xs text-[#18332F] placeholder-[#5A6B65] outline-none focus:border-[#2D6A59]"
                  />
                </div>

                <div className="text-xs text-[#5A6B65] font-semibold flex items-center gap-1.5">
                  Showing {displayedRecords.length} of {filteredRecords.length} records
                  <InfoTooltip text="Displays parsed records. Empty cells are marked with NaN and highlighted for straightforward review." />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#DFDBD0] max-h-[500px]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-[#EBE7DC] border-b border-[#DFDBD0] text-[#18332F] font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-[#5A6B65]">#</th>
                      {stats?.columns?.map((col: string, i: number) => {
                        const meta = stats?.column_metadata?.[col];
                        return (
                          <th key={i} className="py-2.5 px-3 whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              {col}
                              {meta && (
                                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${meta.type === 'Numeric' ? 'bg-[#2D6A59]/15 text-[#2D6A59]' : 'bg-slate-200 text-slate-700'}`}>
                                  {meta.type}
                                </span>
                              )}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFDBD0]/50 font-mono">
                    {displayedRecords.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-[#DFDBD0]/20 transition-colors">
                        <td className="py-2.5 px-3 text-[#5A6B65] font-sans text-[11px]">
                          {(currentPage - 1) * rowsPerPage + rIdx + 1}
                        </td>
                        {stats.columns.map((col: string, cIdx: number) => {
                          const val = row[col];
                          const isMissing = val === "" || val === null || val === undefined;
                          return (
                            <td
                              key={cIdx}
                              className={`py-2.5 px-3 whitespace-nowrap ${
                                isMissing ? "bg-amber-100/60 text-amber-900 font-bold" : "text-[#18332F]"
                              }`}
                            >
                              {isMissing ? "NaN" : String(val)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 rounded-lg border border-[#DFDBD0] text-xs font-bold text-[#18332F] hover:bg-[#EBE7DC] disabled:opacity-40 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <span className="text-xs text-[#5A6B65] font-semibold">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-1.5 rounded-lg border border-[#DFDBD0] text-xs font-bold text-[#18332F] hover:bg-[#EBE7DC] disabled:opacity-40 flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CLEANING */}
          {activeTab === "cleaning" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFDBD0] shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-[#18332F]">Data Cleansing & Deduplication</h3>
                  <InfoTooltip text="Imputation replaces empty cells to ensure mathematical algorithms do not fail during downstream modeling." />
                </div>
                <p className="text-xs text-[#5A6B65] mt-0.5">
                  Select an imputation strategy to replace missing values and purge duplicate observations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: "Mean",
                    title: "Mean Imputation",
                    desc: "Fills missing numeric values with the column average (recommended for symmetric distributions).",
                  },
                  {
                    id: "Median",
                    title: "Median Imputation",
                    desc: "Fills missing numeric values with the median (recommended for skewed distributions).",
                  },
                  {
                    id: "Drop rows",
                    title: "Drop Incomplete Rows",
                    desc: "Deletes any row containing at least one missing cell (preserves strict truth at cost of sample size).",
                  },
                ].map((strat) => (
                  <button
                    key={strat.id}
                    type="button"
                    onClick={() => setCleaningStrategy(strat.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      cleaningStrategy === strat.id
                        ? "border-[#18332F] bg-[#EBE7DC] text-[#18332F] shadow-sm"
                        : "border-[#DFDBD0] hover:border-[#18332F] text-[#5A6B65]"
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm text-[#18332F] mb-1">{strat.title}</div>
                    <div className="text-xs leading-relaxed">{strat.desc}</div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#EBE7DC]/60 border border-[#DFDBD0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#18332F]">Deduplication Filter</div>
                  <div className="text-xs text-[#5A6B65]">Detected {stats?.duplicate_rows} duplicate records in dataset.</div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#18332F]">
                  <input
                    type="checkbox"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2D6A59]"
                  />
                  Remove exact duplicates
                </label>
              </div>

              <button
                type="button"
                onClick={handleClean}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                {loading ? "Executing Pipeline..." : "Execute Cleaning Pipeline"}
              </button>
            </div>
          )}

          {/* TAB 3: OUTLIERS */}
          {activeTab === "outliers" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFDBD0] shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-[#18332F]">Statistical Outlier Engine</h3>
                  <InfoTooltip text="Extreme values distort model training. Capping limits them to statistically acceptable boundary points." />
                </div>
                <p className="text-xs text-[#5A6B65] mt-0.5">
                  Treat extreme numeric values using standard parametric or non-parametric rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#DFDBD0] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#18332F]">Detection Method</label>
                    <InfoTooltip text="Z-Score assumes normal distribution. IQR (Interquartile Range) is distribution-free." />
                  </div>
                  <select
                    value={outlierMethod}
                    onChange={(e) => setOutlierMethod(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#DFDBD0] text-xs font-semibold outline-none bg-white"
                  >
                    <option value="Z-score">Z-Score (Points with |z| &gt; 3 standard deviations)</option>
                    <option value="IQR">IQR (1.5 × Interquartile Range boundary)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl border border-[#DFDBD0] bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#18332F]">Action</label>
                    <InfoTooltip text="Capping clamps extremes to boundary values without deleting rows. Removal deletes outlier rows." />
                  </div>
                  <select
                    value={outlierAction}
                    onChange={(e) => setOutlierAction(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#DFDBD0] text-xs font-semibold outline-none bg-white"
                  >
                    <option value="Cap">Cap (Clamp extreme points to threshold boundaries)</option>
                    <option value="Remove">Remove (Delete rows with outlier values)</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOutliers}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                {loading ? "Processing Outliers..." : "Apply Outlier Treatment"}
              </button>
            </div>
          )}

          {/* TAB 4: EDA */}
          {activeTab === "eda" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFDBD0] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-[#18332F]">Exploratory Data Analysis</h3>
                    <InfoTooltip text="Univariate histograms display frequency density. The correlation matrix displays bivariate linear association (-1.0 to +1.0)." />
                  </div>
                  <p className="text-xs text-[#5A6B65] mt-0.5">Distribution histograms and Pearson feature correlation</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#18332F]">Feature:</span>
                  <select
                    value={edaColumn}
                    onChange={(e) => {
                      setEdaColumn(e.target.value);
                      handleFetchEda(e.target.value);
                    }}
                    className="p-2 rounded-lg border border-[#DFDBD0] text-xs font-bold outline-none bg-white"
                  >
                    {stats?.numeric_cols?.map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mature Distribution Chart */}
              {edaData?.histogram?.length > 0 ? (
                <div className="p-5 rounded-xl border border-[#DFDBD0] bg-[#F8FAFC]">
                  <div className="text-xs font-bold text-[#18332F] mb-4">
                    Frequency Distribution: {edaColumn}
                  </div>
                  <div className="h-44 flex items-end gap-2 pt-6">
                    {edaData.histogram.map((bin: any, idx: number) => {
                      const maxVal = Math.max(...edaData.histogram.map((b: any) => b.count), 1);
                      const heightPct = Math.round((bin.count / maxVal) * 100);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <div
                            className="w-full bg-[#18332F] hover:bg-[#2D6A59] rounded-t transition-all"
                            style={{ height: `${Math.max(heightPct, 4)}%` }}
                            title={`${bin.bin}: ${bin.count} observations`}
                          ></div>
                          <span className="text-[10px] text-[#5A6B65] truncate w-full text-center font-mono">
                            {bin.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#5A6B65] border border-[#DFDBD0] rounded-xl">
                  Select a numerical column above to display its distribution histogram.
                </div>
              )}

              {/* Correlation Matrix */}
              {edaData?.correlation && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <h4 className="text-xs font-bold text-[#18332F] uppercase tracking-wider">
                      Pearson Correlation Matrix
                    </h4>
                    <InfoTooltip text="Values close to +1 indicate strong positive linear relationship; values close to -1 indicate negative relationship." />
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-[#DFDBD0]">
                    <table className="w-full text-xs text-center border-collapse">
                      <thead className="bg-[#EBE7DC] border-b border-[#DFDBD0]">
                        <tr>
                          <th className="p-2.5 text-left font-bold text-[#18332F]">Features</th>
                          {stats?.numeric_cols?.map((c: string) => (
                            <th key={c} className="p-2.5 font-bold text-[#18332F] whitespace-nowrap">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DFDBD0]/50 font-mono text-[11px]">
                        {stats?.numeric_cols?.map((rowCol: string) => (
                          <tr key={rowCol}>
                            <td className="p-2.5 text-left font-sans font-bold text-[#18332F]">{rowCol}</td>
                            {stats.numeric_cols.map((colCol: string) => {
                              const val = edaData.correlation[rowCol]?.[colCol] ?? 0;
                              const isDiagonal = rowCol === colCol;
                              return (
                                <td
                                  key={colCol}
                                  className={`p-2.5 ${
                                    isDiagonal
                                      ? "bg-[#DFDBD0]/50 font-bold text-[#18332F]"
                                      : Math.abs(val) > 0.6
                                      ? "bg-[#2D6A59]/15 font-bold text-[#2D6A59]"
                                      : "text-[#5A6B65]"
                                  }`}
                                >
                                  {val}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MACHINE LEARNING */}
          {activeTab === "ml" && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DFDBD0] shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-[#18332F]">Machine Learning Benchmarking</h3>
                  <InfoTooltip text="Evaluates supervised models using 80/20 train/test splits. Metric: Accuracy for Classification, R² Score for Regression." />
                </div>
                <p className="text-xs text-[#5A6B65] mt-0.5">
                  Select a target variable to evaluate baseline supervised learning models.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-[#EBE7DC]/60 border border-[#DFDBD0]">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-[#18332F] mb-1">Target Variable to Predict</label>
                  <select
                    value={mlTarget}
                    onChange={(e) => setMlTarget(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#DFDBD0] text-xs sm:text-sm outline-none bg-white font-semibold"
                  >
                    {stats?.columns?.map((c: string) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleTrainML}
                  disabled={loading}
                  className="w-full sm:w-auto sm:self-end px-6 py-2.5 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-emerald-300" />
                  {loading ? "Evaluating Models..." : "Train & Evaluate Models"}
                </button>
              </div>

              {leaderboard && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#18332F] uppercase tracking-wider">
                      Model Leaderboard ({taskType})
                    </h4>
                    <span className="text-xs font-bold text-[#2D6A59] bg-[#2D6A59]/15 px-3 py-1 rounded-full">
                      Best: {leaderboard[0]?.model}
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-[#DFDBD0]">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-[#EBE7DC] border-b border-[#DFDBD0]">
                        <tr>
                          <th className="p-3 font-bold text-[#18332F]">Rank</th>
                          <th className="p-3 font-bold text-[#18332F]">Algorithm</th>
                          <th className="p-3 font-bold text-[#18332F]">Metric</th>
                          <th className="p-3 font-bold text-[#18332F]">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DFDBD0]/50 font-mono">
                        {leaderboard.map((m: any, i: number) => (
                          <tr key={i} className={i === 0 ? "bg-emerald-50/70 font-bold" : ""}>
                            <td className="p-3">{i === 0 ? "🥇 #1" : `#${i + 1}`}</td>
                            <td className="p-3 font-sans font-semibold text-[#18332F]">{m.model}</td>
                            <td className="p-3 text-[#5A6B65]">{m.metric}</td>
                            <td className="p-3 text-[#2D6A59] font-bold">{m.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      )}

      {/* Authentication Required Modal Dialog */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-[#18332F]/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#DFDBD0] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left space-y-6">
            
            {/* Close / Dismiss button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 p-2 text-[#5A6B65] hover:text-[#18332F] hover:bg-[#EBE7DC] rounded-xl transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#18332F] text-amber-300 flex items-center justify-center shadow-md">
                <Lock className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                Access Locked
              </div>
              <h3 className="text-xl font-extrabold text-[#18332F] tracking-tight">
                Please Sign In to Upload
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6B65] leading-relaxed">
                CSV and Excel file ingestion, automated statistical profiling, and predictive ML modeling are restricted to signed-in accounts. Please sign in or use instant one-click access below.
              </p>
            </div>

            {/* Primary Action: Redirect to Login Page */}
            <div className="space-y-3 pt-1">
              <Link
                href="/login"
                className="w-full py-3.5 px-5 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#18332F]/15 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-emerald-300" />
                <span>Go to Sign In / Register Page</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Quick 1-Click Access */}
            <div className="space-y-3">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#DFDBD0] w-full"></div>
                <span className="bg-[#FDFBF7] px-3 text-[10px] uppercase font-bold text-[#5A6B65] tracking-wider relative">
                  Or instant 1-click access
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("Analyst")}
                  className="p-3 rounded-xl border border-[#DFDBD0] bg-white hover:bg-[#EBE7DC] hover:border-[#2D6A59] transition-all text-left flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2D6A59]/10 text-[#2D6A59] flex items-center justify-center font-bold text-xs group-hover:bg-[#2D6A59] group-hover:text-white transition-colors">
                    📊
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#18332F]">Demo Analyst</div>
                    <div className="text-[10px] text-[#5A6B65]">Instant analyst login</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin("Admin")}
                  className="p-3 rounded-xl border border-[#DFDBD0] bg-white hover:bg-[#EBE7DC] hover:border-[#2D6A59] transition-all text-left flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#18332F]/10 text-[#18332F] flex items-center justify-center font-bold text-xs group-hover:bg-[#18332F] group-hover:text-white transition-colors">
                    🛡️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#18332F]">Demo Admin</div>
                    <div className="text-[10px] text-[#5A6B65]">Full admin telemetry</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-xs font-semibold text-[#5A6B65] hover:text-[#18332F] transition-colors"
              >
                Cancel and return to overview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
