/**
 * Animation configurations for framer-motion
 * Centralized animation settings for consistency and maintainability
 */

import { Variants, Transition } from 'framer-motion'

/**
 * Page transition animations
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(10px)',
  },
  in: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  out: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(10px)',
  }
}

export const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6
}

/**
 * Slide transition animations for SlideViewer
 */
export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
}

export const slideTransition: Transition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
}

/**
 * Card animations for homepage
 */
export const cardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

/**
 * Popup animations
 */
export const popupVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: -10 }
}

export const popupTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25
}

/**
 * Header animations
 */
export const headerVariants: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 }
}

export const headerTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30
}

/**
 * Stagger animations for lists
 */
export const staggerParent: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const staggerChild: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

/**
 * Common hover animations
 */
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 8px 30px rgba(99, 102, 241, 0.3)",
    transition: { duration: 0.3 }
  }
}

/**
 * Loading spinner animation
 */
export const spinnerAnimation = {
  animate: { rotate: 360 },
  transition: { 
    duration: 1, 
    repeat: Infinity, 
    ease: "linear" as const 
  } as Transition
}

/**
 * Floating particle animation
 */
export const particleAnimation = (delay: number = 0) => ({
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 1, 0],
    x: [0, Math.random() * 400 - 200],
    y: [0, Math.random() * -600 - 100],
  },
  transition: {
    duration: Math.random() * 10 + 10,
    repeat: Infinity,
    delay: delay,
  }
})

/**
 * Shine effect animation
 */
export const shineAnimation = {
  animate: {
    x: ['-100%', '200%']
  },
  transition: { duration: 0.6 }
}

/**
 * Common animations for components
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}