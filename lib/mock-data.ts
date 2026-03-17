export const userStats = {
  level: 7,
  xp: 1240,
  streak: 5,
  accuracy: 82,
  lettersToday: 14,
  bestStreak: 12,
}

export const sessionData = {
  targetLetter: "B",
  timeLeft: 6,
  totalTime: 10,
  xpGained: 20,
  currentStreak: 7,
  predictedLetter: "B",
  confidence: 87,
  status: "hold" as "hold" | "locked" | "retry",
}

export const letterProgress: {
  letter: string
  accuracy: number
  attempts: number
  bestStreak: number
}[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
  letter,
  accuracy: Math.floor(Math.random() * 60) + 40,
  attempts: Math.floor(Math.random() * 50) + 5,
  bestStreak: Math.floor(Math.random() * 10) + 1,
}))

export const badges = [
  { id: 1, name: "First Sign", description: "Complete your first letter", icon: "star", unlocked: true },
  { id: 2, name: "Streak Starter", description: "Get a 3-day streak", icon: "flame", unlocked: true },
  { id: 3, name: "Quick Hands", description: "Sign 5 letters in 30 seconds", icon: "zap", unlocked: true },
  { id: 4, name: "A-Team", description: "Master 5 letters", icon: "trophy", unlocked: true },
  { id: 5, name: "Perfect Ten", description: "Get 10 in a row", icon: "target", unlocked: true },
  { id: 6, name: "Daily Champ", description: "Complete 7 daily challenges", icon: "crown", unlocked: false },
  { id: 7, name: "Speed Demon", description: "Sign 10 letters in 1 minute", icon: "timer", unlocked: false },
  { id: 8, name: "Half Way", description: "Master 13 letters", icon: "medal", unlocked: false },
  { id: 9, name: "Alphabet Hero", description: "Master all 26 letters", icon: "award", unlocked: false },
  { id: 10, name: "Legend", description: "Reach 5000 XP", icon: "gem", unlocked: false },
]

export const accuracyOverTime = [
  { day: "Mon", accuracy: 65 },
  { day: "Tue", accuracy: 70 },
  { day: "Wed", accuracy: 68 },
  { day: "Thu", accuracy: 75 },
  { day: "Fri", accuracy: 80 },
  { day: "Sat", accuracy: 78 },
  { day: "Sun", accuracy: 82 },
]

export const mostMissedLetters = [
  { letter: "Z", misses: 12 },
  { letter: "J", misses: 10 },
  { letter: "X", misses: 8 },
  { letter: "Q", misses: 7 },
  { letter: "R", misses: 5 },
]
