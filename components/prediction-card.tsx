"use client";

import { motion, AnimatePresence } from "framer-motion";

type PredictionCardProps = {
  predictedLetter: string;
  confidence: number;
  status: "hold" | "locked" | "retry";

  targetLetter?: string;
  top3?: { letter: string; confidence: number }[];
};

const statusConfig = {
  hold: {
    text: "Hold steady...",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    barColor: "bg-warning",
  },
  locked: {
    text: "Locked in!",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    barColor: "bg-success",
  },
  retry: {
    text: "Try again",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    barColor: "bg-destructive",
  },
};

export function PredictionCard({
  predictedLetter,
  confidence,
  status,
  targetLetter,
  top3,
}: PredictionCardProps) {
  const config = statusConfig[status];
  const displayLetter =
    status === "locked" && targetLetter ? targetLetter : predictedLetter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-5 border-2 ${config.bg} ${config.border}`}
      style={{ borderBottomWidth: "4px" }}
    >
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 text-center">
        Prediction
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={displayLetter}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="text-6xl font-extrabold text-center text-card-foreground mb-3"
        >
          {displayLetter}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-muted-foreground">
          Confidence
        </span>
        <span className="text-sm font-extrabold text-card-foreground">
          {confidence}%
        </span>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          className={`h-full rounded-full ${config.barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {top3 && top3.length > 0 && (
        <div className="mb-3 flex flex-col gap-1 text-xs font-bold text-muted-foreground">
          <p className="uppercase tracking-wider">Top 3 guesses</p>
          <div className="flex flex-wrap gap-1.5">
            {top3.map((p) => (
              <span
                key={`${p.letter}-${p.confidence}`}
                className="px-2 py-0.5 rounded-full bg-muted text-card-foreground text-[11px] font-extrabold"
              >
                {p.letter} · {p.confidence}%
              </span>
            ))}
          </div>
        </div>
      )}

      <motion.div
        key={status}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center text-sm font-extrabold ${config.color}`}
      >
        {config.text}
      </motion.div>
    </motion.div>
  );
}
