"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Trash2,
  FileSpreadsheet,
  Loader2,
  Terminal
} from "lucide-react";
import { apiClient, DatasetStats } from "../config/api";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvData?: string | null;
  datasetName?: string;
  datasetStats?: DatasetStats | null;
}

export default function ChatbotModal({
  isOpen,
  onClose,
  csvData,
  datasetName = "dataset.csv",
}: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Data Copilot ready. I run direct, code-grounded statistical queries on your active dataset in memory. What would you like to investigate?",
      timestamp: "Ready",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
        // Query FastAPI /api/chat grounded backend
        const res = await apiClient.chat(csvData, text);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        // Explanatory response when no dataset is loaded
        let reply = "Please upload a dataset or try the demo dataset to run grounded calculations against active data.";
        const lower = text.toLowerCase();
        if (lower.includes("clean")) {
          reply = "Data cleaning offers three strategies: Mean imputation (fills nulls with column average), Median imputation (less sensitive to outliers), or Drop Rows (removes rows with missing values).";
        } else if (lower.includes("outlier") || lower.includes("z-score") || lower.includes("iqr")) {
          reply = "Z-Score detects values > 3 standard deviations from the mean (best for normal distributions). IQR (Tukey) defines boundaries as Q1 - 1.5*IQR and Q3 + 1.5*IQR (best for skewed data). Both support Cap or Remove actions.";
        } else if (lower.includes("model") || lower.includes("automl")) {
          reply = "The platform benchmarks Random Forests, Decision Trees, and Linear/Logistic models using 5-fold cross-validation. Negative R² values are preserved as-is to reflect true model fit.";
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
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Server unreachable";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Query evaluation could not be completed: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1220]/50 backdrop-blur-xs flex items-center justify-end">
      <div className="w-full max-w-md h-full bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Panel Header */}
        <div className="px-4 py-3 bg-[#0B1220] text-white flex items-center justify-between border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#2563EB] flex items-center justify-center text-white">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight">Data Copilot</div>
              <div className="text-[10px] text-[#94A3B8] font-mono flex items-center gap-1">
                <FileSpreadsheet className="w-2.5 h-2.5 text-[#38BDF8]" />
                <span className="truncate max-w-[150px]">{csvData ? datasetName : "No dataset loaded"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    role: "assistant",
                    content: "History cleared. Enter a statistical query on the active dataset.",
                    timestamp: "Cleared",
                  },
                ])
              }
              title="Clear history"
              className="p-1.5 rounded hover:bg-[#1E293B] text-[#94A3B8] hover:text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#1E293B] text-[#94A3B8] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#64748B] flex-shrink-0 font-medium">Queries:</span>
          {quickPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="px-2 py-1 bg-white border border-[#CBD5E1] rounded text-[#0F172A] hover:bg-[#F1F5F9] transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-lg leading-relaxed ${
                    isUser
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] text-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
              <span>Evaluating query against active dataset memory…</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#E2E8F0] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={csvData ? "Ask about means, nulls, correlations, health…" : "Ask about data cleaning or algorithms…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white rounded-md transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1.5 px-0.5">
            <span>Direct Pandas evaluation</span>
            <span className="font-mono">In-Memory Sandbox</span>
          </div>
        </div>
      </div>
    </div>
  );
}
