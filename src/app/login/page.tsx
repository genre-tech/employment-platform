"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    ).fromTo(
      formRef.current,
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1 },
      "-=0.5"
    );
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    // Try to sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      if (signInError.message === "Invalid login credentials") {
        // Fallback to sign up if account doesn't exist
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });
        if (signUpError) {
          setErrorMsg(signUpError.message);
          setLoading(false);
          return;
        }
      } else {
        setErrorMsg(signInError.message);
        setLoading(false);
        return;
      }
    }
    
    router.push("/profile");
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/profile` }
    });
  };

  return (
    <main 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden"
    >
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div 
        ref={formRef}
        className="relative z-10 w-full max-w-md p-10 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="text-xl font-semibold tracking-tighter text-[#F5F5F7] mb-4 block">
            Platform 2.0
          </Link>
          <h1 className="text-3xl font-semibold text-[#F5F5F7] tracking-tight">Sign in to Platform</h1>
          <p className="text-[#86868B] text-sm mt-2 font-medium">Use your academic or personal credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
              {errorMsg}
            </div>
          )}
          <div className="space-y-4">
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-[#86868B] focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors"
            />
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-[#86868B] focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-[#F5F5F7] text-black font-semibold rounded-2xl transition-transform shadow-lg ${loading ? 'opacity-70' : 'hover:scale-[1.02]'}`}
          >
            {loading ? "Authenticating..." : "Continue"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-xs font-medium text-[#86868B]">OR</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-4 bg-transparent border border-white/10 text-[#F5F5F7] font-medium rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </main>
  );
}
