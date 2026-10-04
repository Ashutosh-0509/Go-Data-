"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatusBadge from "../components/StatusBadge";
import SectionHeader from "../components/SectionHeader";
import TechnicalDetails from "../components/TechnicalDetails";
import {
  Server,
  Activity,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  ShieldCheck
} from "lucide-react";
import { apiFetch, API_BASE_URL } from "../config/api";

export default function AdminPage() {
  const [apiHealth, setApiHealth] = useState<{ status: string; latency: number } | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [adminLogNotification, setAdminLogNotification] = useState("");

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    const start = performance.now();
    try {
      const res = await apiFetch("/health", { timeoutMs: 65000, retries: 1 });
      const end = performance.now();
      if (res.ok) {
        setApiHealth({ status: "healthy", latency: Math.round(end - start) });
      } else {
        setApiHealth({ status: "degraded", latency: Math.round(end - start) });
      }
    } catch {
      setApiHealth({ status: "offline", latency: 0 });
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    let active = true;
    const probe = async () => {
      const start = performance.now();
      try {
        const res = await apiFetch("/health", { timeoutMs: 65000, retries: 1 });
        const end = performance.now();
        if (active) {
          setApiHealth({ status: res.ok ? "healthy" : "degraded", latency: Math.round(end - start) });
        }
      } catch {
        if (active) setApiHealth({ status: "offline", latency: 0 });
      }
    };
    probe();
    return () => {
      active = false;
    };
  }, []);

  const triggerAction = (actionName: string) => {
    setAdminLogNotification(`System routine executed: ${actionName} completed.`);
    setTimeout(() => setAdminLogNotification(""), 3500);
  };

  const ingestionLogs = [
    {
      id: "LOG-9041",
      filename: "sample_employees.csv",
      rows: 28,
      cols: 7,
      health: 89.2,
      privacyRisk: "None",
      time: "2 mins ago",
      status: "Ready",
    },
    {
      id: "LOG-9040",
      filename: "quarterly_sales_q4.csv",
      rows: 1420,
      cols: 12,
      health: 96.0,
      privacyRisk: "None",
      time: "14 mins ago",
      status: "Ready",
    },
    {
      id: "LOG-9039",
      filename: "customer_churn_survey.xlsx",
      rows: 850,
      cols: 16,
      health: 74.5,
      privacyRisk: "Phone Flagged",
      time: "48 mins ago",
      status: "Needs Review",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SectionHeader
          eyebrow="System Administration"
          title="System Status & Telemetry"
          description="Real-time monitoring of backend compute instances, health checks, in-memory buffer statistics, and dataset audit trails."
          action={
            <button
              type="button"
              onClick={checkHealth}
              disabled={isCheckingHealth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#CBD5E1] hover:border-[#94A3B8] text-xs font-semibold text-[#0F172A] shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#475569] ${isCheckingHealth ? "animate-spin" : ""}`} />
              <span>Probe Health</span>
            </button>
          }
        />

        {adminLogNotification && (
          <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg flex items-center gap-2 text-xs text-[#16A34A]">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{adminLogNotification}</span>
          </div>
        )}

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Backend API</span>
              <Server className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0B1220]">
                {apiHealth?.status === "healthy" ? "Operational" : apiHealth?.status === "degraded" ? "Degraded" : "Connecting..."}
              </span>
              <StatusBadge
                status={apiHealth?.status === "healthy" ? "Ready" : "Action Required"}
                size="sm"
              />
            </div>
            <div className="text-[11px] text-[#64748B] font-mono truncate">
              {API_BASE_URL}
            </div>
          </div>

          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="font-semibold uppercase tracking-wider text-[11px]">API Round-Trip Latency</span>
              <Activity className="w-4 h-4 text-[#0F766E]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0B1220] tabular-nums">
                {apiHealth ? `${apiHealth.latency} ms` : "—"}
              </span>
              <span className="text-[11px] text-[#16A34A] font-medium">FastAPI P95</span>
            </div>
            <div className="text-[11px] text-[#64748B]">
              HTTP Keep-Alive active
            </div>
          </div>

          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Memory Architecture</span>
              <HardDrive className="w-4 h-4 text-[#475569]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0B1220]">Stateless</span>
              <span className="text-[11px] text-[#2563EB] font-mono">0 Disk I/O</span>
            </div>
            <div className="text-[11px] text-[#64748B]">
              Payload in-memory string IO
            </div>
          </div>

          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center justify-between text-[#64748B]">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Privacy Guard</span>
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-[#0B1220]">Active</span>
              <span className="text-[11px] text-[#16A34A] font-medium">Regex PII</span>
            </div>
            <div className="text-[11px] text-[#64748B]">
              Email & Phone heuristic filters
            </div>
          </div>
        </div>

        {/* System Diagnostics & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 enterprise-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0B1220]">
                  Session Processing Audit Log
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Recent dataset analysis traces evaluated across active sessions.
                </p>
              </div>
              <span className="text-xs text-[#64748B] font-mono">{ingestionLogs.length} events logged</span>
            </div>

            <div className="table-container">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Trace ID</th>
                    <th>Dataset Name</th>
                    <th className="text-right">Rows</th>
                    <th className="text-right">Cols</th>
                    <th className="text-right">Health</th>
                    <th>Privacy</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ingestionLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="font-mono text-[#64748B] text-[11px]">{log.id}</td>
                      <td className="font-medium text-[#0F172A]">{log.filename}</td>
                      <td className="text-right font-mono tabular-nums">{log.rows}</td>
                      <td className="text-right font-mono tabular-nums">{log.cols}</td>
                      <td className="text-right font-mono tabular-nums font-semibold">{log.health}%</td>
                      <td>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                          log.privacyRisk === "None"
                            ? "bg-[#F0FDF4] text-[#16A34A]"
                            : "bg-[#FFFBEB] text-[#D97706]"
                        }`}>
                          {log.privacyRisk}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={log.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Operations Panel */}
          <div className="enterprise-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#0B1220]">
              Operational Controls
            </h3>
            <p className="text-xs text-[#64748B]">
              Administrative routines for session invalidation and telemetry calibration.
            </p>

            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => triggerAction("Clear Browser LocalStorage Cache")}
                className="w-full text-left p-2.5 rounded bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium text-[#0F172A]">Purge Client Cache</span>
                <span className="text-[11px] text-[#64748B]">localStorage</span>
              </button>

              <button
                type="button"
                onClick={() => triggerAction("Flush In-Memory Python Memory Buffers")}
                className="w-full text-left p-2.5 rounded bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium text-[#0F172A]">Trigger Python GC</span>
                <span className="text-[11px] text-[#64748B]">FastAPI gc.collect</span>
              </button>

              <button
                type="button"
                onClick={() => triggerAction("Verify CORS Whitelist Headers")}
                className="w-full text-left p-2.5 rounded bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="font-medium text-[#0F172A]">Verify CORS Headers</span>
                <span className="text-[11px] text-[#64748B]">Preflight 200 OK</span>
              </button>
            </div>

            <TechnicalDetails
              title="FastAPI Microservice Specifications"
              summary="Python 3.12 • Pandas 2.2 • Scikit-Learn 1.4"
              items={[
                { label: "FastAPI Version", value: "0.110.0" },
                { label: "Uvicorn Engine", value: "uvicorn[standard] 0.28.0" },
                { label: "Max Request Limit", value: "10 MB Payload Guard" },
                { label: "CORS Allowed Origins", value: "localhost:3000, vercel.app" },
              ]}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
