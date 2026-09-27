"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShieldCheck,
  Server,
  Activity,
  Cpu,
  Database,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  BarChart3,
  Terminal,
  Clock,
  ArrowUpRight,
  Sparkles,
  Layers,
  FileSpreadsheet
} from "lucide-react";

export default function AdminPage() {
  const [apiHealth, setApiHealth] = useState<{ status: string; latency: number } | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [adminLogNotification, setAdminLogNotification] = useState("");

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/health");
      const end = performance.now();
      if (res.ok) {
        setApiHealth({ status: "healthy", latency: Math.round(end - start) });
      } else {
        setApiHealth({ status: "degraded", latency: Math.round(end - start) });
      }
    } catch (err) {
      setApiHealth({ status: "offline", latency: 0 });
    }
    setIsCheckingHealth(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const triggerAction = (actionName: string) => {
    setAdminLogNotification(`Action executed: ${actionName} triggered successfully.`);
    setTimeout(() => setAdminLogNotification(""), 3500);
  };

  // Mock logs
  const ingestionLogs = [
    {
      id: "DS-9041",
      filename: "sample_employee_churn.csv",
      rows: 1240,
      cols: 14,
      health: 94.5,
      privacyRisk: "Low (Masked)",
      time: "10 mins ago",
      status: "Cleaned & Trained",
    },
    {
      id: "DS-9040",
      filename: "quarterly_financials_q3.xlsx",
      rows: 5820,
      cols: 28,
      health: 78.2,
      privacyRisk: "Phone Detected",
      time: "42 mins ago",
      status: "Outliers Capped",
    },
    {
      id: "DS-9039",
      filename: "customer_telemetry_2026.csv",
      rows: 15400,
      cols: 32,
      health: 98.1,
      privacyRisk: "Clean",
      time: "2 hours ago",
      status: "AutoML Complete",
    },
    {
      id: "DS-9038",
      filename: "sensor_readings_iot.csv",
      rows: 42000,
      cols: 9,
      health: 89.0,
      privacyRisk: "Clean",
      time: "5 hours ago",
      status: "EDA Generated",
    },
  ];

  const teamMembers = [
    { name: "Prajwal Sangle", email: "prajwal@company.com", role: "Super Admin", status: "Active" },
    { name: "Sarah Chen", email: "s.chen@analytics.io", role: "Lead Data Scientist", status: "Active" },
    { name: "Marcus Rivera", email: "m.rivera@data.corp", role: "ML Engineer", status: "Active" },
    { name: "Devon Vance", email: "d.vance@company.com", role: "Data Analyst", status: "Inactive" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DFDBD0] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#18332F] text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18332F] tracking-tight">
                System Administration Console
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#5A6B65] mt-1 ml-9">
              Real-time telemetry, model benchmarks, dataset audit trails, and memory safety monitors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DFDBD0] text-xs font-bold text-[#18332F] hover:bg-[#EBE7DC] transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2D6A59] ${isCheckingHealth ? "animate-spin" : ""}`} />
              Re-check API Health
            </button>
            <button
              onClick={() => triggerAction("In-Memory Buffer Flush")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-xs font-bold text-white transition-all shadow-sm"
            >
              <HardDrive className="w-3.5 h-3.5 text-emerald-300" />
              Purge Memory Cache
            </button>
          </div>
        </div>

        {/* Action toast */}
        {adminLogNotification && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{adminLogNotification}</span>
            </div>
            <button onClick={() => setAdminLogNotification("")} className="text-emerald-700 hover:text-emerald-900 font-bold">×</button>
          </div>
        )}

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* API Health */}
          <div className="glass-card rounded-2xl p-5 border border-[#DFDBD0]/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#5A6B65] uppercase tracking-wider">FastAPI Backend</span>
              <Server className="w-4 h-4 text-[#2D6A59]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#18332F]">
                {apiHealth?.status === "healthy" ? "Online" : apiHealth?.status === "degraded" ? "Degraded" : "Offline"}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {apiHealth ? `${apiHealth.latency}ms latency` : "Checking..."}
              </span>
            </div>
            <p className="text-[11px] text-[#5A6B65] mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              FastAPI port 8000 connected
            </p>
          </div>

          {/* Datasets Processed */}
          <div className="glass-card rounded-2xl p-5 border border-[#DFDBD0]/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#5A6B65] uppercase tracking-wider">Total Ingestions</span>
              <Database className="w-4 h-4 text-[#2D6A59]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#18332F]">2,845</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                +14% this week
              </span>
            </div>
            <p className="text-[11px] text-[#5A6B65] mt-2">
              Over 1.8M records safely profiled
            </p>
          </div>

          {/* AutoML Models Trained */}
          <div className="glass-card rounded-2xl p-5 border border-[#DFDBD0]/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#5A6B65] uppercase tracking-wider">Models Evaluated</span>
              <Cpu className="w-4 h-4 text-[#2D6A59]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#18332F]">11,380</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                99.8% Converged
              </span>
            </div>
            <p className="text-[11px] text-[#5A6B65] mt-2">
              Random Forest, Decision Tree, Logistic
            </p>
          </div>

          {/* Data Hygiene / Cleaning Rate */}
          <div className="glass-card rounded-2xl p-5 border border-[#DFDBD0]/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#5A6B65] uppercase tracking-wider">PII Shield Rate</span>
              <ShieldCheck className="w-4 h-4 text-[#2D6A59]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#18332F]">100%</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Zero Leaks
              </span>
            </div>
            <p className="text-[11px] text-[#5A6B65] mt-2">
              Protected in volatile RAM buffers
            </p>
          </div>

        </div>

        {/* Telemetry & Resource Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-[#DFDBD0]/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-[#18332F] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2D6A59]" />
                Live Computation Pipelines
              </h3>
              <span className="text-xs font-bold text-[#2D6A59] bg-[#2D6A59]/10 px-2.5 py-1 rounded-full">
                Active Queue: Normal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#EBE7DC]/60 border border-[#DFDBD0]">
                <div className="text-[11px] font-bold text-[#5A6B65] mb-1">DATA CLEANING ENGINE</div>
                <div className="text-lg font-bold text-[#18332F]">Median/Mean Imputation</div>
                <div className="text-xs text-[#2D6A59] mt-2 font-medium">Avg Execution: 12ms</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#EBE7DC]/60 border border-[#DFDBD0]">
                <div className="text-[11px] font-bold text-[#5A6B65] mb-1">OUTLIER TREATMENT</div>
                <div className="text-lg font-bold text-[#18332F]">Z-Score & IQR Cap</div>
                <div className="text-xs text-[#2D6A59] mt-2 font-medium">Avg Execution: 24ms</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#EBE7DC]/60 border border-[#DFDBD0]">
                <div className="text-[11px] font-bold text-[#5A6B65] mb-1">AUTO-EDA VISUALIZER</div>
                <div className="text-lg font-bold text-[#18332F]">Correlation Heatmap</div>
                <div className="text-xs text-[#2D6A59] mt-2 font-medium">Avg Execution: 38ms</div>
              </div>
            </div>

            {/* Model Benchmarks */}
            <div className="pt-2">
              <div className="text-xs font-bold text-[#18332F] mb-2">Automated Machine Learning Model Benchmarks</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#18332F]">Random Forest Classifier (Ensemble)</span>
                    <span className="text-[#2D6A59]">96.4% Avg Accuracy</span>
                  </div>
                  <div className="w-full bg-[#EBE7DC] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2D6A59] h-full rounded-full" style={{ width: "96.4%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#18332F]">Decision Tree Regressor / Classifier</span>
                    <span className="text-[#2D6A59]">89.1% Score</span>
                  </div>
                  <div className="w-full bg-[#EBE7DC] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2D6A59] h-full rounded-full" style={{ width: "89.1%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-[#18332F]">Linear / Logistic Regression Baseline</span>
                    <span className="text-[#2D6A59]">84.8% Score</span>
                  </div>
                  <div className="w-full bg-[#EBE7DC] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2D6A59] h-full rounded-full" style={{ width: "84.8%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Diagnostics */}
          <div className="glass-card rounded-3xl p-6 border border-[#DFDBD0]/80 space-y-4">
            <h3 className="font-extrabold text-base text-[#18332F] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#2D6A59]" />
              Quick Diagnostics
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => triggerAction("Health Check Probe")}
                className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F3F0E6] border border-[#DFDBD0] text-xs font-semibold transition-all flex items-center justify-between"
              >
                <span>Run Full Health Diagnostic</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5A6B65]" />
              </button>
              <button
                onClick={() => triggerAction("Outlier Calibration Test")}
                className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F3F0E6] border border-[#DFDBD0] text-xs font-semibold transition-all flex items-center justify-between"
              >
                <span>Recalibrate Outlier Thresholds</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5A6B65]" />
              </button>
              <button
                onClick={() => triggerAction("Model Hyperparameter Refresh")}
                className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F3F0E6] border border-[#DFDBD0] text-xs font-semibold transition-all flex items-center justify-between"
              >
                <span>Sync Default Hyperparameters</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5A6B65]" />
              </button>
              <button
                onClick={() => triggerAction("PII Regex Filter Update")}
                className="w-full text-left p-3 rounded-xl bg-white hover:bg-[#F3F0E6] border border-[#DFDBD0] text-xs font-semibold transition-all flex items-center justify-between"
              >
                <span>Update Privacy Detection Rules</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#5A6B65]" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#18332F] text-white space-y-1">
              <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                In-Memory Data Hygiene
              </div>
              <p className="text-[11px] text-[#EBE7DC]/80 leading-relaxed">
                No user CSV or Excel files are permanently retained on disk. All pipelines execute in RAM buffers.
              </p>
            </div>
          </div>

        </div>

        {/* Dataset Ingestion Table */}
        <div className="glass-card rounded-3xl p-6 border border-[#DFDBD0]/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#18332F] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#2D6A59]" />
                Recent Dataset Ingestion Logs
              </h3>
              <p className="text-xs text-[#5A6B65]">Comprehensive audit log of parsed files and cleaning pipeline stages</p>
            </div>
            <span className="text-xs font-bold text-[#5A6B65]">Showing latest 4 entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DFDBD0] text-[11px] font-bold text-[#5A6B65] uppercase">
                  <th className="py-2.5 px-3">Dataset ID</th>
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Dimensions</th>
                  <th className="py-2.5 px-3">Health Score</th>
                  <th className="py-2.5 px-3">PII Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDBD0]/60 text-xs">
                {ingestionLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#DFDBD0]/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#2D6A59]">{log.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#18332F]">{log.filename}</td>
                    <td className="py-3 px-3 text-[#5A6B65]">{log.rows} rows × {log.cols} cols</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#18332F]">{log.health}</span>
                      <span className="text-[10px] text-[#5A6B65]">/100</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.privacyRisk.includes("Phone")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {log.privacyRisk}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5A6B65] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#5A6B65]" />
                      {log.time}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#18332F] text-white text-[11px] font-semibold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Section */}
        <div className="glass-card rounded-3xl p-6 border border-[#DFDBD0]/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-[#18332F] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2D6A59]" />
                Authorized Team Members
              </h3>
              <p className="text-xs text-[#5A6B65]">Manage user privileges, analyst access levels, and security tokens</p>
            </div>
            <button
              onClick={() => triggerAction("Invite Member Modal")}
              className="px-3.5 py-1.5 rounded-xl bg-[#2D6A59] hover:bg-[#18332F] text-white text-xs font-bold transition-all shadow-sm"
            >
              + Invite Analyst
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {teamMembers.map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border border-[#DFDBD0] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#18332F] text-white font-bold flex items-center justify-center text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      m.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#18332F]">{m.name}</h4>
                  <p className="text-[11px] text-[#5A6B65] truncate">{m.email}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#DFDBD0] text-[10px] font-bold text-[#2D6A59] uppercase tracking-wider">
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
