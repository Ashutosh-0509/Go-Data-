"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  BarChart2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Analyst");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || (isSignUp && !name)) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Create session
      const userData = {
        name: isSignUp ? name : email.split("@")[0].toUpperCase(),
        email: email,
        role: role,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem("sda_user", JSON.stringify(userData));
      setSuccess(`Authentication verified. Redirecting to workspace...`);
      setLoading(false);

      setTimeout(() => {
        if (role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 800);
    }, 500);
  };

  const handleQuickDemo = (demoRole: "Admin" | "Analyst") => {
    const demoUser = {
      name: demoRole === "Admin" ? "Prajwal (Admin)" : "Alex Analyst",
      email: demoRole === "Admin" ? "admin@smartanalyst.io" : "analyst@smartanalyst.io",
      role: demoRole,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("sda_user", JSON.stringify(demoUser));
    setSuccess(`Loaded session as Demo ${demoRole}. Redirecting...`);

    setTimeout(() => {
      if (demoRole === "Admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-8">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="enterprise-card p-6 sm:p-8 border border-[#E2E8F0] shadow-sm bg-white">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#0B1220] text-white mb-3">
                <BarChart2 className="w-5 h-5 text-[#38BDF8]" />
              </div>
              <h1 className="text-xl font-bold text-[#0B1220] tracking-tight">
                {isSignUp ? "Create Workspace Account" : "Sign In to Smart Data Analyst"}
              </h1>
              <p className="text-xs text-[#475569] mt-1">
                {isSignUp
                  ? "Access full dataset profiling, data cleaning, and model benchmarking"
                  : "Enter your credentials or choose a pre-configured demo profile"}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-md bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs text-[#DC2626]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] flex items-center gap-2 text-xs text-[#16A34A]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Analyst"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="email"
                    placeholder="analyst@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Workspace Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("Analyst")}
                    className={`py-1.5 px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                      role === "Analyst"
                        ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
                        : "bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    Data Analyst
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("Admin")}
                    className={`py-1.5 px-3 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                      role === "Admin"
                        ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
                        : "bg-white border-[#CBD5E1] text-[#475569] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    Platform Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>{loading ? "Authenticating..." : isSignUp ? "Create Account" : "Sign In to Workspace"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Profile Logins */}
            <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
              <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2.5 text-center">
                One-Click Quick Login
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("Analyst")}
                  className="py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-medium text-[#0F172A] transition-colors cursor-pointer text-center"
                >
                  Demo Analyst
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("Admin")}
                  className="py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-medium text-[#0F172A] transition-colors cursor-pointer text-center"
                >
                  Demo Admin
                </button>
              </div>
            </div>

            {/* Toggle sign in / sign up */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setSuccess("");
                }}
                className="text-xs text-[#2563EB] hover:underline cursor-pointer"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need a new account? Register"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
