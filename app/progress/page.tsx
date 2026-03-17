"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Mascot } from "@/components/mascot";
import {
  getProgress,
  getAccuracyOverTime,
  getMostMissedLetters,
  getLetterMasteryList,
} from "@/lib/user-progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
} from "recharts";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function getAccuracyColor(accuracy: number) {
  if (accuracy >= 80) return "bg-success";
  if (accuracy >= 60) return "bg-warning";
  return "bg-destructive";
}

function getAccuracyBg(accuracy: number) {
  if (accuracy >= 80) return "bg-success/10 border-success/20";
  if (accuracy >= 60) return "bg-warning/10 border-warning/20";
  return "bg-destructive/10 border-destructive/20";
}

function getAccuracyText(accuracy: number) {
  if (accuracy >= 80) return "text-success";
  if (accuracy >= 60) return "text-warning";
  return "text-destructive";
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ReturnType<
    typeof getProgress
  > | null>(null);
  useEffect(() => setProgress(getProgress()), []);

  const accuracyOverTime = progress ? getAccuracyOverTime(progress, 7) : [];
  const mostMissedLetters = progress ? getMostMissedLetters(progress, 5) : [];
  const letterProgress = progress
    ? getLetterMasteryList(progress)
    : getLetterMasteryList({ letterMastery: {} } as ReturnType<
        typeof getProgress
      >);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div
            variants={item}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">
                Your Progress
              </h1>
              <p className="text-muted-foreground text-sm font-bold mt-1">
                Track your ASL mastery journey
              </p>
            </div>
            <Mascot mood="happy" size="sm" />
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card rounded-3xl p-5 border-2 border-border shadow-md"
            style={{ borderBottomWidth: "4px" }}
          >
            <h3 className="font-extrabold text-card-foreground mb-4">
              Accuracy Over Time
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accuracyOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#6B7280" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#6B7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "2px solid #E5E5E5",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#58CC02"
                    strokeWidth={3}
                    dot={{ fill: "#58CC02", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: "#58CC02" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-card rounded-3xl p-5 border-2 border-border shadow-md"
            style={{ borderBottomWidth: "4px" }}
          >
            <h3 className="font-extrabold text-card-foreground mb-4">
              Most Missed Letters
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostMissedLetters}>
                  <XAxis
                    dataKey="letter"
                    tick={{ fontSize: 14, fontWeight: 800, fill: "#1A1A2E" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#6B7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "2px solid #E5E5E5",
                      fontWeight: 700,
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="misses" fill="#FF4B4B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="font-extrabold text-foreground text-lg mb-3">
              Letter Mastery A-Z
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
              {letterProgress.map((lp, i) => (
                <motion.div
                  key={lp.letter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className={`rounded-xl p-2.5 text-center border ${getAccuracyBg(
                    lp.accuracy
                  )} cursor-default`}
                  style={{ borderBottomWidth: "3px" }}
                >
                  <p className="text-lg font-extrabold text-card-foreground">
                    {lp.letter}
                  </p>
                  <p
                    className={`text-xs font-extrabold ${getAccuracyText(
                      lp.accuracy
                    )}`}
                  >
                    {lp.accuracy}%
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${getAccuracyColor(
                          lp.accuracy
                        )}`}
                        style={{ width: `${lp.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1 leading-tight">
                    {lp.total} tries
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-card text-card-foreground border-2 border-border font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                style={{ borderBottomWidth: "4px" }}
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
