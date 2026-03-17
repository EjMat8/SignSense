/**
 * User progress and gamification. Stored in localStorage per user (device).
 * Level 1 = 0 XP; Level 2 = 100 XP; Level 3 = 250 XP; Level 4 = 450 XP;
 * Correct sign: +10 XP. Wrong: +5 XP.
 */
import { getSkinById, isSkinUnlocked } from "./skins";

const STORAGE_KEY = "signsense_progress";

const XP_BASE = 100;
const XP_INCREMENT_PER_LEVEL = 50;

function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  let sum = 0;
  for (let i = 2; i <= level; i++) {
    sum += XP_BASE + XP_INCREMENT_PER_LEVEL * (i - 2);
  }
  return sum;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export function getXPForNextLevel(currentLevel: number): number {
  return XP_BASE + XP_INCREMENT_PER_LEVEL * (currentLevel - 1);
}

export function getXPProgressInLevel(xp: number): {
  current: number;
  needed: number;
} {
  const level = getLevelFromXP(xp);
  const xpAtLevelStart = xpForLevel(level);
  const xpNeededForNext = getXPForNextLevel(level);
  return { current: xp - xpAtLevelStart, needed: xpNeededForNext };
}

export type DayStats = {
  date: string; // YYYY-MM-DD
  correct: number;
  total: number;
  accuracy: number;
};

export type LetterMasteryItem = {
  letter: string;
  correct: number;
  total: number;
  accuracy: number;
};

export type Progress = {
  level: number;
  xp: number;
  todayDate: string;
  todayCorrect: number;
  todayTotal: number;
  totalCorrect: number;
  totalAttempts: number;
  bestAccuracy: number;

  bestStreak: number;

  selectedSkinId: string;
  dailyStats: Record<string, { correct: number; total: number }>;
  letterMastery: Record<string, { correct: number; total: number }>;
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultProgress(): Progress {
  const today = todayStr();
  return {
    level: 1,
    xp: 0,
    todayDate: today,
    todayCorrect: 0,
    todayTotal: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    bestAccuracy: 0,
    bestStreak: 0,
    selectedSkinId: "default",
    dailyStats: {},
    letterMastery: {},
  };
}

export function getProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const p = JSON.parse(raw) as Progress & {
      streak?: number;
      lastActiveDate?: string;
    };
    const today = todayStr();
    if (p.todayDate !== today) {
      p.todayDate = today;
      p.todayCorrect = 0;
      p.todayTotal = 0;
    }
    if (typeof p.bestStreak !== "number") p.bestStreak = 0;
    if (typeof p.selectedSkinId !== "string") p.selectedSkinId = "default";
    const skin = getSkinById(p.selectedSkinId);
    if (!skin || !isSkinUnlocked(p.selectedSkinId, p.level))
      p.selectedSkinId = "default";
    delete (p as Record<string, unknown>).streak;
    delete (p as Record<string, unknown>).lastActiveDate;
    return p as Progress;
  } catch {
    return defaultProgress();
  }
}

function setProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function recordPracticeResult(
  correct: boolean,
  letter: string,
  sessionStreak?: number
): void {
  const p = getProgress();
  const today = todayStr();
  const xpGain = correct ? 10 : 5;

  p.xp += xpGain;
  p.level = getLevelFromXP(p.xp);
  p.totalAttempts += 1;
  p.totalCorrect += correct ? 1 : 0;

  if (p.todayDate !== today) {
    p.todayDate = today;
    p.todayCorrect = 0;
    p.todayTotal = 0;
  }
  p.todayTotal += 1;
  if (correct) p.todayCorrect += 1;

  if (correct && sessionStreak != null && sessionStreak > p.bestStreak)
    p.bestStreak = sessionStreak;

  const overallAcc =
    p.totalAttempts > 0 ? (p.totalCorrect / p.totalAttempts) * 100 : 0;
  if (overallAcc > p.bestAccuracy)
    p.bestAccuracy = Math.round(overallAcc * 10) / 10;

  if (!p.dailyStats[today]) p.dailyStats[today] = { correct: 0, total: 0 };
  p.dailyStats[today].total += 1;
  if (correct) p.dailyStats[today].correct += 1;

  const up = letter.toUpperCase();
  if (!p.letterMastery[up]) p.letterMastery[up] = { correct: 0, total: 0 };
  p.letterMastery[up].total += 1;
  if (correct) p.letterMastery[up].correct += 1;

  setProgress(p);
}

/** Set the selected mascot/theme skin (must be unlocked for current level). */
export function setSelectedSkin(skinId: string): void {
  const p = getProgress();
  const skin = getSkinById(skinId);
  if (!skin || !isSkinUnlocked(skinId, p.level)) return;
  p.selectedSkinId = skinId;
  setProgress(p);
  if (typeof window !== "undefined")
    window.dispatchEvent(new CustomEvent("signsense-skin-changed"));
}

/** Accuracy over time: last 7 days (or 30) for chart. */
export function getAccuracyOverTime(progress: Progress, days = 7): DayStats[] {
  const out: DayStats[] = [];
  const d = new Date();
  const keys: string[] = [];
  for (let i = 0; i < days; i++) {
    keys.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() - 1);
  }
  keys.reverse();
  for (const date of keys) {
    const s = progress.dailyStats[date];
    const total = s?.total ?? 0;
    const correct = s?.correct ?? 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const [y, m, d] = date.split("-");
    out.push({
      date: `${Number(m)}/${Number(d)}`,
      correct,
      total,
      accuracy,
    });
  }
  return out;
}

export function getMostMissedLetters(
  progress: Progress,
  limit = 5
): { letter: string; misses: number }[] {
  const entries = Object.entries(progress.letterMastery)
    .map(([letter, { correct, total }]) => ({
      letter,
      misses: total - correct,
    }))
    .filter((x) => x.misses > 0)
    .sort((a, b) => b.misses - a.misses);
  return entries.slice(0, limit);
}

const A_TO_Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export function getLetterMasteryList(progress: Progress): LetterMasteryItem[] {
  return A_TO_Z.map((letter) => {
    const m = progress.letterMastery[letter] ?? { correct: 0, total: 0 };
    const accuracy = m.total > 0 ? Math.round((m.correct / m.total) * 100) : 0;
    return { letter, correct: m.correct, total: m.total, accuracy };
  });
}

export function getTodayAccuracy(progress: Progress): number {
  if (progress.todayTotal === 0) return 0;
  return Math.round((progress.todayCorrect / progress.todayTotal) * 100);
}
