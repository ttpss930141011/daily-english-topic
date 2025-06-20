'use client'

import React, { useEffect, useRef } from 'react'
import { useWordLookup } from '@/contexts/WordLookupContext'
import { ChevronDown, Volume2 } from 'lucide-react'

interface QuickLookupPopupProps {
  className?: string
}

export function QuickLookupPopup({ className = '' }: QuickLookupPopupProps) {
  const {
    showQuickLookup,
    activeSelection,
    currentDictionary,
    isLoadingDictionary,
    hideQuickLookup,
    lookupWord,
    playPronunciation
  } = useWordLookup()

  const popupRef = useRef<HTMLDivElement>(null)

  // Position popup relative to selection
  useEffect(() => {
    if (showQuickLookup && activeSelection && popupRef.current) {
      const popup = popupRef.current
      const { x, y } = activeSelection.position
      
      // Calculate position with screen bounds checking
      const viewportWidth = window.innerWidth
      const popupRect = popup.getBoundingClientRect()
      
      let left = x - popupRect.width / 2
      let top = y - popupRect.height - 10 // 10px above selection
      
      // Adjust horizontal position if popup goes off screen
      if (left < 10) left = 10
      if (left + popupRect.width > viewportWidth - 10) {
        left = viewportWidth - popupRect.width - 10
      }
      
      // Adjust vertical position if popup goes off screen
      if (top < 10) {
        top = y + 30 // Show below selection instead
      }
      
      popup.style.left = `${left}px`
      popup.style.top = `${top}px`
    }
  }, [showQuickLookup, activeSelection])

  // Auto-lookup word when selection changes
  useEffect(() => {
    if (showQuickLookup && activeSelection?.isWord && activeSelection.text) {
      lookupWord(activeSelection.text)
    }
  }, [showQuickLookup, activeSelection, lookupWord])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        hideQuickLookup()
      }
    }

    if (showQuickLookup) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showQuickLookup, hideQuickLookup])

  if (!showQuickLookup || !activeSelection?.isWord) {
    return null
  }

  const handlePronunciationClick = () => {
    if (currentDictionary) {
      playPronunciation(currentDictionary.word, currentDictionary.audioUrl)
    }
  }

  return (
    <div
      ref={popupRef}
      className={`fixed z-50 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-xl p-4 max-w-sm min-w-[280px] ${className}`}
      style={{ 
        position: 'fixed',
        animation: 'fadeInScale 200ms ease-out'
      }}
    >
      {/* Loading State */}
      {isLoadingDictionary && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
          <span className="text-sm text-gray-600">正在查詢...</span>
        </div>
      )}

      {/* Dictionary Content */}
      {!isLoadingDictionary && currentDictionary && (
        <div className="space-y-3">
          {/* Word and Pronunciation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentDictionary.word}
              </h3>
              {currentDictionary.phonetic && (
                <span className="text-sm font-mono text-gray-500">
                  {currentDictionary.phonetic}
                </span>
              )}
            </div>
            <button
              onClick={handlePronunciationClick}
              className="p-1 hover:bg-purple-100 rounded transition-colors"
              title="播放發音"
            >
              <Volume2 className="h-4 w-4 text-purple-600" />
            </button>
          </div>

          {/* Definitions */}
          <div className="space-y-2">
            {currentDictionary.definitions.slice(0, 2).map((def, index) => (
              <div key={index} className="border-l-3 border-purple-200 pl-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {def.partOfSpeech}
                  </span>
                </div>
                <p className="text-sm text-gray-800 mb-1">
                  {def.translation}
                </p>
                <p className="text-xs text-gray-600">
                  {def.definition}
                </p>
                {def.example && (
                  <p className="text-xs text-gray-500 italic mt-1">
                    &ldquo;{def.example}&rdquo;
                  </p>
                )}
              </div>
            ))}
            
            {currentDictionary.definitions.length > 2 && (
              <button className="text-xs text-purple-600 hover:text-purple-800 flex items-center space-x-1">
                <span>查看更多定義</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoadingDictionary && !currentDictionary && (
        <div className="text-sm text-gray-600">
          <p>找不到「{activeSelection.text}」的定義</p>
          <p className="text-xs text-gray-500 mt-1">請檢查拼寫或嘗試其他單字</p>
        </div>
      )}

      {/* Close button */}
      <button
        onClick={hideQuickLookup}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        title="關閉"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}