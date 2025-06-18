/**
 * useKeyboardNavigation Hook
 * Handles keyboard navigation for slide viewers and other components
 */

import { useEffect, useCallback } from 'react'

interface KeyboardNavigationOptions {
  onNext?: () => void
  onPrevious?: () => void
  onHome?: () => void
  onEnd?: () => void
  onEscape?: () => void
  onFullscreen?: () => void
  enabled?: boolean
}

export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onHome,
  onEnd,
  onEscape,
  onFullscreen,
  enabled = true
}: KeyboardNavigationOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        onPrevious?.()
        break
        
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
        event.preventDefault()
        onNext?.()
        break
        
      case 'Home':
        event.preventDefault()
        onHome?.()
        break
        
      case 'End':
        event.preventDefault()
        onEnd?.()
        break
        
      case 'Escape':
        event.preventDefault()
        onEscape?.()
        break
        
      case 'f':
      case 'F11':
        event.preventDefault()
        onFullscreen?.()
        break
    }
  }, [enabled, onNext, onPrevious, onHome, onEnd, onEscape, onFullscreen])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}