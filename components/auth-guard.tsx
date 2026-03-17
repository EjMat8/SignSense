"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/user";
import { SkinThemeProvider } from "@/components/skin-theme-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === "/signup") {
      setAllowed(true);
      return;
    }
    const user = getStoredUser();
    if (!user) {
      router.replace("/signup");
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, [pathname, router]);

  // Avoid flash: don't render protected content until we've checked (client-side)
  if (allowed === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground font-bold">Loading...</div>
      </div>
    );
  }
  if (!allowed) return null;
  return <SkinThemeProvider>{children}</SkinThemeProvider>;
}
