"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { SkinAvatar } from "@/components/skin-avatar";
import { getStoredUser } from "@/lib/user";
import { getProgress } from "@/lib/user-progress";
import { Trophy, Target, Flame } from "lucide-react";

const PLACEHOLDER_LEADERBOARD: LeaderboardEntry[] = [
  {
    username: "Alex",
    level: 12,
    bestAccuracy: 94.2,
    bestStreak: 18,
    selectedSkinId: "level-10",
  },
  {
    username: "Sam",
    level: 8,
    bestAccuracy: 88.5,
    bestStreak: 12,
    selectedSkinId: "level-8",
  },
  {
    username: "Jordan",
    level: 15,
    bestAccuracy: 91.0,
    bestStreak: 22,
    selectedSkinId: "level-15",
  },
  {
    username: "Riley",
    level: 5,
    bestAccuracy: 96.0,
    bestStreak: 8,
    selectedSkinId: "level-5",
  },
  {
    username: "Casey",
    level: 3,
    bestAccuracy: 82.0,
    bestStreak: 5,
    selectedSkinId: "level-3",
  },
  {
    username: "Morgan",
    level: 20,
    bestAccuracy: 89.5,
    bestStreak: 30,
    selectedSkinId: "level-20",
  },
  {
    username: "Quinn",
    level: 7,
    bestAccuracy: 85.0,
    bestStreak: 10,
    selectedSkinId: "level-2",
  },
  {
    username: "Taylor",
    level: 4,
    bestAccuracy: 78.5,
    bestStreak: 4,
    selectedSkinId: "default",
  },
  {
    username: "Parker",
    level: 11,
    bestAccuracy: 92.3,
    bestStreak: 15,
    selectedSkinId: "level-10",
  },
  {
    username: "Avery",
    level: 6,
    bestAccuracy: 87.0,
    bestStreak: 9,
    selectedSkinId: "level-5",
  },
];

type LeaderboardEntry = {
  username: string;
  level: number;
  bestAccuracy: number;
  bestStreak: number;
  selectedSkinId: string;
};

type RankBy = "level" | "accuracy" | "streak";

function sortAndRank(
  entries: LeaderboardEntry[],
  by: RankBy
): { entry: LeaderboardEntry; rank: number }[] {
  const sorted = [...entries].sort((a, b) => {
    if (by === "level") return b.level - a.level;
    if (by === "accuracy") return b.bestAccuracy - a.bestAccuracy;
    return b.bestStreak - a.bestStreak;
  });
  return sorted.map((entry, i) => ({ entry, rank: i + 1 }));
}

export default function LeaderboardPage() {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<LeaderboardEntry | null>(
    null
  );
  const [rankBy, setRankBy] = useState<RankBy>("level");

  useEffect(() => {
    const user = getStoredUser();
    const progress = getProgress();
    if (user?.username) {
      setCurrentUsername(user.username);
      setCurrentEntry({
        username: user.username,
        level: progress.level,
        bestAccuracy: progress.bestAccuracy,
        bestStreak: progress.bestStreak,
        selectedSkinId: progress.selectedSkinId,
      });
    }
  }, []);

  const entries = useMemo(() => {
    const list = PLACEHOLDER_LEADERBOARD.map((e) => ({ ...e }));
    if (!currentEntry) return list;
    const idx = list.findIndex(
      (e) => e.username.toLowerCase() === currentEntry.username.toLowerCase()
    );
    if (idx >= 0) {
      list[idx] = currentEntry;
    } else {
      list.push(currentEntry);
    }
    return list;
  }, [currentEntry]);

  const ranked = useMemo(() => sortAndRank(entries, rankBy), [entries, rankBy]);

  const tabs: {
    id: RankBy;
    label: string;
    icon: typeof Trophy;
    statKey: keyof LeaderboardEntry;
    format: (v: number) => string;
  }[] = [
    {
      id: "level",
      label: "By Level",
      icon: Trophy,
      statKey: "level",
      format: (v) => `Lv.${v}`,
    },
    {
      id: "accuracy",
      label: "By Accuracy",
      icon: Target,
      statKey: "bestAccuracy",
      format: (v) => `${v}%`,
    },
    {
      id: "streak",
      label: "By Best Streak",
      icon: Flame,
      statKey: "bestStreak",
      format: (v) => `${v}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">
          Leaderboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 p-1 rounded-2xl bg-muted mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setRankBy(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  rankBy === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border-2 border-border bg-card overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            {ranked.map(({ entry, rank }) => {
              const isYou =
                currentUsername != null && entry.username === currentUsername;
              const tab = tabs.find((t) => t.id === rankBy)!;
              const statValue = entry[tab.statKey] as number;

              return (
                <motion.div
                  key={`${entry.username}-${rankBy}-${rank}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-4 px-4 py-3 ${
                    isYou ? "bg-primary/10" : ""
                  }`}
                >
                  <span
                    className={`w-8 shrink-0 text-center font-extrabold ${
                      rank === 1
                        ? "text-amber-500"
                        : rank === 2
                        ? "text-slate-400"
                        : rank === 3
                        ? "text-amber-700"
                        : "text-muted-foreground"
                    }`}
                  >
                    #{rank}
                  </span>
                  <SkinAvatar skinId={entry.selectedSkinId} size="md" />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-bold truncate ${
                        isYou ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {entry.username}
                      {isYou && (
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="font-extrabold text-foreground shrink-0">
                    {tab.format(statValue)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
