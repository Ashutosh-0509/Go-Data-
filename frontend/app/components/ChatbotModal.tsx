"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Trash2,
  Minimize2,
  Maximize2,
  Database,
  HelpCircle,
  TrendingUp,
  Cpu,
  ShieldCheck
} from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvData?: string | null;
  datasetStats?: any;
}

export default function ChatbotModal({
  isOpen,
  onClose,
  csvData,
  datasetStats,
}: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 **Hello! I'm your Smart Data Analyst Copilot.** I can help you clean datasets, remove outliers, understand AutoML metrics, or run grounded statistical queries on your active dataset. Ask me anything!",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = csvData
    ? [
        "What is the average of numerical columns?",
        "Are there any missing values in this dataset?",
        "Calculate the correlation between key features",
        "Explain the health score of this dataset",
      ]
    : [
        "How do I clean missing data effectively?",
        "What is the difference between Z-Score and IQR outliers?",
        "How does the AutoML model selection work?",
        "What data privacy checks are built into this platform?",
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || input;
    if (!text.trim() || isLoading) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { role: "user", content: text, timestamp: time };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageToSend) setInput("");
    setIsLoading(true);

    try {
      if (csvData) {
        // Query the live FastAPI /api/chat grounded backend
        const formData = new FormData();
        formData.append("csv_data", csvData);
        formData.append("message", text);

        const res = await fetch("/api/chat", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.reply,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        } else {
          throw new Error("Backend query failed");
        }
      } else {
        // Data Analyst Knowledge Assistant (Client-Side Intelligence when no file is uploaded yet)
        await new Promise((resolve) => setTimeout(resolve, 600)); // simulate thoughtful thinking
        let reply = "";
        const lower = text.toLowerCase();

        if (lower.includes("z-score") || lower.includes("iqr") || lower.includes("outlier")) {
          reply =
            "**Z-Score vs. IQR Outlier Detection:**\n\n" +
            "• **Z-Score Method**: Measures how many standard deviations data points deviate from the mean. Values with `|Z| > 3` are flagged as anomalous. Best for Gaussian/normal distributions.\n" +
            "• **IQR (Interquartile Range)**: Computes `Q3 - Q1`. Points `< Q1 - 1.5*IQR` or `> Q3 + 1.5*IQR` are flagged. It is robust against extreme skewness.\n\n" +
            "💡 *Tip:* Our platform allows you to either **Cap** outliers at threshold boundaries or **Remove** them completely!";
        } else if (lower.includes("missing") || lower.includes("clean") || lower.includes("impute")) {
          reply =
            "**Data Imputation Strategies Available:**\n\n" +
            "1. **Mean Imputation**: Fills missing numeric values with the column average (ideal for symmetric distributions).\n" +
            "2. **Median Imputation**: Uses the median value (recommended for skewed numeric distributions).\n" +
            "3. **Mode Imputation**: Fills missing values with the most frequent value (used for categorical/text columns).\n" +
            "4. **Drop Rows**: Removes any row with null values.\n" +
            "5. **Deduplication**: Automatically cleans redundant duplicates with one click.";
        } else if (lower.includes("automl") || lower.includes("model") || lower.includes("machine learning")) {
          reply =
            "**AutoML Pipeline Overview:**\n\n" +
            "• **Classification**: Trains Decision Trees, Random Forests, and Logistic Regression models. Evaluates with accuracy scoring.\n" +
            "• **Regression**: Trains Decision Tree Regressors, Random Forest Regressors, and Linear Regression. Evaluates using R² Score and Mean Squared Error.\n\n" +
            "✨ Upload any dataset to automatically benchmark models and see the Leaderboard ranked by performance!";
        } else if (lower.includes("privacy") || lower.includes("pii") || lower.includes("shield")) {
          reply =
            "**Built-in Data Privacy Shield:**\n\n" +
            "Every uploaded file is actively scanned in-memory using regex filters for PII (Personally Identifiable Information) such as **Email Addresses** and **Phone Numbers**.\n" +
            "We issue warning alerts to protect confidential records before modeling!";
        } else if (lower.includes("health score") || lower.includes("score")) {
          reply =
            "**Dataset Health Score (0-100):**\n\n" +
            "Calculated via:\n`Health Score = 100 - (0.5 × Missing Cell %) - (0.5 × Duplicate Row %)`\n\n" +
            "A score above 90 indicates production-ready data hygiene. Scores below 70 prompt cleaning recommendations.";
        } else {
          reply =
            `**Data Analyst Copilot:** I can guide you through preparing datasets, understanding feature distributions, or deploying AutoML models.\n\n` +
            `👉 *To run live mathematical queries on specific rows and columns, upload a CSV/Excel file or click **'⚡ Demo Data'** in the navigation bar!*`;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Unable to connect to the analysis engine right now. Please ensure the backend is running (`python main.py`), or try a general question!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat history cleared. How can I assist you with your data today?",
        timestamp: "Just now",
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? "inset-4 sm:inset-10"
          : "bottom-4 right-4 w-[95vw] sm:w-[420px] h-[580px] max-h-[90vh]"
      } flex flex-col glass-modal rounded-2xl shadow-2xl border border-[#DFDBD0] overflow-hidden`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#18332F] to-[#2D6A59] px-4 py-3.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-1.5 leading-tight">
              AI Data Copilot
              <span className="text-[10px] bg-emerald-400/20 text-emerald-200 px-1.5 py-0.2 rounded-full border border-emerald-400/30 font-medium">
                {csvData ? "Live Data Connected" : "Data Advisor"}
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/70">
              {csvData ? "Evaluating live pandas operations" : "Ready to assist with ML & EDA"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
            title={isExpanded ? "Collapse window" : "Expand window"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close chatbot"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dataset Status Banner if dataset present */}
      {csvData && datasetStats && (
        <div className="bg-[#EBE7DC] px-4 py-2 border-b border-[#DFDBD0] flex items-center justify-between text-xs text-[#18332F]">
          <div className="flex items-center gap-1.5 font-semibold">
            <Database className="w-3.5 h-3.5 text-[#2D6A59]" />
            Active: {datasetStats.total_rows} rows • {datasetStats.columns?.length} cols
          </div>
          <div className="font-bold text-[#2D6A59]">
            Health: {datasetStats.score}/100
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-[#F3F0E6]/50 to-white/70">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-[#18332F] text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-[#18332F] text-white rounded-br-xs"
                  : "bg-white border border-[#E5E2D9] text-[#18332F] rounded-bl-xs"
              }`}
            >
              <div
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/`(.*?)`/g, "<code class='bg-[#DFDBD0]/50 px-1 py-0.5 rounded text-xs font-mono text-[#2D6A59]'>$1</code>")
                    .replace(/\n/g, "<br />"),
                }}
              />
              <div
                className={`text-[10px] mt-1 text-right ${
                  msg.role === "user" ? "text-white/60" : "text-[#5A6B65]"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-[#5A6B65]">
            <div className="w-7 h-7 rounded-lg bg-[#18332F] text-emerald-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-white border border-[#E5E2D9] rounded-2xl px-4 py-2.5 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2D6A59] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#2D6A59] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#2D6A59] animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[#18332F] font-medium">Analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-3 pt-2 pb-1 bg-white/90 border-t border-[#DFDBD0] overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 pb-1">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap bg-[#EBE7DC] hover:bg-[#DFDBD0] text-[#18332F] px-2.5 py-1 rounded-full border border-[#DFDBD0] font-medium transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#DFDBD0] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            csvData
              ? "Ask to compute correlations, means, missing values..."
              : "Ask about data cleaning, AutoML algorithms, outlier capping..."
          }
          disabled={isLoading}
          className="flex-1 bg-[#F3F0E6]/60 border border-[#DFDBD0] focus:border-[#2D6A59] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#18332F] placeholder-[#5A6B65] outline-none transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-[#18332F] hover:bg-[#2D6A59] disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
