"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const MOCK_JOBS = [
  { id: 1, title: "Frontend Engineer", company: "TechNova", match: 94, type: "Full-time" },
  { id: 2, title: "React Developer", company: "StartUp Inc", match: 88, type: "Internship" },
  { id: 3, title: "UI/UX Engineer", company: "Designify", match: 82, type: "Contract" },
  { id: 4, title: "Fullstack Developer", company: "GlobalCorp", match: 75, type: "Full-time" },
];

export default function JobsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".job-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power4.out" }
    );
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 bg-black text-[#F5F5F7] relative overflow-hidden" ref={containerRef}>
      <div className="absolute top-[20%] right-[15%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-14">
          <h1 className="text-4xl md:text-[52px] font-semibold tracking-tighter leading-tight">Matched Opportunities</h1>
          <p className="text-[#86868B] text-lg font-medium mt-2">Curated based on your parsed capabilities.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_JOBS.map((job) => (
            <div 
              key={job.id} 
              className="job-card p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] rounded-[24px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">{job.title}</h2>
                  <p className="text-[#86868B] font-medium mt-1">{job.company}</p>
                </div>
                <div className="px-4 py-1.5 bg-white/[0.05] border border-white/10 rounded-full text-sm font-semibold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  {job.match}% Match
                </div>
              </div>
              <div className="flex items-center gap-3 mt-10">
                <span className="px-4 py-2 bg-white/[0.05] rounded-xl text-sm font-medium">{job.type}</span>
                <span className="px-4 py-2 bg-white/[0.05] rounded-xl text-sm font-medium">Remote</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
