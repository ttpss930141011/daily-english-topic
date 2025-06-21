'use client'

import React, { useEffect, useRef } from 'react'
import { useWordLookup } from '@/contexts/WordLookupContext'
import { X, RotateCcw } from 'lucide-react'
import { marked } from 'marked'
import { type Dictionary } from '@/types/dictionary'

interface DeepLearningDrawerProps {
  className?: string
  dictionary: Dictionary
}

export function DeepLearningDrawer({ className = '', dictionary }: DeepLearningDrawerProps) {
  const {
    showDeepDrawer,
    deepTabs,
    activeTabId,
    closeDeepDrawer,
    closeDeepTab,
    switchToTab,
    explainText,
    activeSelection
  } = useWordLookup()

  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Auto-focus on drawer open
  useEffect(() => {
    if (showDeepDrawer && drawerRef.current) {
      drawerRef.current.focus()
    }
  }, [showDeepDrawer])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showDeepDrawer) return

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
      }
    }

    if (showDeepDrawer) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showDeepDrawer, deepTabs, activeTabId, closeDeepDrawer, switchToTab])

  const activeTab = deepTabs.find(tab => tab.id === activeTabId)

  const handleRetry = async () => {
    if (activeTab && activeSelection) {
      await explainText(activeTab.originalText)
    }
  }

  if (!showDeepDrawer) {
    return null
  }

  return (
    <div
      ref={drawerRef}
      tabIndex={-1}
      data-container="deep-learning-drawer"
      className={`fixed top-0 right-0 h-full w-full md:w-2/5 lg:w-1/3 bg-white border-l border-gray-200 shadow-2xl z-40 flex flex-col ${className}`}
      style={{ 
        animation: 'slideInRight 300ms ease-out'
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">{dictionary.wordLookup.detailedLearning}</h2>
          <button
            onClick={closeDeepDrawer}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title={dictionary.wordLookup.closeDrawer}
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Tab Bar */}
        {deepTabs.length > 0 && (
          <div className="flex space-x-1 overflow-x-auto pb-1">
            {deepTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchToTab(tab.id)}
                className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-t-lg border-b-2 transition-colors ${
                  tab.id === activeTabId
                    ? 'bg-white text-purple-700 border-purple-500'
                    : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2 max-w-[120px]">
                  <span className="truncate">{tab.title}</span>
                  {tab.isLoading && (
                    <div className="animate-spin rounded-full h-3 w-3 border border-purple-500 border-t-transparent"></div>
                  )}
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
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab ? (
          <div className="h-full flex flex-col">
            {/* Tab header with original text */}
            <div className="flex-shrink-0 bg-purple-50 border-b border-purple-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-purple-900">
                    &ldquo;{activeTab.originalText}&rdquo;
                  </h3>
                  <p className="text-xs text-purple-600 mt-1">
                    {new Date(activeTab.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {!activeTab.isLoading && (
                  <button
                    onClick={handleRetry}
                    className="p-2 hover:bg-purple-100 rounded transition-colors"
                    title={dictionary.wordLookup.regenerate}
                  >
                    <RotateCcw className="h-4 w-4 text-purple-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Content area */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-y-auto p-4 bg-white"
            >
              {activeTab.isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
                    <span className="text-gray-600">{dictionary.wordLookup.generating}</span>
                  </div>
                  
                  {/* Streaming indicator */}
                  <div className="space-y-3">
                    {activeTab.content && (
                      <div 
                        className="prose prose-sm max-w-none animate-pulse"
                        dangerouslySetInnerHTML={{ 
                          __html: marked(activeTab.content) 
                        }}
                      />
                    )}
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked(activeTab.content || dictionary.wordLookup.noContent) 
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-medium mb-2">{dictionary.wordLookup.aiAssistant}</h3>
              <p className="text-sm">{dictionary.wordLookup.selectTextToLearn}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with shortcuts */}
      <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-4 py-2">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>{dictionary.wordLookup.shortcuts}</span>
            <span>{dictionary.wordLookup.keyboardShortcuts}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}