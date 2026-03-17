"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { Mascot } from "@/components/mascot";
import { getProgress, setSelectedSkin } from "@/lib/user-progress";
import {
  SKINS,
  getSkinTheme,
  getUnlockedSkinIds,
  type Skin,
} from "@/lib/skins";
import { Lock, Check } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function SkinCard({
  skin,
  isUnlocked,
  isSelected,
  onSelect,
}: {
  skin: Skin;
  isUnlocked: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const themeVars = getSkinTheme(skin);

  return (
    <motion.div
      variants={item}
      className={`rounded-2xl border-2 p-4 transition-all ${
        isSelected
          ? "border-primary bg-primary/10 shadow-md"
          : isUnlocked
          ? "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
          : "border-border bg-muted/50 opacity-80"
      }`}
    >
      <div
        className="flex items-center gap-4"
        style={themeVars as React.CSSProperties}
      >
        <div className="shrink-0">
          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-background/50">
            <Mascot mood="happy" size="sm" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-card-foreground">
              {skin.name}
            </span>
            {!isUnlocked && (
              <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isUnlocked
              ? isSelected
                ? "Current theme"
                : `Unlocked at level ${skin.level}`
              : `Unlocks at level ${skin.level}`}
          </p>
        </div>
        <div className="shrink-0">
          {isSelected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/20 text-primary font-bold text-sm">
              <Check className="w-4 h-4" />
              Selected
            </span>
          ) : isUnlocked ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSelect}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all"
            >
              Use
            </motion.button>
          ) : (
            <span className="text-xs font-bold text-muted-foreground px-3 py-2">
              Lv.{skin.level}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [progress, setProgress] = useState<ReturnType<
    typeof getProgress
  > | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const level = progress?.level ?? 1;
  const selectedSkinId = progress?.selectedSkinId ?? "default";
  const unlockedIds = getUnlockedSkinIds(level);

  const handleSelect = (skinId: string) => {
    setSelectedSkin(skinId);
    setProgress(getProgress());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div variants={item}>
            <h1 className="text-2xl font-extrabold text-foreground">
              Level Shop
            </h1>
            <p className="text-muted-foreground mt-1">
              Unlock new mascot skins and themes when you reach the right level.
              You're level{" "}
              <span className="font-bold text-foreground">{level}</span>.
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-3">
            {SKINS.map((skin) => (
              <SkinCard
                key={skin.id}
                skin={skin}
                isUnlocked={unlockedIds.includes(skin.id)}
                isSelected={selectedSkinId === skin.id}
                onSelect={() => handleSelect(skin.id)}
              />
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
