"use client"

import { motion } from "framer-motion"

type TimerProps = {
  timeLeft: number
  totalTime: number
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
  const progress = (timeLeft / totalTime) * 100
  const isLow = timeLeft <= 3

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="h-4 bg-muted rounded-full overflow-hidden relative">
          <motion.div
            className={`h-full rounded-full ${isLow ? "bg-destructive" : "bg-info"}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          {/* Tick marks */}
          {Array.from({ length: totalTime }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-0.5 bg-background/30"
              style={{ left: `${((i + 1) / totalTime) * 100}%` }}
            />
          ))}
        </div>
      </div>
      <motion.span
        key={timeLeft}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className={`text-lg font-extrabold tabular-nums min-w-12 text-center ${
          isLow ? "text-destructive" : "text-info"
        }`}
      >
        {`00:${String(timeLeft).padStart(2, "0")}`}
      </motion.span>
    </div>
  )
}
