/**
 * SlideNavigation Component
 * Navigation controls for slides including arrows, dots, and progress bar
 */

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { hoverScale } from '@/lib/animations'

interface SlideNavigationProps {
  currentSlide: number
  totalSlides: number
  onNext: () => void
  onPrevious: () => void
  onGoToSlide: (index: number) => void
}

export default function SlideNavigation({
  currentSlide,
  totalSlides,
  onNext,
  onPrevious,
  onGoToSlide
}: SlideNavigationProps) {
  const progress = ((currentSlide + 1) / totalSlides) * 100
  
  return (
    <>
      {/* Navigation Arrows */}
      <AnimatePresence>
        {currentSlide > 0 && (
          <motion.button 
            className="nav-arrow nav-prev" 
            onClick={onPrevious}
            aria-label="Previous slide"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            {...hoverScale}
          >
            <ChevronLeft size={32} />
          </motion.button>
        )}
        
        {currentSlide < totalSlides - 1 && (
          <motion.button 
            className="nav-arrow nav-next" 
            onClick={onNext}
            aria-label="Next slide"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            {...hoverScale}
          >
            <ChevronRight size={32} />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Slide Navigation Dots */}
      <motion.nav 
        className="slide-dots"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[...Array(totalSlides)].map((_, index) => (
          <motion.button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => onGoToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            animate={{
              scale: index === currentSlide ? 1.3 : 1,
              backgroundColor: index === currentSlide ? '#6366f1' : 'rgba(255, 255, 255, 0.3)'
            }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ))}
      </motion.nav>
      
      {/* Progress Bar */}
      <motion.div 
        className="progress-bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div 
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </motion.div>
    </>
  )
}