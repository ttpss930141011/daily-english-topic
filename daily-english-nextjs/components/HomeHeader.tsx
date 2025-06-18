/**
 * HomeHeader Component
 * Displays the main header with animated title and statistics
 */

import { motion } from 'framer-motion'
import { Sparkles, BookOpen, Users, Globe } from 'lucide-react'

interface HomeHeaderProps {
  topicsCount: number
}

export default function HomeHeader({ topicsCount }: HomeHeaderProps) {
  return (
    <motion.header 
      className="header"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="header-content">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1 
          }}
        >
          <h1 className="logo">
            <Sparkles className="logo-icon" />
            Daily English Topics
          </h1>
        </motion.div>
        
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Learn English through interactive slide presentations from real Reddit discussions
        </motion.p>
        
        {/* Stats */}
        <motion.div 
          className="stats-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="stat">
            <BookOpen className="stat-icon" />
            <span>{topicsCount} Topics</span>
          </div>
          <div className="stat">
            <Users className="stat-icon" />
            <span>Daily Updated</span>
          </div>
          <div className="stat">
            <Globe className="stat-icon" />
            <span>Real Conversations</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}