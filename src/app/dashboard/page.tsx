"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function DashboardPage() {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results && bentoRef.current) {
      gsap.fromTo(
        bentoRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: "power4.out" }
      );
    }
  }, [results]);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch("/api/gemini/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setResults(data);
    } catch (e) {
      console.error(e);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 bg-black text-[#F5F5F7] relative overflow-hidden">
      <div className="absolute top-[30%] left-[5%] w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        <header>
          <h1 className="text-4xl md:text-[52px] font-semibold tracking-tighter leading-tight">Career Intelligence</h1>
          <p className="text-[#86868B] text-lg font-medium mt-2">Provide context to generate your personalized path.</p>
        </header>

        {!results && (
          <section className="p-8 md:p-10 border border-white/10 bg-white/[0.02] rounded-[32px] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-semibold mb-6">Resume Parsing</h2>
            
            <div className="mb-6 relative group">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  setIsAnalyzing(true);
                  try {
                    // Dynamically import pdfjs to avoid SSR issues
                    const pdfjsLib = await import('pdfjs-dist');
                    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let fullText = "";
                    
                    for (let i = 1; i <= pdf.numPages; i++) {
                      const page = await pdf.getPage(i);
                      const textContent = await page.getTextContent();
                      const pageText = textContent.items.map((item: any) => item.str).join(" ");
                      fullText += pageText + "\n";
                    }
                    
                    setResumeText(fullText.trim());
                  } catch (err) {
                    console.error("PDF Parsing error:", err);
                    alert("Failed to parse PDF. Please paste text instead.");
                  } finally {
                    setIsAnalyzing(false);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="w-full h-32 bg-white/[0.03] border-2 border-dashed border-white/20 group-hover:border-white/40 group-hover:bg-white/[0.05] rounded-2xl flex flex-col items-center justify-center transition-all">
                <svg className="w-8 h-8 text-[#86868B] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-[15px] font-medium text-[#F5F5F7]">Click or drag PDF to upload</p>
                <p className="text-xs text-[#86868B] mt-1">Extracts text automatically</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="text-xs font-medium text-[#86868B] uppercase tracking-widest">OR PASTE TEXT</span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your raw resume text here if PDF upload fails..."
              className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-[15px] text-[#F5F5F7] placeholder-[#86868B] focus:outline-none focus:border-white/30 transition-colors resize-none mb-8"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText}
              className="w-full md:w-auto px-8 py-4 bg-[#F5F5F7] text-black font-semibold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
            >
              {isAnalyzing && (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              )}
              {isAnalyzing ? "Processing..." : "Generate Analysis"}
            </button>
          </section>
        )}

        {results && (
          <section ref={bentoRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
            {/* Bento Box 1 */}
            <div className="col-span-1 md:col-span-2 p-8 md:p-10 border border-white/10 bg-white/[0.02] rounded-[32px] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col justify-between">
              <div>
                <h3 className="text-[#86868B] text-xs font-semibold uppercase tracking-widest mb-3">Assessment</h3>
                <p className="text-4xl font-semibold tracking-tight">{results.current_level} Candidate</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {results.key_strengths?.map((s: string) => (
                  <span key={s} className="px-4 py-2 bg-white/[0.05] rounded-full text-sm font-medium">{s}</span>
                ))}
              </div>
            </div>

            {/* Bento Box 2 */}
            <div className="col-span-1 p-8 md:p-10 border border-white/10 bg-white/[0.02] rounded-[32px] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
              <h3 className="text-[#86868B] text-xs font-semibold uppercase tracking-widest mb-5">Skill Gaps</h3>
              <ul className="space-y-4">
                {results.skill_gaps?.map((g: string) => (
                  <li key={g} className="flex items-start gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <span className="text-[#D2D2D7] leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bento Box 3 */}
            <div className="col-span-1 p-8 md:p-10 border border-white/10 bg-white/[0.02] rounded-[32px] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden">
              <h3 className="text-[#86868B] text-xs font-semibold uppercase tracking-widest mb-5">Target Roles</h3>
              <ul className="space-y-4">
                {results.recommended_roles?.map((r: string) => (
                  <li key={r} className="text-lg font-medium text-[#F5F5F7] pb-4 border-b border-white/10 last:border-0">{r}</li>
                ))}
              </ul>
            </div>

            {/* Bento Box 4 */}
            <div className="col-span-1 md:col-span-2 p-8 md:p-10 border border-white/10 bg-white/[0.02] rounded-[32px] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col">
              <h3 className="text-[#86868B] text-xs font-semibold uppercase tracking-widest mb-6">Action Plan</h3>
              <div className="space-y-5 overflow-y-auto pr-4 scrollbar-thin">
                {results.action_plan?.map((a: string, i: number) => (
                  <div key={i} className="flex gap-5">
                    <span className="text-[#86868B] font-mono text-sm shrink-0 pt-0.5">0{i+1}</span>
                    <p className="text-[15px] font-medium text-[#D2D2D7] leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
