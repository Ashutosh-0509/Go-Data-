"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeader from "../components/SectionHeader";
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
  ThumbsUp,
  Bug,
  Lightbulb,
  ShieldCheck
} from "lucide-react";

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState("Feature Request");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [upvotes, setUpvotes] = useState<Record<number, number>>({ 0: 24, 1: 18, 2: 12 });

  const feedbackTypes = [
    { label: "Feature Request", icon: Lightbulb },
    { label: "Bug Report", icon: Bug },
    { label: "Platform Performance", icon: ShieldCheck },
    { label: "General Feedback", icon: MessageSquare },
  ];

  const communityReviews = [
    {
      name: "Dr. Ethan Wright",
      role: "Quantitative Analyst",
      org: "Apex Financial Analytics",
      rating: 5,
      type: "Platform Performance",
      date: "2 days ago",
      comment:
        "The automated Z-Score and Tukey IQR outlier treatments saved our team hours on monthly reconciliation. The grounded chat engine running real pandas operations is completely dependable for senior reviewers.",
    },
    {
      name: "Sophia Martinez",
      role: "Lead Data Scientist",
      org: "CloudBio Informatics",
      rating: 5,
      type: "Feature Request",
      date: "4 days ago",
      comment:
        "The instant correlation heatmap and 5-fold cross-validated AutoML leaderboard provide instant clarity on feature relationships. Would love to see support for Time-Series forecasting in a future release.",
    },
    {
      name: "Arjun Mehta",
      role: "Analytics Engineer",
      org: "FinScale Labs",
      rating: 5,
      type: "Platform Performance",
      date: "1 week ago",
      comment:
        "The in-memory privacy scan flagged unmasked email records before training commenced. Zero disk persistence makes this compliant with our internal governance standards.",
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SectionHeader
          eyebrow="Community & Governance"
          title="User Feedback & Feature Requests"
          description="Submit suggestions, report statistical anomalies, or request additional data transformations and model algorithms."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Form */}
          <div className="lg:col-span-1 enterprise-card p-6 bg-white space-y-4">
            <h3 className="text-sm font-bold text-[#0B1220]">
              Submit Feedback
            </h3>

            {submitted ? (
              <div className="p-4 rounded-md bg-[#F0FDF4] border border-[#BBF7D0] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-[#16A34A]">
                  <CheckCircle2 className="w-4 h-4" />
                  Feedback Logged
                </div>
                <p className="text-[#475569] leading-relaxed">
                  Thank you for contributing. Your technical feedback has been registered for review by the platform team.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setComments("");
                  }}
                  className="mt-2 text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Submit Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">
                    Feedback Category
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {feedbackTypes.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => setFeedbackType(t.label)}
                        className={`p-2 rounded border text-left flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          feedbackType === t.label
                            ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
                            : "bg-[#F8FAFC] border-[#CBD5E1] text-[#475569] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">
                    Platform Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 text-[#CBD5E1] hover:text-[#D97706] transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            s <= rating ? "fill-[#D97706] text-[#D97706]" : ""
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#64748B] ml-2 font-mono">{rating}/5</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">
                    Your Details (Optional)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Name / Role"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                    <input
                      type="email"
                      placeholder="Corporate Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F172A] mb-1">
                    Technical Comments / Proposal
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe specific dataset workflows, edge cases, or enhancements..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Note</span>
                </button>
              </form>
            )}
          </div>

          {/* Community Reviews Feed */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-bold text-[#0B1220]">
                User Notes & Observations
              </h3>
              <span className="text-xs text-[#64748B] font-mono">
                {communityReviews.length} verified submissions
              </span>
            </div>

            <div className="space-y-3">
              {communityReviews.map((rev, idx) => (
                <div key={idx} className="enterprise-card p-4 space-y-2 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-xs text-[#0B1220]">
                        {rev.name}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
                        {rev.role} • {rev.org}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#D97706]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#D97706]" />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#94A3B8] font-mono">{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium">
                      {rev.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpvote(idx)}
                      className="inline-flex items-center gap-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{upvotes[idx] || 0} agreed</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
