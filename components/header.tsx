"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Crosshair, BarChart3, Store, Trophy } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/practice", label: "Practice", icon: Crosshair },
    { href: "/shop", label: "Shop", icon: Store },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/progress", label: "Progress", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b-2 border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            className="w-9 h-9 relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse
                cx="50"
                cy="55"
                rx="38"
                ry="40"
                fill="var(--primary)"
                stroke="var(--primary-dark)"
                strokeWidth="3"
              />
              <ellipse
                cx="50"
                cy="62"
                rx="24"
                ry="22"
                fill="var(--primary-light)"
              />
              <ellipse cx="38" cy="42" rx="6" ry="7" fill="#FFFFFF" />
              <circle cx="40" cy="42" r="3.5" fill="#1A1A2E" />
              <ellipse cx="62" cy="42" rx="6" ry="7" fill="#FFFFFF" />
              <circle cx="64" cy="42" r="3.5" fill="#1A1A2E" />
              <path
                d="M 38 58 Q 50 70 62 58"
                fill="none"
                stroke="#1A1A2E"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          <span className="text-xl font-extrabold text-foreground tracking-tight">
            Sign<span className="text-primary">Sense</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
