"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function InterviewPage() {
  const [messages, setMessages] = useState<{ role: "ai" | "user", text: string }[]>([
    { role: "ai", text: "Hello! I'm your AI interviewer. We're going to do a mock technical screen for the Frontend Engineer role. Are you ready?" }
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      if (data.reply) {
        setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to the interviewer.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 px-4 bg-black text-[#F5F5F7] flex flex-col items-center relative overflow-hidden">
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-4xl flex flex-col h-[75vh] border border-white/10 bg-white/[0.02] rounded-[32px] backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden relative z-10">
        
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">AI Mock Interview</h2>
            <p className="text-sm text-[#86868B] font-medium mt-1">Frontend Engineer Track</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.05] rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-3xl px-6 py-4 ${
                msg.role === "user" 
                  ? "bg-[#F5F5F7] text-black rounded-tr-sm shadow-sm" 
                  : "bg-white/[0.05] border border-white/10 text-[#F5F5F7] rounded-tl-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              }`}>
                <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-black/20 border-t border-white/10">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI interviewer..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-6 pr-16 py-5 text-[15px] font-medium text-[#F5F5F7] placeholder-[#86868B] focus:outline-none focus:border-white/30 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute right-2.5 top-2.5 bottom-2.5 aspect-square bg-[#F5F5F7] text-black rounded-full flex items-center justify-center transition-transform ${(!input.trim() || isLoading) ? 'opacity-50' : 'hover:scale-105'}`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
