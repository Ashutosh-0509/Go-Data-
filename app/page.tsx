"use client";

import { useState, useEffect } from "react";
import { Inter, Merriweather } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const merriweather = Merriweather({ weight: ["300", "400", "700", "900"], subsets: ["latin"] });

export default function Home() {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [loading, setLoading] = useState(false);
  
  // Cleaning State
  const [cleaningStrategy, setCleaningStrategy] = useState("Mean");
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  // Outlier State
  const [outlierMethod, setOutlierMethod] = useState("Z-score");
  const [outlierAction, setOutlierAction] = useState("Cap");

  // EDA State
  const [edaColumn, setEdaColumn] = useState("");
  const [edaData, setEdaData] = useState<any>(null);

  // ML State
  const [mlTarget, setMlTarget] = useState("");
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [taskType, setTaskType] = useState("");

  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setCsvData(data.csv_data);
        setStats(data.stats);
        if (data.stats.numeric_cols?.length > 0) {
            setEdaColumn(data.stats.numeric_cols[0]);
        }
        if (data.stats.columns?.length > 0) {
            setMlTarget(data.stats.columns[data.stats.columns.length - 1]);
        }
      } else {
        alert("Error: " + data.detail);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleClean = async () => {
    if (!csvData) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("csv_data", csvData);
    formData.append("strategy", cleaningStrategy);
    formData.append("remove_duplicates", removeDuplicates.toString());

    try {
      const res = await fetch("/api/clean", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setCsvData(data.csv_data);
        setStats(data.stats);
        alert("Data cleaned successfully!");
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleOutliers = async () => {
    if (!csvData) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("csv_data", csvData);
    formData.append("method", outlierMethod);
    formData.append("action", outlierAction);

    try {
      const res = await fetch("/api/outliers", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setCsvData(data.csv_data);
        setStats(data.stats);
        alert("Outliers handled successfully!");
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleTrainML = async () => {
    if (!csvData) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("csv_data", csvData);
    formData.append("target", mlTarget);

    try {
      const res = await fetch("/api/train", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setLeaderboard(data.leaderboard);
        setTaskType(data.task_type);
      } else {
        alert("Error: " + data.detail);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvData || !chatMessage.trim()) return;
    
    const newHistory = [...chatHistory, {role: "user", content: chatMessage}];
    setChatHistory(newHistory);
    setChatMessage("");
    setLoading(true);
    
    const formData = new FormData();
    formData.append("csv_data", csvData);
    formData.append("message", chatMessage);

    try {
      const res = await fetch("/api/chat", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setChatHistory([...newHistory, {role: "agent", content: data.reply}]);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "eda" && csvData && edaColumn) {
        fetchEda();
    }
  }, [activeTab, edaColumn]);

  const fetchEda = async () => {
    if (!csvData) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("csv_data", csvData);
    formData.append("column", edaColumn);
    try {
      const res = await fetch("/api/eda", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setEdaData(data);
    } catch (err) {}
    setLoading(false);
  };

  if (!csvData) {
    return (
      <div className={`min-h-screen bg-[#F3F0E6] flex flex-col items-center justify-center p-8 ${inter.className}`}>
        <nav className="fixed top-0 w-full bg-[#EBE7DC] border-b border-[#DFDBD0] px-8 py-4 z-50 flex justify-between items-center">
            <div className={`text-xl font-bold text-[#18332F] ${merriweather.className}`}>Smart Data Analyst</div>
            <div className="text-sm font-semibold text-[#5A6B65]">AutoML Platform</div>
        </nav>
        <div className="max-w-4xl w-full mt-20">
          <div className="mb-12">
            <h4 className="text-[#2D6A59] font-bold uppercase tracking-widest text-sm mb-2">Private Dataset Recovery</h4>
            <h1 className="text-6xl font-extrabold text-[#18332F] leading-tight mb-2">Automate your data pipeline.</h1>
            <h1 className={`text-6xl font-medium text-[#2D6A59] italic leading-tight mb-6 ${merriweather.className}`}>Clean, visualize, and train models.</h1>
            <p className="text-[#5A6B65] text-lg max-w-2xl">
              Smart Data Analyst automates cleaning, outlier handling, interactive EDA, and Machine Learning. 
              Upload your dataset to begin the pipeline.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-[#E5E2D9]">
            <h2 className="text-3xl font-bold text-[#18332F] mb-4">Start Analysis</h2>
            <p className="text-[#5A6B65] mb-8">Choose a CSV or Excel dataset. All processing runs securely in memory.</p>
            
            <label className="bg-[#18332F] text-white px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#2D6A59] transition-colors inline-block">
              {loading ? "Uploading..." : "Upload dataset"}
              <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={loading} />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F3F0E6] flex flex-col ${inter.className}`}>
      
      {/* Top Navbar */}
      <nav className="sticky top-0 w-full bg-[#EBE7DC] border-b border-[#DFDBD0] px-6 py-3 z-50 flex justify-between items-center shadow-sm">
        <div className={`text-xl font-bold text-[#18332F] ${merriweather.className}`}>Smart Data Analyst</div>
        <div className="flex gap-4">
            <button onClick={() => setCsvData(null)} className="text-sm font-semibold text-[#5A6B65] hover:text-[#18332F]">Reset Project</button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#EBE7DC] border-r border-[#DFDBD0] p-6 flex flex-col overflow-y-auto">
          <div className="text-xs font-bold text-[#5A6B65] uppercase tracking-wider mb-4">Pipeline Stages</div>
          <div className="flex flex-col gap-2 flex-grow">
            <button onClick={() => setActiveTab("preview")} className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'preview' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>1. Data Preview</button>
            <button onClick={() => setActiveTab("cleaning")} className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'cleaning' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>2. Cleaning</button>
            <button onClick={() => setActiveTab("outliers")} className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'outliers' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>3. Outliers</button>
            <button onClick={() => setActiveTab("eda")} className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'eda' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>4. Auto EDA</button>
            <button onClick={() => setActiveTab("ml")} className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'ml' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>5. ML Leaderboard</button>
            <button onClick={() => setActiveTab("chat")} className={`text-left px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'chat' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>6. Gemini Agent</button>
          </div>
          
          <div className="mt-8 bg-white p-4 rounded-xl shadow-sm border border-[#DFDBD0]">
            <div className="text-sm text-[#5A6B65] font-semibold mb-1">Health Score</div>
            <div className="text-3xl font-bold text-[#2D6A59]">{stats?.score}/100</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto relative">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E5E2D9] p-8 min-h-[80vh] relative">
            
            {loading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
                <div className="text-xl font-bold text-[#18332F] animate-pulse">Processing...</div>
                </div>
            )}

            {activeTab === "preview" && (
                <div>
                <h2 className="text-2xl font-bold text-[#18332F] border-b-2 border-[#18332F] pb-2 mb-6">Dataset Profile</h2>
                
                {stats?.privacy_flags?.length > 0 && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <h3 className="text-red-800 font-bold mb-1">🚨 Privacy Auto-Detector Warning</h3>
                        <p className="text-red-700 text-sm mb-2">Potential sensitive PII data detected in the following columns:</p>
                        <ul className="list-disc pl-5 text-sm text-red-700">
                            {stats.privacy_flags.map((flag: any, i: number) => (
                                <li key={i}><strong>{flag.column}</strong> appears to contain <em>{flag.type}</em></li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-8 mb-8">
                    <div className="bg-[#F8EDD8] p-4 rounded-xl flex-1 border border-[#E5E2D9]">
                    <div className="text-sm font-semibold text-[#5A6B65]">Total Rows</div>
                    <div className="text-2xl font-bold text-[#18332F]">{stats?.total_rows}</div>
                    </div>
                    <div className="bg-[#F8EDD8] p-4 rounded-xl flex-1 border border-[#E5E2D9]">
                    <div className="text-sm font-semibold text-[#5A6B65]">Total Columns</div>
                    <div className="text-2xl font-bold text-[#18332F]">{stats?.columns.length}</div>
                    </div>
                    <div className="bg-[#F8EDD8] p-4 rounded-xl flex-1 border border-[#E5E2D9]">
                    <div className="text-sm font-semibold text-[#5A6B65]">Missing Cells</div>
                    <div className="text-2xl font-bold text-[#18332F]">{stats?.missing_cells} ({stats?.missing_pct}%)</div>
                    </div>
                </div>
                
                <h3 className="text-lg font-bold text-[#18332F] mb-4">Data Preview (Top 20 rows)</h3>
                <div className="overflow-x-auto rounded-xl border border-[#DFDBD0]">
                    <table className="w-full text-sm text-left">
                    <thead className="bg-[#EBE7DC] text-[#18332F] font-bold">
                        <tr>
                        {stats?.columns.map((c: string) => <th key={c} className="px-4 py-3 whitespace-nowrap">{c}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {stats?.preview.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-[#DFDBD0] hover:bg-gray-50">
                            {stats?.columns.map((c: string) => <td key={c} className="px-4 py-2 whitespace-nowrap text-[#5A6B65]">{row[c]}</td>)}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}

            {activeTab === "cleaning" && (
                <div>
                <h2 className="text-2xl font-bold text-[#18332F] border-b-2 border-[#18332F] pb-2 mb-6">Data Cleaning</h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                    <label className="block text-sm font-bold text-[#18332F] mb-2">Missing Value Imputation Strategy</label>
                    <select value={cleaningStrategy} onChange={e => setCleaningStrategy(e.target.value)} className="w-full p-3 border border-[#DFDBD0] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2D6A59]">
                        <option value="Mean">Mean (Numeric) / Mode (Categorical)</option>
                        <option value="Median">Median (Numeric) / Mode (Categorical)</option>
                        <option value="Drop rows">Drop Rows with Missing Values</option>
                    </select>
                    </div>
                    <div className="flex items-center pt-6">
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={removeDuplicates} onChange={e => setRemoveDuplicates(e.target.checked)} className="w-5 h-5 rounded border-[#DFDBD0]" />
                        <span className="ml-3 text-[#18332F] font-medium">Remove Duplicate Rows</span>
                    </label>
                    </div>
                </div>
                <button onClick={handleClean} className="mt-8 bg-[#18332F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2D6A59] transition-colors">Apply Cleaning Pipeline</button>
                </div>
            )}

            {activeTab === "outliers" && (
                <div>
                <h2 className="text-2xl font-bold text-[#18332F] border-b-2 border-[#18332F] pb-2 mb-6">Statistical Outlier Handling</h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                    <label className="block text-sm font-bold text-[#18332F] mb-2">Detection Methodology</label>
                    <select value={outlierMethod} onChange={e => setOutlierMethod(e.target.value)} className="w-full p-3 border border-[#DFDBD0] rounded-lg bg-gray-50 focus:outline-none">
                        <option value="Z-score">Z-score (Threshold &gt; 3 std)</option>
                        <option value="IQR">IQR (1.5x Interquartile Range)</option>
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-bold text-[#18332F] mb-2">Action to Take</label>
                    <select value={outlierAction} onChange={e => setOutlierAction(e.target.value)} className="w-full p-3 border border-[#DFDBD0] rounded-lg bg-gray-50 focus:outline-none">
                        <option value="Cap">Cap Values (Winsorization)</option>
                        <option value="Remove">Remove Entire Rows</option>
                    </select>
                    </div>
                </div>
                <button onClick={handleOutliers} className="mt-8 bg-[#18332F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2D6A59] transition-colors">Execute Outlier Operations</button>
                </div>
            )}

            {activeTab === "eda" && (
                <div>
                <h2 className="text-2xl font-bold text-[#18332F] border-b-2 border-[#18332F] pb-2 mb-6">Exploratory Data Analysis</h2>
                
                <div className="mb-8">
                    <label className="block text-sm font-bold text-[#18332F] mb-2">Select Feature for Distribution Plot</label>
                    <select value={edaColumn} onChange={e => setEdaColumn(e.target.value)} className="w-1/2 p-3 border border-[#DFDBD0] rounded-lg bg-gray-50 focus:outline-none">
                    {stats?.numeric_cols.map((col: string) => (
                        <option key={col} value={col}>{col}</option>
                    ))}
                    </select>
                </div>

                {edaData?.histogram && (
                    <div className="mb-12">
                    <h3 className="text-lg font-bold text-[#18332F] mb-4">Histogram of {edaColumn}</h3>
                    <div className="h-64 flex items-end gap-1 border-b-2 border-l-2 border-[#DFDBD0] pb-2 pl-2">
                        {edaData.histogram.map((h: any, i: number) => {
                        const maxCount = Math.max(...edaData.histogram.map((d: any) => d.count));
                        const height = maxCount === 0 ? 0 : (h.count / maxCount) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center group relative">
                            <div 
                                className="w-full bg-[#2D6A59] hover:bg-[#18332F] transition-all rounded-t-sm" 
                                style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0' }}
                            >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#18332F] text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20">
                                    {h.bin}: {h.count}
                                </div>
                            </div>
                            </div>
                        )
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-[#5A6B65] mt-2 px-2">
                        <span>{edaData.histogram[0]?.bin.split('-')[0]}</span>
                        <span>{edaData.histogram[edaData.histogram.length-1]?.bin.split('-')[1]}</span>
                    </div>
                    </div>
                )}

                {edaData?.correlation && (
                    <div>
                    <h3 className="text-lg font-bold text-[#18332F] mb-4">Correlation Matrix Heatmap</h3>
                    <div className="overflow-x-auto rounded-xl border border-[#DFDBD0]">
                        <table className="w-full text-xs text-center">
                        <thead>
                            <tr>
                            <th className="p-2 bg-[#EBE7DC]"></th>
                            {edaData.numeric_cols.map((col: string) => <th key={col} className="p-2 bg-[#EBE7DC] font-bold text-[#18332F] max-w-[100px] truncate" title={col}>{col}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {edaData.numeric_cols.map((rowCol: string) => (
                            <tr key={rowCol}>
                                <th className="p-2 bg-[#EBE7DC] font-bold text-[#18332F] text-left max-w-[100px] truncate" title={rowCol}>{rowCol}</th>
                                {edaData.numeric_cols.map((col: string) => {
                                const val = edaData.correlation[rowCol][col];
                                const intensity = Math.abs(val);
                                const color = val > 0 ? `rgba(45, 106, 89, ${intensity})` : `rgba(200, 50, 50, ${intensity})`;
                                const textColor = intensity > 0.5 ? 'white' : 'black';
                                return (
                                    <td key={col} className="p-2 border border-[#DFDBD0]" style={{ backgroundColor: color, color: textColor }}>
                                    {val.toFixed(2)}
                                    </td>
                                )
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

            {activeTab === "ml" && (
                <div>
                <h2 className="text-2xl font-bold text-[#18332F] border-b-2 border-[#18332F] pb-2 mb-6">AutoML Leaderboard</h2>
                
                <div className="bg-[#F8EDD8] p-6 rounded-xl border border-[#E5E2D9] mb-8">
                    <label className="block text-sm font-bold text-[#18332F] mb-2">Select Target Variable (Y)</label>
                    <div className="flex gap-4">
                        <select value={mlTarget} onChange={e => setMlTarget(e.target.value)} className="w-1/2 p-3 border border-[#DFDBD0] rounded-lg bg-white focus:outline-none">
                        {stats?.columns.map((col: string) => (
                            <option key={col} value={col}>{col}</option>
                        ))}
                        </select>
                        <button onClick={handleTrainML} className="bg-[#18332F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2D6A59] transition-colors">
                            Train Models
                        </button>
                    </div>
                    <p className="text-sm text-[#5A6B65] mt-2">The system will auto-detect Classification vs. Regression based on your target.</p>
                </div>

                {leaderboard && (
                    <div>
                        <h3 className="text-lg font-bold text-[#18332F] mb-2">Results: {taskType}</h3>
                        <div className="overflow-x-auto rounded-xl border border-[#DFDBD0]">
                            <table className="w-full text-sm text-left">
                            <thead className="bg-[#EBE7DC] text-[#18332F] font-bold">
                                <tr>
                                    <th className="px-4 py-3">Rank</th>
                                    <th className="px-4 py-3">Algorithm</th>
                                    <th className="px-4 py-3">Metric ({leaderboard[0]?.metric})</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((row: any, i: number) => (
                                <tr key={i} className="border-b border-[#DFDBD0] hover:bg-gray-50">
                                    <td className="px-4 py-3 font-bold text-[#18332F]">#{i+1}</td>
                                    <td className="px-4 py-3 text-[#5A6B65] font-semibold">{row.model}</td>
                                    <td className="px-4 py-3 text-[#2D6A59] font-bold">{row.score}</td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
                )}
                </div>
            )}

            {activeTab === "chat" && (
                <div className="flex flex-col h-full min-h-[60vh]">
                <h2 className="text-2xl font-bold text-[#18332F] border-b-2 border-[#18332F] pb-2 mb-6">Grounded Gemini Agent</h2>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                    <h3 className="text-blue-800 font-bold mb-1">Tool-Calling Architecture</h3>
                    <p className="text-blue-700 text-sm">Unlike standard chatbots that hallucinate numbers, this agent executes real Pandas code on your backend. Try asking: <br/><i>"What is the correlation between [Col1] and [Col2]?"</i> or <i>"Find missing values."</i></p>
                </div>

                <div className="flex-1 bg-[#F8EDD8] rounded-xl p-4 mb-4 overflow-y-auto max-h-[400px] border border-[#E5E2D9]">
                    {chatHistory.length === 0 ? (
                        <div className="text-center text-[#5A6B65] mt-10 italic">Start chatting with your data...</div>
                    ) : (
                        chatHistory.map((msg, i) => (
                            <div key={i} className={`mb-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                                <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-[#18332F] text-white rounded-br-none' : 'bg-white border border-[#DFDBD0] text-[#18332F] rounded-bl-none'}`}>
                                    <span dangerouslySetInnerHTML={{__html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleChat} className="flex gap-2">
                    <input 
                        type="text" 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask a question about your dataset (e.g., 'What is the average of age?')"
                        className="flex-1 p-3 border border-[#DFDBD0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A59]"
                    />
                    <button type="submit" className="bg-[#18332F] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2D6A59] transition-colors">
                        Ask Agent
                    </button>
                </form>
                </div>
            )}

            </div>
        </div>
      </div>
    </div>
  );
}
