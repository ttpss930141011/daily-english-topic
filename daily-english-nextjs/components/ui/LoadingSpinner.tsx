/**
 * LoadingSpinner Component
 * Reusable loading spinner with size variants
 */

import { motion } from 'framer-motion'
import clsx from 'clsx'
import { spinnerAnimation } from '@/lib/animations'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'currentColor',
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }
  
  return (
    <motion.div
      className={clsx(
        'border-current border-t-transparent rounded-full',
        sizeClasses[size],
        className
      )}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
      {...spinnerAnimation}
    />
  )
}