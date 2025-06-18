/**
 * SlideHeader Component
 * Header controls for the slide viewer
 */

import { motion } from 'framer-motion'
import { Maximize2, Home, Sparkles } from 'lucide-react'
import { headerVariants, headerTransition } from '@/lib'
import { Button } from '@/components/ui'

interface SlideHeaderProps {
  title: string
  currentSlide: number
  totalSlides: number
  onFullscreen: () => void
  onBack: () => void
}

export default function SlideHeader({
  title,
  currentSlide,
  totalSlides,
  onFullscreen,
  onBack
}: SlideHeaderProps) {
  return (
    <motion.header 
      className="slide-header"
      variants={headerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={headerTransition}
    >
      <div className="slide-info">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Sparkles className="title-icon" />
          {title}
        </motion.h1>
        <motion.div 
          className="slide-progress"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Slide {currentSlide + 1} of {totalSlides}
        </motion.div>
      </div>
      
      <motion.div 
        className="slide-controls"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={onFullscreen}
          variant="ghost"
          size="sm"
          icon={<Maximize2 size={18} />}
        >
          Fullscreen
        </Button>
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          icon={<Home size={18} />}
        >
          Back
        </Button>
      </motion.div>
    </motion.header>
  )
}