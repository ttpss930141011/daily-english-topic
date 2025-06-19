'use client'

import { useState, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import { Topic, Slide } from '@/lib/topics'
import WordPopup from '@/components/WordPopup'
import BuyMeACoffeeButton from '@/components/BuyMeACoffeeButton'

interface SlideViewerProps {
  topic: Topic
  interactive?: boolean
  theme?: 'light' | 'dark'
}

export default function SlideViewer({
  topic,
  interactive = true
}: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null)

  // Define navigation functions first
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, topic.slides.length - 1))
  }, [topic.slides.length])

  const previousSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(Math.max(0, Math.min(index, topic.slides.length - 1)))
  }, [topic.slides.length])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          previousSlide()
          break
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          nextSlide()
          break
        case 'Home':
          setCurrentSlide(0)
          break
        case 'End':
          setCurrentSlide(topic.slides.length - 1)
          break
        case 'Escape':
          if (selectedWord) {
            setSelectedWord(null)
          } else if (isFullscreen) {
            exitFullscreen()
          }
          break
        case 'f':
        case 'F11':
          event.preventDefault()
          toggleFullscreen()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, topic.slides.length, selectedWord, isFullscreen, nextSlide, previousSlide, toggleFullscreen, exitFullscreen])

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
      />
    )
  }

  const currentSlideData = topic.slides[currentSlide]

  // Sync fullscreen state with external fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className={`h-screen flex flex-col bg-slate-800 text-white ${isFullscreen ? 'fixed top-0 left-0 w-screen z-[9999]' : ''}`}>
      {/* Navigation Header */}
      {!isFullscreen && (
        <header className="bg-black/10 backdrop-blur-lg px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold mb-1">{topic.title}</h1>
            <div className="text-slate-400 text-sm">
              Slide {currentSlide + 1} of {topic.slides.length}
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={toggleFullscreen} 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 border-none cursor-pointer"
            >
              🔳 Fullscreen
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 border-none cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </header>
      )}

      {/* Main Slide Display */}
      <main className="flex-1 flex items-center justify-center relative p-8">
        <div className="max-w-4xl w-full aspect-video bg-white text-slate-800 rounded-2xl p-12 flex flex-col justify-center shadow-2xl text-xl leading-relaxed overflow-hidden">
          <div className="overflow-y-auto max-h-full slide-content">
            {renderSlideContent(currentSlideData)}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          className={`absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full backdrop-blur-lg text-2xl flex items-center justify-center transition-all duration-200 border-none cursor-pointer
            ${currentSlide === 0 
              ? 'bg-white/5 text-white/30 cursor-not-allowed' 
              : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'
            }`}
          onClick={previousSlide}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          className={`absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full backdrop-blur-lg text-2xl flex items-center justify-center transition-all duration-200 border-none cursor-pointer
            ${currentSlide === topic.slides.length - 1 
              ? 'bg-white/5 text-white/30 cursor-not-allowed' 
              : 'bg-white/10 hover:bg-white/20 text-white hover:scale-110'
            }`}
          onClick={nextSlide}
          disabled={currentSlide === topic.slides.length - 1}
          aria-label="Next slide"
        >
          →
        </button>
      </main>

      {/* Slide Navigation Dots */}
      <nav className="flex justify-center gap-2 px-4 py-4">
        {topic.slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 border-none cursor-pointer ${
              index === currentSlide
                ? 'bg-white scale-[1.2]'
                : 'bg-white/30 hover:bg-white/60'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </nav>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / topic.slides.length) * 100}%` }}
        />
      </div>

      {/* Buy Me a Coffee Button - Show on last slide */}
      {currentSlide === topic.slides.length - 1 && !isFullscreen && (
        <div className="px-8 py-6">
          <BuyMeACoffeeButton />
        </div>
      )}

      {/* Word Popup */}
      {selectedWord && wordPosition && (
        <WordPopup
          word={selectedWord}
          position={wordPosition}
          onClose={() => setSelectedWord(null)}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      {isFullscreen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-lg text-white px-4 py-2 rounded-lg text-sm z-50">
          <div className="text-center">
            ← → Navigation | F Fullscreen | ESC Exit
          </div>
        </div>
      )}
    </div>
  )
}