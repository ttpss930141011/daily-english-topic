import { useState, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import { Topic, Slide } from '@/lib/topics'
import InteractiveWord from '@/components/InteractiveWord'
import WordPopup from '@/components/WordPopup'

interface SlideViewerProps {
  topic: Topic
  interactive?: boolean
  theme?: 'light' | 'dark'
}

export default function SlideViewer({ 
  topic, 
  interactive = true, 
  theme = 'light' 
}: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null)

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
  }, [currentSlide, topic.slides.length, selectedWord, isFullscreen])

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

  return (
    <div className={`slide-viewer ${theme} ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Navigation Header */}
      {!isFullscreen && (
        <header className="slide-header">
          <div className="slide-info">
            <h1>{topic.title}</h1>
            <div className="slide-progress">
              Slide {currentSlide + 1} of {topic.slides.length}
            </div>
          </div>
          <div className="slide-controls">
            <button onClick={toggleFullscreen} className="control-btn">
              🔳 Fullscreen
            </button>
            <button onClick={() => window.history.back()} className="control-btn">
              ← Back
            </button>
          </div>
        </header>
      )}

      {/* Main Slide Display */}
      <main className="slide-container">
        <div className={`slide slide-${currentSlideData.type}`}>
          {renderSlideContent(currentSlideData)}
        </div>

        {/* Navigation Arrows */}
        <button 
          className="nav-arrow nav-prev" 
          onClick={previousSlide}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          ←
        </button>
        <button 
          className="nav-arrow nav-next" 
          onClick={nextSlide}
          disabled={currentSlide === topic.slides.length - 1}
          aria-label="Next slide"
        >
          →
        </button>
      </main>

      {/* Slide Navigation Dots */}
      <nav className="slide-dots">
        {topic.slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </nav>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentSlide + 1) / topic.slides.length) * 100}%` }}
        />
      </div>

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
        <div className="keyboard-help">
          <div className="help-text">
            ← → Navigation | F Fullscreen | ESC Exit
          </div>
        </div>
      )}
    </div>
  )
}