"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, SkipForward, Star, Check } from "lucide-react";
import { Header } from "@/components/header";
import { PromptCard } from "@/components/prompt-card";
import { CameraFeed, type CameraFeedHandle } from "@/components/camera-feed";
import { PredictionCard } from "@/components/prediction-card";
import { Timer } from "@/components/timer";
import { ResultModal } from "@/components/result-modal";
import { Mascot } from "@/components/mascot";
import { recordPracticeResult } from "@/lib/user-progress";

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const TOTAL_TIME = 10;

export default function PracticePage() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [xpGained, setXpGained] = useState(0);
  const [streak, setStreak] = useState(0);
  const [status, setStatus] = useState<"hold" | "locked" | "retry">("hold");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPracticing, setIsPracticing] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [predictedLetter, setPredictedLetter] = useState<string>("—");
  const [confidence, setConfidence] = useState(0);
  const [top3, setTop3] = useState<{ letter: string; confidence: number }[]>(
    []
  );
  const [isChecking, setIsChecking] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const cameraRef = useRef<CameraFeedHandle>(null);

  const currentLetter = LETTERS[currentLetterIndex % LETTERS.length];

  const evaluate = useCallback(async () => {
    if (!cameraRef.current || isChecking || showResult) return;
    setIsChecking(true);
    setApiError(null);
    try {
      const blob = await cameraRef.current.captureFrame();
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");
      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data?.error ?? "Prediction failed");
        return;
      }
      const letter = String(data.letter ?? "").toUpperCase();
      const conf =
        typeof data.confidence === "number"
          ? Math.round(data.confidence * 100)
          : 0;
      const top3FromApi = Array.isArray(data.top3)
        ? (data.top3 as { letter: string; confidence: number }[]).map((p) => ({
            letter: String(p.letter ?? "").toUpperCase(),
            confidence:
              typeof p.confidence === "number"
                ? Math.round(p.confidence * 100)
                : 0,
          }))
        : [];
      setPredictedLetter(letter);
      setConfidence(conf);
      setTop3(top3FromApi);
      const match =
        top3FromApi.length > 0
          ? top3FromApi.some((p) => p.letter === currentLetter)
          : letter === currentLetter;
      setStatus(match ? "locked" : "retry");
      setIsCorrect(match);
      const xp = match ? 10 : 5;
      setXpGained((prev) => prev + xp);
      if (match) setStreak((prev) => prev + 1);
      else setStreak(0);
      recordPracticeResult(
        match,
        currentLetter,
        match ? streak + 1 : undefined
      );
      setShowResult(true);
      setIsPracticing(false);
    } catch (e) {
      setApiError(e instanceof Error ? e.message : "Could not get prediction");
    } finally {
      setIsChecking(false);
    }
  }, [currentLetter, isChecking, showResult, streak]);

  const handleTimeUp = useCallback(() => {
    evaluate();
  }, [evaluate]);

  useEffect(() => {
    if (!cameraReady || !isPracticing || showResult) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cameraReady, isPracticing, showResult, currentLetterIndex, handleTimeUp]);

  const handleNext = () => {
    setShowResult(false);
    setCurrentLetterIndex(() => Math.floor(Math.random() * LETTERS.length));
    setTimeLeft(TOTAL_TIME);
    setStatus("hold");
    setPredictedLetter("—");
    setConfidence(0);
    setApiError(null);
    setIsPracticing(true);
  };

  const handleSkip = () => {
    setStreak(0);
    handleNext();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col lg:flex-row gap-6"
        >
          <div className="flex-1 flex flex-col gap-4">
            <PromptCard
              letter={currentLetter}
              hint="Show the sign for this letter, then tap Check (or wait for the timer)."
            />

            <Timer timeLeft={timeLeft} totalTime={TOTAL_TIME} />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-info/10 text-info font-extrabold text-sm px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4" />+{xpGained} XP
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={streak}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-1.5 bg-warning/10 text-warning font-extrabold text-sm px-3 py-1.5 rounded-xl"
                >
                  <Flame className="w-4 h-4" />x{streak}
                  {streak >= 3 && (
                    <span className="text-xs opacity-70">COMBO</span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden lg:block">
              <Mascot
                mood={
                  status === "locked"
                    ? "excited"
                    : status === "retry"
                    ? "sad"
                    : "thinking"
                }
                size="sm"
                message={
                  status === "locked"
                    ? "Nice! You got it!"
                    : status === "retry"
                    ? "Almost! Try again!"
                    : "Show the sign, then tap Check."
                }
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <CameraFeed
              ref={cameraRef}
              enabled={isPracticing && !showResult}
              onCameraReady={setCameraReady}
            />
            <PredictionCard
              predictedLetter={predictedLetter}
              confidence={confidence}
              status={status}
              targetLetter={currentLetter}
              top3={top3}
            />
            {apiError && (
              <p className="text-sm font-bold text-destructive">{apiError}</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mt-6 max-w-5xl mx-auto"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSkip}
            className="flex-1 bg-card text-muted-foreground border-2 border-border font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
            style={{ borderBottomWidth: "4px" }}
          >
            <SkipForward className="w-5 h-5" />
            Skip
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={evaluate}
            disabled={!cameraReady || isChecking || showResult}
            className="flex-1 bg-primary text-primary-foreground font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 4px 0 0 var(--primary-dark)" }}
          >
            <Check className="w-5 h-5" />
            {isChecking ? "Checking…" : "Check"}
          </motion.button>
        </motion.div>
      </main>

      <ResultModal
        isOpen={showResult}
        isCorrect={isCorrect}
        xpEarned={isCorrect ? 10 : 5}
        streak={streak}
        onAction={handleNext}
      />
    </div>
  );
}
