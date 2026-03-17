"use client"

import { motion } from "framer-motion"
import { Star, Flame, Zap, Trophy, Target, Crown, Timer, Medal, Award, Gem, Lock } from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star,
  flame: Flame,
  zap: Zap,
  trophy: Trophy,
  target: Target,
  crown: Crown,
  timer: Timer,
  medal: Medal,
  award: Award,
  gem: Gem,
}

type BadgeCardProps = {
  name: string
  description: string
  icon: string
  unlocked: boolean
  index?: number
}

export function BadgeCard({ name, description, icon, unlocked, index = 0 }: BadgeCardProps) {
  const Icon = iconMap[icon] || Star

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={unlocked ? { scale: 1.05, rotate: [-1, 1, 0] } : {}}
      className={`rounded-2xl p-4 text-center border-2 transition-colors ${
        unlocked
          ? "bg-card border-primary/30 shadow-md cursor-default"
          : "bg-muted/50 border-border opacity-60 cursor-default"
      }`}
      style={unlocked ? { borderBottomWidth: "4px" } : {}}
    >
      <div
        className={`w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center ${
          unlocked ? "bg-primary/10" : "bg-muted"
        }`}
      >
        {unlocked ? (
          <Icon className="w-6 h-6 text-primary" />
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <p className={`text-xs font-extrabold ${unlocked ? "text-card-foreground" : "text-muted-foreground"}`}>
        {name}
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{description}</p>
    </motion.div>
  )
}
