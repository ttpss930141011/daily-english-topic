'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useWordLookup } from '@/contexts/WordLookupContext'
import { X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { marked } from 'marked'
import { type Dictionary } from '@/types/dictionary'

interface DeepLearningDrawerProps {
  className?: string
  dictionary: Dictionary
}

export function DeepLearningDrawer({ className = '', dictionary }: DeepLearningDrawerProps) {
  const {
    showDeepDrawer,
    isDeepDrawerMinimized,
    deepDrawerWidth,
    deepTabs,
    activeTabId,
    closeDeepDrawer,
    closeDeepTab,
    switchToTab,
    explainText,
    activeSelection,
    minimizeDeepDrawer,
    maximizeDeepDrawer,
    toggleDeepDrawerMinimized,
    setDeepDrawerWidth
  } = useWordLookup()

  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartWidth, setDragStartWidth] = useState(0)

  // Auto-focus on drawer open
  useEffect(() => {
    if (showDeepDrawer && !isDeepDrawerMinimized && drawerRef.current) {
      drawerRef.current.focus()
    }
  }, [showDeepDrawer, isDeepDrawerMinimized])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showDeepDrawer || isDeepDrawerMinimized) return

      switch (event.key) {
        case 'Escape':
          closeDeepDrawer()
          break
        case 'Tab':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            const currentIndex = deepTabs.findIndex(tab => tab.id === activeTabId)
            const nextIndex = event.shiftKey 
              ? (currentIndex - 1 + deepTabs.length) % deepTabs.length
              : (currentIndex + 1) % deepTabs.length
            
            if (deepTabs[nextIndex]) {
              switchToTab(deepTabs[nextIndex].id)
            }
          }
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          if (event.altKey && deepTabs.length > 0) {
            event.preventDefault()
            const index = parseInt(event.key) - 1
            if (deepTabs[index]) {
              switchToTab(deepTabs[index].id)
            }
          }
          break
      }
    }

    if (showDeepDrawer) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showDeepDrawer, isDeepDrawerMinimized, deepTabs, activeTabId, closeDeepDrawer, switchToTab])

  const activeTab = deepTabs.find(tab => tab.id === activeTabId)

  const handleRetry = async () => {
    if (activeTab && activeSelection) {
      await explainText(activeTab.originalText)
    }
  }

  // Drag to resize functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragStartWidth(deepDrawerWidth)
    e.preventDefault()
  }, [deepDrawerWidth])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = dragStartX - e.clientX
    const newWidth = dragStartWidth + deltaX
    setDeepDrawerWidth(newWidth)
  }, [isDragging, dragStartX, dragStartWidth, setDeepDrawerWidth])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  if (!showDeepDrawer) {
    return null
  }

  // Minimized state - water-drop shape on the right edge
  if (isDeepDrawerMinimized) {
    return (
      <div
        className="fixed top-1/2 right-0 -translate-y-1/2 z-40 group"
        style={{
          width: '40px',
          height: '80px',
          clipPath: 'ellipse(80% 60% at 35% 50%)',
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          cursor: 'pointer'
        }}
        onClick={maximizeDeepDrawer}
        onMouseEnter={(e) => {
          e.currentTarget.style.clipPath = 'ellipse(90% 70% at 30% 50%)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.clipPath = 'ellipse(80% 60% at 35% 50%)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <ChevronRight className="h-4 w-4 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Left-side collapse tab when expanded */}
      <div
        className="fixed top-1/2 z-30 group"
        style={{
          left: `${deepDrawerWidth - 20}px`,
          transform: 'translateY(-50%)',
          width: '30px',
          height: '60px',
          clipPath: 'ellipse(70% 60% at 65% 50%)',
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          cursor: 'pointer'
        }}
        onClick={minimizeDeepDrawer}
        onMouseEnter={(e) => {
          e.currentTarget.style.clipPath = 'ellipse(80% 70% at 60% 50%)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.clipPath = 'ellipse(70% 60% at 65% 50%)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <ChevronLeft className="h-3 w-3 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        data-container="deep-learning-drawer"
        className={`fixed top-0 right-0 h-full bg-white border-l border-gray-200 shadow-2xl z-40 flex flex-col ${className}`}
        style={{ 
          width: `${deepDrawerWidth}px`,
          animation: 'slideInRight 300ms ease-out'
        }}
      >
        {/* Drag handle */}
        <div
          ref={resizeHandleRef}
          className="absolute left-0 top-0 w-1 h-full bg-transparent hover:bg-purple-400 cursor-col-resize z-50"
          onMouseDown={handleMouseDown}
          style={{
            background: isDragging ? '#a855f7' : 'transparent'
          }}
        />

        {/* Header */}
        <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">{dictionary.wordLookup.detailedLearning}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDeepDrawerMinimized}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title={dictionary.wordLookup.minimizeDrawer}
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={closeDeepDrawer}
                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                title={dictionary.wordLookup.closeDrawer}
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tab Bar */}
          {deepTabs.length > 0 && (
            <div className="flex space-x-1 overflow-x-auto pb-1">
              {deepTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors ${
                    tab.id === activeTabId
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => switchToTab(tab.id)}
                >
                  <span className="truncate max-w-[120px]">{tab.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeDeepTab(tab.id)
                    }}
                    className="p-0.5 hover:bg-gray-300 rounded"
                    title={dictionary.wordLookup.closeTab}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
          {activeTab ? (
            <div className="space-y-4">
              {activeTab.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-3 text-gray-600">{dictionary.wordLookup.generating}</span>
                </div>
              ) : activeTab.content ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: marked(activeTab.content) }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">{dictionary.wordLookup.noContent}</p>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {dictionary.wordLookup.regenerate}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{dictionary.wordLookup.selectTextToLearn}</p>
            </div>
          )}
        </div>

        {/* Footer with shortcuts */}
        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-3">
          <p className="text-xs text-gray-500 text-center">
            {dictionary.wordLookup.keyboardShortcuts}
          </p>
        </div>
      </div>
    </>
  )
}