'use client'

import { useState, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import { motion, AnimatePresence } from 'framer-motion'
import { Topic, Slide, SlideViewerProps } from '@/types'
import { slideVariants, slideTransition } from '@/lib'
import { useKeyboardNavigation, useFullscreen } from '@/hooks'
import { SlideHeader, SlideNavigation } from '@/components/slide'
import WordPopup from '@/components/WordPopup'


export default function SlideViewer({
  topic,
  interactive = true,
  theme = 'light'
}: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null)
  const [[page, direction], setPage] = useState([0, 0])
  
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen()

  const nextSlide = useCallback(() => {
    if (currentSlide < topic.slides.length - 1) {
      setCurrentSlide(prev => prev + 1)
    }
  }, [currentSlide, topic.slides.length])

  const previousSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }, [currentSlide])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: nextSlide,
    onPrevious: previousSlide,
    onEscape: () => {
      if (isFullscreen) {
        exitFullscreen()
      }
    },
    onFullscreen: toggleFullscreen,
    enabled: true
  })

  const handleWordClick = useCallback((word: string, event: React.MouseEvent) => {
    if (!interactive) return

    setSelectedWord(word)
    setWordPosition({ x: event.clientX, y: event.clientY })
  }, [interactive])

  const renderSlideContent = (slide: Slide) => {
    if (!interactive) {
      // Simple markdown rendering without interactive words
      return <div dangerouslySetInnerHTML={{ __html: marked(slide.content) }} />
    }

    // Parse and render with interactive words
    let html = marked(slide.content) as string

    // Add interactive word spans
    slide.interactiveWords?.forEach(wordObj => {
      const regex = new RegExp(`\\b${wordObj.word}\\b`, 'gi')
      html = html.replace(regex, (match) =>
        `<span class="interactive-word" data-word="${wordObj.word.toLowerCase()}">${match}</span>`
      )
    })

    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.classList.contains('interactive-word')) {
            const word = target.getAttribute('data-word')
            if (word) {
              handleWordClick(word, e)
            }
          }
        }}
        className="slide-content"
      />
    )
  }

  // Update page direction for animations
  useEffect(() => {
    setPage([currentSlide, currentSlide > page ? 1 : -1])
  }, [currentSlide, page])
  
  const currentSlideData = topic.slides[currentSlide]

  return (
    <motion.div 
      className={`slide-viewer ${theme} ${isFullscreen ? 'fullscreen' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Navigation Header */}
      <AnimatePresence>
        {!isFullscreen && (
          <SlideHeader
            currentSlide={currentSlide}
            totalSlides={topic.slides.length}
            title={topic.title}
            onFullscreen={toggleFullscreen}
            onBack={() => window.history.back()}
          />
        )}
      </AnimatePresence>

      {/* Main Slide Display */}
      <main className="slide-container">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className={`slide slide-${currentSlideData.type}`}
          >
            {renderSlideContent(currentSlideData)}
          </motion.div>
        </AnimatePresence>
        
        <SlideNavigation
          currentSlide={currentSlide}
          totalSlides={topic.slides.length}
          onNext={nextSlide}
          onPrevious={previousSlide}
          onGoToSlide={goToSlide}
        />
      </main>

      {/* Word Popup */}
      {selectedWord && wordPosition && (
        <WordPopup
          word={selectedWord}
          position={wordPosition}
          onClose={() => {
            setSelectedWord(null)
            setWordPosition(null)
          }}
        />
      )}
    </motion.div>
  )
}