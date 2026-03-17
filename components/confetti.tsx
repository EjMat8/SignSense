"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const colors = ["#58CC02", "#FF9600", "#1CB0F6", "#FF4B4B", "#CE82FF", "#FFD700"]
const shapes = ["circle", "triangle", "square"] as const

type Particle = {
  id: number
  x: number
  y: number
  color: string
  shape: typeof shapes[number]
  size: number
  rotation: number
  delay: number
}

export function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: "-10vh", rotate: 0, opacity: 1 }}
          animate={{
            y: "110vh",
            rotate: p.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: "easeIn",
          }}
          className="absolute"
          style={{ width: p.size, height: p.size }}
        >
          {p.shape === "circle" && (
            <div className="w-full h-full rounded-full" style={{ backgroundColor: p.color }} />
          )}
          {p.shape === "square" && (
            <div className="w-full h-full rounded-sm" style={{ backgroundColor: p.color }} />
          )}
          {p.shape === "triangle" && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: `${p.size / 2}px solid transparent`,
                borderRight: `${p.size / 2}px solid transparent`,
                borderBottom: `${p.size}px solid ${p.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  )
}
