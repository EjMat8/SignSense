"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, BookOpen, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { Mascot } from "@/components/mascot";
import {
  getProgress,
  getTodayAccuracy,
  getXPProgressInLevel,
} from "@/lib/user-progress";
import { getStoredUser } from "@/lib/user";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [progress, setProgress] = useState<ReturnType<
    typeof getProgress
  > | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => setProgress(getProgress()), []);
  useEffect(() => setUsername(getStoredUser()?.username ?? null), []);

  const p = progress ?? {
    level: 1,
    xp: 0,
    todayCorrect: 0,
    todayTotal: 0,
    bestStreak: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    bestAccuracy: 0,
  };
  const todayAccuracy = progress ? getTodayAccuracy(progress) : 0;
  const levelProgress = getXPProgressInLevel(p.xp);
  const levelPercent =
    levelProgress.needed > 0
      ? Math.min(
          100,
          Math.round((levelProgress.current / levelProgress.needed) * 100)
        )
      : 100;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          <motion.div variants={item} className="flex justify-center">
            <Mascot
              mood="excited"
              size="lg"
              message={
                username
                  ? `Ready to sign, ${username}!`
                  : "Ready to sign? Let's gooo!"
              }
            />
          </motion.div>

          <motion.div variants={item}>
            <Link href="/practice">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-primary text-primary-foreground font-extrabold text-xl py-5 rounded-2xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3"
                style={{ boxShadow: "0 6px 0 0 var(--primary-dark)" }}
              >
                <Sparkles className="w-6 h-6" />
                Start Practice
              </motion.button>
            </Link>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-3 gap-3">
            <StatCard
              label="Level"
              value={p.level}
              icon="trophy"
              color="#58CC02"
              bgColor="#58CC0215"
            />
            <StatCard
              label="XP"
              value={p.xp}
              icon="star"
              color="#1CB0F6"
              bgColor="#1CB0F615"
            />
            <StatCard
              label="Best Streak"
              value={p.bestStreak}
              icon="flame"
              color="#FF9600"
              bgColor="#FF960015"
            />
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card rounded-2xl p-4 border-2 border-border shadow-md"
            style={{ borderBottomWidth: "4px" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                Level {p.level} → {p.level + 1}
              </span>
              <span className="text-sm font-extrabold text-card-foreground">
                {levelProgress.current} / {levelProgress.needed} XP
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${levelPercent}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                style={{ minWidth: levelProgress.current > 0 ? "4px" : 0 }}
              />
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="text-sm font-extrabold text-muted-foreground uppercase tracking-wider mb-3">
              Recent Stats
            </h3>
            <div className="flex flex-wrap gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-primary/10 text-primary font-extrabold text-sm px-4 py-2 rounded-xl"
              >
                {todayAccuracy}% Today
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-info/10 text-info font-extrabold text-sm px-4 py-2 rounded-xl"
              >
                {p.todayCorrect} Letters Today
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-warning/10 text-warning font-extrabold text-sm px-4 py-2 rounded-xl"
              >
                Best Streak: {p.bestStreak}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-success/10 text-success font-extrabold text-sm px-4 py-2 rounded-xl"
              >
                Best Accuracy: {p.bestAccuracy}%
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/progress">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-card rounded-2xl p-4 border-2 border-border flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                style={{ borderBottomWidth: "4px" }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-chart-5/15 p-2.5 rounded-xl">
                    <svg
                      className="w-5 h-5 text-chart-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-extrabold text-card-foreground">
                      View Progress
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Check your letter mastery and badges
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
