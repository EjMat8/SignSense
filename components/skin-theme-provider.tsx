"use client";

import { useLayoutEffect, useState } from "react";
import { getProgress } from "@/lib/user-progress";
import { getSkinById, getSkinTheme } from "@/lib/skins";

function getThemeVars(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = getProgress();
  const skin = getSkinById(p.selectedSkinId);
  if (!skin) return {};
  return getSkinTheme(skin);
}

export function SkinThemeProvider({ children }: { children: React.ReactNode }) {
  const [vars, setVars] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    setVars(getThemeVars());
    const onSkinChange = () => setVars(getThemeVars());
    window.addEventListener("signsense-skin-changed", onSkinChange);
    return () =>
      window.removeEventListener("signsense-skin-changed", onSkinChange);
  }, []);

  return (
    <div className="min-h-screen" style={vars as React.CSSProperties}>
      {children}
    </div>
  );
}
