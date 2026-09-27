"use client";

import { useState } from "react";

export default function Home() {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("preview");
  const [loading, setLoading] = useState(false);
  const [cleaningStrategy, setCleaningStrategy] = useState("Mean");
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCsvData(data.csv_data);
        setStats(data.stats);
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
      const res = await fetch("/api/clean", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCsvData(data.csv_data);
        setStats(data.stats);
        alert("Data cleaned successfully!");
      } else {
        alert("Error: " + data.detail);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!csvData) {
    return (
      <div className="min-h-screen bg-[#F3F0E6] flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <div className="mb-12">
            <h4 className="text-[#2D6A59] font-bold uppercase tracking-widest text-sm mb-2">Private Dataset Recovery</h4>
            <h1 className="text-6xl font-extrabold text-[#18332F] leading-tight mb-2">Repair a corrupted dataset.</h1>
            <h1 className="text-6xl font-medium text-[#2D6A59] italic font-serif leading-tight mb-6">Recover the files that survived.</h1>
            <p className="text-[#5A6B65] text-lg max-w-2xl">
              Smart Data Analyst reads surviving entry records, extracts available data, and rebuilds a clean dataset while preserving the source.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-[#E5E2D9]">
            <h2 className="text-3xl font-bold text-[#18332F] mb-4">Check files you care about.</h2>
            <p className="text-[#5A6B65] mb-8">Choose a dataset. Smart Data Analyst checks them privately, then shows you which ones may need attention.</p>
            
            <div className="flex gap-4 items-center">
              <label className="bg-[#18332F] text-white px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#2D6A59] transition-colors">
                {loading ? "Uploading..." : "Upload dataset"}
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={loading} />
              </label>
            </div>
            
            <div className="flex gap-12 mt-8 pt-6 border-t border-[#E5E2D9] text-sm text-[#5A6B65]">
              <div><span className="text-[#2D6A59] mr-2">✓</span>Nothing is uploaded to external servers</div>
              <div><span className="text-[#2D6A59] mr-2">✓</span>Original is left untouched</div>
              <div><span className="text-[#2D6A59] mr-2">✓</span>Handles missing data</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex">
      <div className="w-64 bg-[#EBE7DC] border-r border-[#DFDBD0] p-6 flex flex-col h-screen sticky top-0">
        <h2 className="text-xl font-bold text-[#18332F] mb-8">Smart Data Analyst</h2>
        
        <div className="flex flex-col gap-2 flex-grow">
          <button onClick={() => setActiveTab("preview")} className={`text-left px-4 py-2 rounded-lg font-medium ${activeTab === 'preview' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>Preview</button>
          <button onClick={() => setActiveTab("cleaning")} className={`text-left px-4 py-2 rounded-lg font-medium ${activeTab === 'cleaning' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>Cleaning</button>
          <button onClick={() => setActiveTab("outliers")} className={`text-left px-4 py-2 rounded-lg font-medium ${activeTab === 'outliers' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>Outliers</button>
          <button onClick={() => setActiveTab("eda")} className={`text-left px-4 py-2 rounded-lg font-medium ${activeTab === 'eda' ? 'bg-[#18332F] text-white' : 'text-[#18332F] hover:bg-[#DFDBD0]'}`}>EDA</button>
        </div>
        
        <div className="mt-auto bg-white p-4 rounded-xl shadow-sm border border-[#DFDBD0]">
          <div className="text-sm text-[#5A6B65] font-semibold mb-1">Health Score</div>
          <div className="text-3xl font-bold text-[#2D6A59]">{stats?.score}/100</div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E5E2D9] p-8 min-h-[80vh]">
          
          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl z-10">
              <div className="text-xl font-bold text-[#18332F]">Processing...</div>
            </div>
          )}

          {activeTab === "preview" && (
            <div>
              <h2 className="text-2xl font-bold text-[#18332F] border-b-2 border-[#18332F] pb-2 mb-6">Dataset Preview</h2>
              <div className="flex gap-8 mb-8">
                <div className="bg-[#F8EDD8] p-4 rounded-xl flex-1">
                  <div className="text-sm font-semibold text-[#5A6B65]">Rows</div>
                  <div className="text-2xl font-bold text-[#18332F]">{stats?.total_rows}</div>
                </div>
                <div className="bg-[#F8EDD8] p-4 rounded-xl flex-1">
                  <div className="text-sm font-semibold text-[#5A6B65]">Columns</div>
                  <div className="text-2xl font-bold text-[#18332F]">{stats?.columns.length}</div>
                </div>
                <div className="bg-[#F8EDD8] p-4 rounded-xl flex-1">
                  <div className="text-sm font-semibold text-[#5A6B65]">Missing Values</div>
                  <div className="text-2xl font-bold text-[#18332F]">{stats?.missing_cells}</div>
                </div>
              </div>
              
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
                  <label className="block text-sm font-bold text-[#18332F] mb-2">Missing Value Strategy</label>
                  <select 
                    value={cleaningStrategy} 
                    onChange={e => setCleaningStrategy(e.target.value)}
                    className="w-full p-3 border border-[#DFDBD0] rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#2D6A59]"
                  >
                    <option value="Mean">Mean (Numeric) / Mode (Categorical)</option>
                    <option value="Median">Median (Numeric) / Mode (Categorical)</option>
                    <option value="Mode">Mode (All Columns)</option>
                    <option value="Drop rows">Drop Rows with Missing Values</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={removeDuplicates} 
                      onChange={e => setRemoveDuplicates(e.target.checked)}
                      className="w-5 h-5 rounded border-[#DFDBD0] text-[#18332F] focus:ring-[#2D6A59]"
                    />
                    <span className="ml-3 text-[#18332F] font-medium">Remove Duplicate Rows</span>
                  </label>
                </div>
              </div>
              
              <button 
                onClick={handleClean}
                className="mt-8 bg-[#18332F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2D6A59] transition-colors"
              >
                Apply Cleaning
              </button>
            </div>
          )}
          
          {(activeTab === "outliers" || activeTab === "eda") && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-[#18332F] mb-4">{activeTab === "outliers" ? "Outlier Detection" : "Exploratory Data Analysis"}</h3>
              <p className="text-[#5A6B65]">This section is under construction in the new Next.js architecture.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
