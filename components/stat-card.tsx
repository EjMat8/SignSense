"use client"

import { motion } from "framer-motion"
import { Star, Flame, Trophy, Target, Zap, Clock } from "lucide-react"

const iconMap = {
  star: Star,
  flame: Flame,
  trophy: Trophy,
  target: Target,
  zap: Zap,
  clock: Clock,
}

type StatCardProps = {
  label: string
  value: string | number
  icon: keyof typeof iconMap
  color: string
  bgColor: string
}

export function StatCard({ label, value, icon, color, bgColor }: StatCardProps) {
  const Icon = iconMap[icon]

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card rounded-2xl p-4 shadow-md border-2 border-border flex items-center gap-3 cursor-default"
      style={{ borderBottomWidth: "4px" }}
    >
      <div
        className="rounded-xl p-2.5 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold text-card-foreground">{value}</p>
      </div>
    </motion.div>
  )
}
