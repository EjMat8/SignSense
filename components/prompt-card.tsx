"use client"

import { motion } from "framer-motion"
import { Hand } from "lucide-react"

type PromptCardProps = {
  letter: string
  hint?: string
}

export function PromptCard({ letter, hint }: PromptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl p-6 shadow-lg border-2 border-border text-center"
      style={{ borderBottomWidth: "5px" }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Hand className="w-5 h-5 text-primary" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Show me</p>
      </div>
      <motion.div
        key={letter}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="text-8xl font-extrabold text-primary my-4"
      >
        {letter}
      </motion.div>
      {hint && (
        <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-info" />
          {hint}
        </p>
      )}
    </motion.div>
  )
}
