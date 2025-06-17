import { useState } from 'react'

interface InteractiveWordProps {
  word: string
  children: React.ReactNode
  onClick?: (word: string, event: React.MouseEvent) => void
  className?: string
}

export default function InteractiveWord({ 
  word, 
  children, 
  onClick,
  className = ''
}: InteractiveWordProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    onClick?.(word, event)
  }

  return (
    <span
      className={`interactive-word ${className} ${isHovered ? 'hovered' : ''}`}
      data-word={word}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Click to learn about "${word}"`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          const mouseEvent = {
            ...e,
            clientX: 0,
            clientY: 0,
            preventDefault: () => {},
            stopPropagation: () => {}
          } as any
          onClick?.(word, mouseEvent)
        }
      }}
    >
      {children}
    </span>
  )
}