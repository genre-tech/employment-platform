"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "AI Path" },
    { href: "/jobs", label: "Jobs" },
    { href: "/interview", label: "Interview" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
      <div className="flex items-center justify-between px-6 py-3 bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] rounded-full w-full max-w-4xl text-[#F5F5F7]">
        <Link href="/" className="text-xl font-semibold tracking-tighter">
          Platform
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-white/80 ${
                pathname === link.href ? "text-white" : "text-[#86868B]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {user.user_metadata?.avatar_url && (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-white/20"
                />
              )}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium bg-[#F5F5F7] text-black rounded-full hover:scale-105 transition-transform"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
