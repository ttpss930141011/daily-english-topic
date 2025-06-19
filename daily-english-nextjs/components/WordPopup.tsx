import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, X, BookOpen, Sparkles } from 'lucide-react'

interface WordDefinition {
  word: string
  phonetics: Array<{
    text?: string
    audio?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
    }>
  }>
}

interface WordPopupProps {
  word: string
  position: { x: number; y: number }
  onClose: () => void
}

export default function WordPopup({ word, position, onClose }: WordPopupProps) {
  const [definition, setDefinition] = useState<WordDefinition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDefinition = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        
        if (!response.ok) {
          throw new Error('Definition not found')
        }
        
        const data = await response.json()
        setDefinition(data[0])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch definition')
      } finally {
        setLoading(false)
      }
    }

    fetchDefinition()
  }, [word])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popup = document.querySelector('.word-popup')
      if (popup && !popup.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl)
    audio.play().catch(console.error)
  }

  // Calculate popup position to stay within viewport
  const getPopupStyle = () => {
    const popupWidth = 320
    const popupHeight = 200
    const margin = 20

    let left = position.x
    let top = position.y + 20

    // Adjust if popup would go off right edge
    if (left + popupWidth > window.innerWidth - margin) {
      left = window.innerWidth - popupWidth - margin
    }

    // Adjust if popup would go off bottom edge
    if (top + popupHeight > window.innerHeight - margin) {
      top = position.y - popupHeight - 10
    }

    // Ensure minimum margins
    left = Math.max(margin, left)
    top = Math.max(margin, top)

    return {
      left: `${left}px`,
      top: `${top}px`
    }
  }

  return (
    <motion.div 
      className="word-popup" 
      style={getPopupStyle()}
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div 
        className="popup-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className="popup-word">
          <Sparkles size={18} className="word-icon" />
          {word}
        </span>
        <motion.button 
          className="popup-close" 
          onClick={onClose} 
          aria-label="Close popup"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      </motion.div>

      <div className="popup-content">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              className="popup-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading...
              </motion.span>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="popup-error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="popup-pronunciation">
                <motion.button 
                  className="speak-button" 
                  onClick={() => speak(word)}
                  aria-label="Pronounce word"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Volume2 size={20} />
                </motion.button>
              </div>
              <div className="popup-definition">
                {error}. Click the speaker to hear pronunciation.
              </div>
            </motion.div>
          )}

          {definition && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
            >
            <div className="popup-pronunciation">
              {definition.phonetics.find(p => p.text) && (
                <span className="popup-phonetic">
                  {definition.phonetics.find(p => p.text)?.text}
                </span>
              )}
              <div className="audio-buttons">
                {definition.phonetics.find(p => p.audio) && (
                  <motion.button 
                    className="speak-button" 
                    onClick={() => {
                      const audioUrl = definition.phonetics.find(p => p.audio)?.audio
                      if (audioUrl) playAudio(audioUrl)
                    }}
                    aria-label="Play audio pronunciation"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Volume2 size={18} />
                  </motion.button>
                )}
                <motion.button 
                  className="speak-button" 
                  onClick={() => speak(word)}
                  aria-label="Text-to-speech pronunciation"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <BookOpen size={18} />
                </motion.button>
              </div>
            </div>

            {definition.meanings.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="popup-definition">
                  <strong>{definition.meanings[0].partOfSpeech}</strong>: {' '}
                  {definition.meanings[0].definitions[0].definition}
                </div>

                {definition.meanings[0].definitions[0].example && (
                  <div className="popup-example">
                    &ldquo;{definition.meanings[0].definitions[0].example}&rdquo;
                  </div>
                )}
              </motion.div>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}