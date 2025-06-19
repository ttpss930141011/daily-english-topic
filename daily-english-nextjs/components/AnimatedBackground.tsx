'use client'

/**
 * AnimatedBackground Component
 * Renders animated particles and gradient orbs that respond to mouse movement
 */

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { particleAnimation } from '@/lib/animations'

interface MousePosition {
  x: number
  y: number
}

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  
  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  if (!mounted) return null
  
  return (
    <div className="bg-animation">
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          {...particleAnimation(Math.random() * 10)}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            bottom: -20,
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
          }}
        />
      ))}
      
      {/* Gradient orbs */}
      <motion.div
        className="gradient-orb gradient-orb-1"
        animate={{
          x: mousePosition.x * 0.05,
          y: mousePosition.y * 0.05,
        }}
        transition={{ type: "spring", stiffness: 50 }}
      />
      <motion.div
        className="gradient-orb gradient-orb-2"
        animate={{
          x: mousePosition.x * -0.05,
          y: mousePosition.y * -0.05,
        }}
        transition={{ type: "spring", stiffness: 50 }}
      />
    </div>
  )
}