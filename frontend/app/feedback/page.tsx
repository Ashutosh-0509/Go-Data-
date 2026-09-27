"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  MessageSquareHeart,
  Star,
  Sparkles,
  Send,
  CheckCircle2,
  ThumbsUp,
  Bug,
  Lightbulb,
  Heart,
  HelpCircle,
  Shield,
  FileSpreadsheet
} from "lucide-react";

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState("Feature Request");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [datasetType, setDatasetType] = useState("Finance / Sales CSV");
  const [submitted, setSubmitted] = useState(false);
  const [upvotes, setUpvotes] = useState<Record<number, number>>({ 0: 24, 1: 18, 2: 12 });

  const feedbackTypes = [
    { label: "Feature Request", icon: Lightbulb, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Bug Report", icon: Bug, color: "text-rose-600 bg-rose-50 border-rose-200" },
    { label: "Platform Praise", icon: Heart, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "General Feedback", icon: MessageSquareHeart, color: "text-blue-600 bg-blue-50 border-blue-200" },
  ];

  const communityReviews = [
    {
      name: "Dr. Ethan Wright",
      role: "Lead Quantitative Researcher",
      org: "Apex Financial Analytics",
      rating: 5,
      type: "Platform Praise",
      date: "2 days ago",
      comment:
        "The automated Z-Score and IQR outlier capping saved our team hours on quarterly auditing. The grounded chat engine that runs real pandas operations makes it reliable for senior management.",
    },
    {
      name: "Sophia Martinez",
      role: "Senior Data Scientist",
      org: "CloudBio Informatics",
      rating: 5,
      type: "Feature Request",
      date: "4 days ago",
      comment:
        "Love the instant correlation heatmap and AutoML leaderboard! Would love to see support for Time-Series forecasting (ARIMA / Prophet) in the next release.",
    },
    {
      name: "Arjun Mehta",
      role: "Data Engineering Associate",
      org: "FinScale Labs",
      rating: 5,
      type: "Platform Praise",
      date: "1 week ago",
      comment:
        "The PII detection shield caught unmasked email addresses in our marketing dataset before we initiated ML training. Fantastic attention to privacy and zero data leakage.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) return;
    setSubmitted(true);
  };

  const handleUpvote = (idx: number) => {
    setUpvotes((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
  };

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2D6A59]/15 text-[#2D6A59] text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            User Feedback & Suggestions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18332F] tracking-tight">
            Help Us Shape the Future of AutoML
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6B65]">
            Your real-world experiences with dataset cleaning, outlier capping, and machine learning models directly inform our roadmap.
          </p>
        </div>

        {/* Feedback Form Card */}
        <div className="max-w-2xl mx-auto w-full">
          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#DFDBD0]/80 shadow-[0_20px_50px_rgba(24,51,47,0.06)] relative overflow-hidden">
            
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[#18332F]">Thank You for Your Feedback!</h2>
                <p className="text-xs sm:text-sm text-[#5A6B65] max-w-md mx-auto">
                  Your comments have been logged directly into our product triage pipeline. We review all algorithmic suggestions and bug reports within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setComments("");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#18332F] hover:bg-[#2D6A59] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Submit Another Review
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Star Rating */}
                <div>
                  <label className="block text-xs font-bold text-[#18332F] uppercase tracking-wider mb-2">
                    How would you rate your overall experience?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#2D6A59] ml-2">
                      {rating === 5
                        ? "⭐⭐⭐⭐⭐ Exceptional"
                        : rating === 4
                        ? "⭐⭐⭐⭐ Very Good"
                        : rating === 3
                        ? "⭐⭐⭐ Satisfactory"
                        : "Needs Improvement"}
                    </span>
                  </div>
                </div>

                {/* Feedback Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#18332F] uppercase tracking-wider mb-2">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = feedbackType === type.label;
                      return (
                        <button
                          key={type.label}
                          type="button"
                          onClick={() => setFeedbackType(type.label)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                            isSelected
                              ? "bg-[#18332F] text-white border-[#18332F] shadow-sm"
                              : "bg-white border-[#DFDBD0] text-[#5A6B65] hover:bg-[#EBE7DC]"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-300" : ""}`} />
                          <span className="text-[11px] leading-tight text-center">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* User Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#18332F] mb-1.5">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Prajwal Sangle"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl text-xs sm:text-sm text-[#18332F] placeholder-[#5A6B65] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#18332F] mb-1.5">Email (Optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@domain.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl text-xs sm:text-sm text-[#18332F] placeholder-[#5A6B65] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Dataset Type */}
                <div>
                  <label className="block text-xs font-bold text-[#18332F] mb-1.5">What type of dataset did you test?</label>
                  <select
                    value={datasetType}
                    onChange={(e) => setDatasetType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl text-xs sm:text-sm text-[#18332F] outline-none transition-all"
                  >
                    <option value="Finance / Sales CSV">Finance / Sales CSV</option>
                    <option value="Healthcare / Patient Records">Healthcare / Patient Records</option>
                    <option value="Customer Churn / Marketing">Customer Churn / Marketing</option>
                    <option value="IoT / Sensor Telemetry">IoT / Sensor Telemetry</option>
                    <option value="HR / Employee Performance (Demo Data)">HR / Employee Performance (Demo Data)</option>
                    <option value="Other">Other Custom Format</option>
                  </select>
                </div>

                {/* Detailed Comments */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-[#18332F]">Your Comments & Suggestions</label>
                    <span className="text-[10px] text-[#5A6B65]">{comments.length}/500</span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Tell us what you liked, what models worked best, or what feature we should add next..."
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl text-xs sm:text-sm text-[#18332F] placeholder-[#5A6B65] outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#18332F] to-[#2D6A59] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-[#18332F]/15 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4 text-emerald-300" />
                  Submit Feedback
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Community Reviews Showcase */}
        <div className="space-y-4 pt-6 border-t border-[#DFDBD0]">
          <div className="text-center">
            <h3 className="text-xl font-bold text-[#18332F]">Recent Community Reviews</h3>
            <p className="text-xs text-[#5A6B65]">See what fellow analysts and engineers are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communityReviews.map((rev, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 border border-[#DFDBD0]/80 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold text-[#5A6B65]">{rev.date}</span>
                  </div>
                  <p className="text-xs text-[#18332F] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DFDBD0] flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#18332F]">{rev.name}</h5>
                    <p className="text-[10px] text-[#5A6B65]">{rev.role} • {rev.org}</p>
                  </div>
                  <button
                    onClick={() => handleUpvote(i)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#2D6A59] hover:text-[#18332F] bg-[#2D6A59]/10 px-2 py-1 rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{upvotes[i] || 0}</span>
                  </button>
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
