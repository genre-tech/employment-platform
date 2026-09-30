"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Recalculate ScrollTrigger positions on mount
    ScrollTrigger.refresh();
  }, []);

  return <>{children}</>;
}
