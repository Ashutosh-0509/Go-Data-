"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound
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
      setSuccess(`Welcome back, ${userData.name}! Redirecting...`);
      setLoading(false);

      setTimeout(() => {
        if (role === "Admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1000);
    }, 600);
  };

  const handleQuickDemo = (demoRole: "Admin" | "Analyst") => {
    const demoUser = {
      name: demoRole === "Admin" ? "Prajwal (Admin)" : "Alex Analyst",
      email: demoRole === "Admin" ? "admin@smartanalyst.io" : "analyst@smartanalyst.io",
      role: demoRole,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("sda_user", JSON.stringify(demoUser));
    setSuccess(`Logged in as Demo ${demoRole}! Redirecting...`);

    setTimeout(() => {
      if (demoRole === "Admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-8">
        <div className="w-full max-w-md">
          
          {/* Card Container */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(24,51,47,0.08)] border border-[#DFDBD0]/80 relative overflow-hidden">
            
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#18332F] via-[#2D6A59] to-emerald-400"></div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#18332F] to-[#2D6A59] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#18332F]/20 mb-4">
                <Sparkles className="w-7 h-7 text-emerald-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18332F] tracking-tight">
                {isSignUp ? "Create an Account" : "Welcome Back"}
              </h1>
              <p className="text-xs sm:text-sm text-[#5A6B65] mt-1.5">
                {isSignUp
                  ? "Access the automated data pipeline & machine learning suite"
                  : "Sign in to manage datasets, inspect pipelines, and review AutoML runs"}
              </p>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="mb-6 p-3 rounded-2xl bg-[#EBE7DC]/80 border border-[#DFDBD0] text-center">
              <div className="text-[11px] font-bold text-[#5A6B65] uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#2D6A59]" />
                1-Click Quick Demo Access
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("Admin")}
                  className="py-1.5 px-3 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Demo Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("Analyst")}
                  className="py-1.5 px-3 rounded-xl bg-white hover:bg-[#F3F0E6] text-[#18332F] border border-[#DFDBD0] text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#2D6A59]" />
                  Demo Analyst
                </button>
              </div>
            </div>

            {/* Tab switch */}
            <div className="flex bg-[#EBE7DC] p-1 rounded-xl mb-6 border border-[#DFDBD0]">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  !isSignUp
                    ? "bg-white text-[#18332F] shadow-sm"
                    : "text-[#5A6B65] hover:text-[#18332F]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setError("");
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  isSignUp
                    ? "bg-white text-[#18332F] shadow-sm"
                    : "text-[#5A6B65] hover:text-[#18332F]"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error / Success Feedback */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{success}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-[#18332F] mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5A6B65] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Prajwal Sangle"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl text-xs sm:text-sm text-[#18332F] placeholder-[#5A6B65] outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#18332F] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5A6B65] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl text-xs sm:text-sm text-[#18332F] placeholder-[#5A6B65] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18332F] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5A6B65] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl text-xs sm:text-sm text-[#18332F] placeholder-[#5A6B65] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#5A6B65] hover:text-[#18332F]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#18332F] mb-1.5">Workspace Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("Analyst")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === "Analyst"
                        ? "bg-[#2D6A59]/15 border-[#2D6A59] text-[#2D6A59]"
                        : "bg-white border-[#DFDBD0] text-[#5A6B65]"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Data Analyst
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("Admin")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      role === "Admin"
                        ? "bg-[#2D6A59]/15 border-[#2D6A59] text-[#2D6A59]"
                        : "bg-white border-[#DFDBD0] text-[#5A6B65]"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    System Admin
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#18332F] to-[#2D6A59] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#18332F]/15 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? "Authenticating..." : isSignUp ? "Create Workspace Account" : "Sign In to Platform"}
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-[#5A6B65]">
              By logging in, you agree to our in-memory privacy policy and safe analytical computation standards.
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
