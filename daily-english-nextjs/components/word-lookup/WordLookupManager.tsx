'use client'

import React, { useRef } from 'react'
import { useTextSelection } from '@/hooks/useTextSelection'
import { useWordLookup } from '@/contexts/WordLookupContext'
import { QuickLookupPopup } from './QuickLookupPopup'
import { ContextMenu } from './ContextMenu'

interface WordLookupManagerProps {
  children: React.ReactNode
  className?: string
}

export function WordLookupManager({ children, className = '' }: WordLookupManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    showQuickLookupPopup,
    showContextMenuAt
  } = useWordLookup()

  // Setup text selection detection
  const { isSelecting } = useTextSelection({
    containerRef,
    onWordDoubleClick: (selection) => {
      showQuickLookupPopup(selection)
    },
    onTextSelect: (selection) => {
      if (!selection.isWord) {
        showContextMenuAt(selection)
      }
    },
    minSelectionLength: 1,
    debounceMs: 300
  })

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ userSelect: 'text' }}
    >
      {/* Main content */}
      {children}
      
      {/* Word lookup UI components */}
      <QuickLookupPopup />
      <ContextMenu />
      
      {/* Selection indicator for debugging in development */}
      {process.env.NODE_ENV === 'development' && isSelecting && (
        <div className="fixed top-4 left-4 bg-blue-500 text-white px-2 py-1 text-xs rounded z-50">
          Selecting...
        </div>
      )}
    </div>
  )
}