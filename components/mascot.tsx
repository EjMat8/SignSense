"use client";

import { motion } from "framer-motion";

type MascotProps = {
  mood?: "happy" | "excited" | "sad" | "thinking";
  size?: "sm" | "md" | "lg";
  message?: string;
};

export function Mascot({ mood = "happy", size = "md", message }: MascotProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const eyeVariants = {
    happy: { scaleY: 1 },
    excited: { scaleY: 0.3 },
    sad: { scaleY: 1.2 },
    thinking: { scaleY: 0.8, x: 2 },
  };

  return (
    <div className="flex items-end gap-2">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.ellipse
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

          <motion.ellipse
            cx="38"
            cy="42"
            rx="7"
            ry="8"
            fill="#FFFFFF"
            variants={eyeVariants}
            animate={mood}
          />
          <motion.circle cx="40" cy="42" r="4" fill="#1A1A2E" />
          {/* Right eye */}
          <motion.ellipse
            cx="62"
            cy="42"
            rx="7"
            ry="8"
            fill="#FFFFFF"
            variants={eyeVariants}
            animate={mood}
          />
          <motion.circle cx="64" cy="42" r="4" fill="#1A1A2E" />
          {/* Mouth */}
          {mood === "happy" || mood === "excited" ? (
            <path
              d="M 38 58 Q 50 72 62 58"
              fill="none"
              stroke="#1A1A2E"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : mood === "sad" ? (
            <path
              d="M 38 65 Q 50 55 62 65"
              fill="none"
              stroke="#1A1A2E"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : (
            <circle cx="50" cy="62" r="4" fill="#1A1A2E" />
          )}

          <circle cx="28" cy="55" r="5" fill="#FFB6C1" opacity="0.5" />
          <circle cx="72" cy="55" r="5" fill="#FFB6C1" opacity="0.5" />
        </svg>
      </motion.div>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-card text-card-foreground rounded-2xl rounded-bl-sm px-3 py-2 text-sm font-bold shadow-md border border-border max-w-48"
        >
          {message}
        </motion.div>
      )}
    </div>
  );
}
