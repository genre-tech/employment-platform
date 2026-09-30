"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { saveProfile } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (data) {
          setInitialData(data);
        } else {
          // If no profile, we can fallback to name from Google auth
          setInitialData({
            full_name: user.user_metadata?.full_name || "",
          });
        }
      }
      setIsLoading(false);
    };
    
    fetchProfile();
  }, [supabase]);

  useEffect(() => {
    if (!isLoading) {
      const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1 } });
      tl.fromTo(
        ".reveal-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1 }
      );
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-32 pb-24 px-4 bg-black flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main 
      ref={containerRef}
      className="min-h-screen pt-32 pb-24 px-4 bg-black flex justify-center relative overflow-hidden"
    >
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="space-y-3 reveal-item mb-12 text-center">
          <h1 className="text-4xl md:text-[52px] font-semibold tracking-tighter text-[#F5F5F7] leading-tight">
            Tell us about yourself.
          </h1>
          <p className="text-[#86868B] text-lg font-medium">
            Intelligence requires context. Help us map your capabilities.
          </p>
        </div>

        <div className="reveal-item p-8 md:p-10 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)]">
          <form action={async (formData) => {
            setIsSubmitting(true);
            try {
              await saveProfile(formData);
            } catch (error) {
              console.error(error);
              setIsSubmitting(false);
            }
          }} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#86868B] ml-1">Full Name</label>
              <input 
                type="text"
                name="name"
                defaultValue={initialData?.full_name || ""}
                placeholder="Jane Doe"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-[#86868B] focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#86868B] ml-1">University / Institution</label>
                <input 
                  type="text"
                  name="university"
                  defaultValue={initialData?.university || ""}
                  placeholder="Stanford University"
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-[#86868B] focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#86868B] ml-1">Degree / Major</label>
                <input 
                  type="text"
                  name="degree"
                  defaultValue={initialData?.degree || ""}
                  placeholder="Computer Science"
                  className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-[#86868B] focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#86868B] ml-1">Expected Graduation Year</label>
              <input 
                type="number"
                name="gradYear"
                defaultValue={initialData?.expected_graduation_year || ""}
                placeholder="2025"
                min="2020"
                max="2030"
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-[#86868B] focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#86868B] ml-1">Core Capabilities</label>
              <textarea 
                name="skills"
                defaultValue={initialData?.core_capabilities || ""}
                placeholder="React, Distributed Systems, UI/UX..."
                rows={3}
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-[#86868B] focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors resize-none"
                required
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#F5F5F7] text-black font-semibold rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile & Continue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
