"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth Apple-style entry animations
      // Removed GSAP from .reveal-text temporarily to debug visibility

      gsap.fromTo(
        cardRef.current,
        { y: 100, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power4.out", delay: 0.6 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main 
      ref={containerRef} 
      className="relative min-h-screen bg-black text-[#F5F5F7] overflow-hidden flex flex-col items-center pt-32 pb-24"
    >
      {/* Cinematic ambient background glow (Apple aurora style) */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 blur-[100px] rounded-[100%] pointer-events-none opacity-50" />

      {/* Hero Content */}
      <div ref={textRef} className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wide text-zinc-300 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            Introducing Platform 2.0
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[84px] font-semibold tracking-tighter leading-[1.05] mb-6">
          Profoundly capable. <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
            Surprisingly simple.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[#86868B] max-w-2xl font-medium tracking-tight mb-10">
          The ultimate engine for matching talent with opportunity. 
          Powered by intelligence, designed for clarity.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/login"
            className="px-8 py-3.5 bg-[#F5F5F7] text-black font-medium rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Get Started
          </Link>
          <Link 
            href="/jobs"
            className="group px-8 py-3.5 bg-transparent text-[#F5F5F7] font-medium rounded-full hover:bg-white/10 transition-colors duration-300 flex items-center gap-2"
          >
            Explore the platform
            <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Liquid Glass Hero Hardware/Card */}
      <div className="relative z-20 mt-20 w-full max-w-5xl px-6">
        <div 
          ref={cardRef}
          className="relative aspect-video w-full rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-center p-1"
        >
          {/* Inner bezel simulation */}
          <div className="absolute inset-0 rounded-[31px] border border-black/50 pointer-events-none" />
          <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[32px] pointer-events-none" />
          
          {/* Content inside the glass */}
          <div className="w-full h-full bg-[#0A0A0A] rounded-[28px] overflow-hidden relative flex flex-col">
            {/* Top Bar */}
            <div className="h-12 border-b border-white/5 flex items-center px-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                <div className="w-3 h-3 rounded-full bg-zinc-800" />
              </div>
            </div>
            {/* Body */}
            <div className="flex-1 p-8 relative flex flex-col gap-6">
              {/* Top Section */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-32 bg-white/20 rounded mb-2" />
                  <div className="h-2 w-24 bg-white/10 rounded" />
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-24 bg-indigo-500/20 border border-indigo-500/30 rounded-full" />
                  <div className="h-8 w-8 bg-white/10 rounded-full" />
                </div>
              </div>

              {/* Grid Section */}
              <div className="grid grid-cols-3 gap-4 h-full">
                {/* Main Content Area */}
                <div className="col-span-2 flex flex-col gap-4">
                  {/* Chart/Graph Area */}
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 p-4 flex flex-col justify-end">
                    <div className="w-full h-1/2 flex items-end gap-2 px-4">
                      <div className="w-1/6 h-[40%] bg-indigo-500/40 rounded-t-sm" />
                      <div className="w-1/6 h-[70%] bg-indigo-500/60 rounded-t-sm" />
                      <div className="w-1/6 h-[50%] bg-indigo-500/50 rounded-t-sm" />
                      <div className="w-1/6 h-[90%] bg-indigo-500/80 rounded-t-sm" />
                      <div className="w-1/6 h-[60%] bg-indigo-500/60 rounded-t-sm" />
                      <div className="w-1/6 h-[100%] bg-indigo-500 rounded-t-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>
                  {/* List Area */}
                  <div className="flex-1 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20" />
                      <div className="flex-1"><div className="h-2 w-3/4 bg-white/20 rounded" /></div>
                      <div className="h-2 w-8 bg-white/10 rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20" />
                      <div className="flex-1"><div className="h-2 w-1/2 bg-white/20 rounded" /></div>
                      <div className="h-2 w-8 bg-white/10 rounded" />
                    </div>
                  </div>
                </div>

                {/* Sidebar Area */}
                <div className="col-span-1 flex flex-col gap-4">
                  <div className="flex-1 rounded-2xl bg-gradient-to-bl from-white/[0.08] to-transparent border border-white/10 p-5 flex flex-col gap-4">
                    <div className="h-3 w-1/2 bg-white/30 rounded mb-2" />
                    <div className="flex flex-col gap-2">
                      <div className="h-10 w-full rounded-xl bg-white/5 border border-white/5 flex items-center px-3 gap-2">
                         <div className="w-4 h-4 rounded-full bg-white/20" />
                         <div className="h-2 w-1/2 bg-white/20 rounded" />
                      </div>
                      <div className="h-10 w-full rounded-xl bg-white/5 border border-white/5 flex items-center px-3 gap-2">
                         <div className="w-4 h-4 rounded-full bg-white/20" />
                         <div className="h-2 w-2/3 bg-white/20 rounded" />
                      </div>
                      <div className="h-10 w-full rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center px-3 gap-2 relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                         <div className="w-4 h-4 rounded-full bg-indigo-400" />
                         <div className="h-2 w-1/2 bg-indigo-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
