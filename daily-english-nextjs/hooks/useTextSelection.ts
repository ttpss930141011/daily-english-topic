import { useState, useEffect, useCallback, useRef } from 'react'
import { textSelectionManager } from '@/lib/text-selection-manager'

export interface TextSelection {
  text: string
  position: { x: number; y: number }
  isWord: boolean // true if single word, false if phrase/sentence
  element: Element | null
}

export interface UseTextSelectionOptions {
  containerRef: React.RefObject<HTMLElement | null>
  onWordDoubleClick?: (selection: TextSelection) => void
  onTextSelect?: (selection: TextSelection) => void
  minSelectionLength?: number
  debounceMs?: number
  /**
   * Container ID for text selection management.
   * Used to determine if selections should be allowed.
   */
  containerId?: string
}

/**
 * Custom hook for text selection with container-aware exclusion logic.
 * Follows Single Responsibility and Dependency Inversion principles.
 * 
 * @param options - Configuration options for text selection behavior
 * @returns Text selection state and utility functions
 */
export function useTextSelection({
  containerRef,
  onWordDoubleClick,
  onTextSelect,
  minSelectionLength = 1,
  debounceMs = 300,
  containerId
}: UseTextSelectionOptions) {
  const [selection, setSelection] = useState<TextSelection | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMouseDownRef = useRef(false)
  const hasSelectedTextRef = useRef(false)

  // Clean text and check if it's a single word
  const cleanAndAnalyzeText = useCallback((text: string) => {
    const cleaned = text.trim().replace(/[^\w\s'-]/g, '')
    const words = cleaned.split(/\s+/).filter(word => word.length > 0)
    return {
      cleanText: cleaned,
      isWord: words.length === 1 && words[0].length > 0,
      wordCount: words.length
    }
  }, [])

  // Get selection position relative to viewport
  const getSelectionPosition = useCallback((range: Range): { x: number; y: number } => {
    const rect = range.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top
    }
  }, [])

  /**
   * Handles double click events for single word lookup.
   * Includes container exclusion logic to prevent interference.
   * 
   * @param event - Mouse event from double click
   */
  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) return

    // Check if selection should be allowed in this container
    if (!textSelectionManager.shouldAllowSelection(event.target as Node)) {
      return
    }

    const element = event.target as Element
    
    // Get word under cursor
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    let text = selection.toString().trim()

    // If no selection, try to select word under cursor
    if (!text) {
      const textNode = element.childNodes[0]
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        const fullText = textNode.textContent || ''
        const offset = range.startOffset
        
        // Find word boundaries
        const before = fullText.slice(0, offset).split(/\s/).pop() || ''
        const after = fullText.slice(offset).split(/\s/)[0] || ''
        text = before + after
      }
    }

    const { cleanText, isWord } = cleanAndAnalyzeText(text)
    
    if (cleanText && isWord && cleanText.length >= minSelectionLength) {
      const position = getSelectionPosition(range)
      const textSelection: TextSelection = {
        text: cleanText,
        position,
        isWord: true,
        element
      }
      
      setSelection(textSelection)
      onWordDoubleClick?.(textSelection)
    }
  }, [containerRef, onWordDoubleClick, cleanAndAnalyzeText, getSelectionPosition, minSelectionLength])

  /**
   * Handles mouse down events to start tracking text selection.
   * Includes container exclusion check.
   * 
   * @param event - Mouse down event
   */
  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) return
    
    // Check if selection should be allowed in this container
    if (!textSelectionManager.shouldAllowSelection(event.target as Node)) {
      return
    }
    
    isMouseDownRef.current = true
    hasSelectedTextRef.current = false
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    // Clear previous selection state
    setIsSelecting(false)
    setSelection(null)
  }, [containerRef])

  /**
   * Handles mouse up events to complete text selection.
   * Includes container exclusion and validation logic.
   * 
   * @param event - Mouse up event
   */
  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!isMouseDownRef.current) return
    
    isMouseDownRef.current = false
    
    // Only process if mouse up is within our container
    if (!containerRef.current?.contains(event.target as Node)) return

    // Check if selection should be allowed in this container
    if (!textSelectionManager.shouldAllowSelection(event.target as Node)) {
      return
    }

    // Small delay to ensure selection is finalized
    setTimeout(() => {
      const windowSelection = window.getSelection()
      if (!windowSelection || windowSelection.rangeCount === 0) {
        setIsSelecting(false)
        return
      }

      const range = windowSelection.getRangeAt(0)
      const text = windowSelection.toString().trim()

      if (!text || text.length < minSelectionLength) {
        setIsSelecting(false)
        return
      }

      // Check if selection is within our container
      const containerElement = containerRef.current
      if (!containerElement?.contains(range.commonAncestorContainer)) {
        return
      }

      // Mark that we have selected text
      hasSelectedTextRef.current = true
      setIsSelecting(true)

      // Process the selection after a brief delay
      debounceTimeoutRef.current = setTimeout(() => {
        // Double-check selection still exists
        const currentSelection = window.getSelection()
        const currentText = currentSelection?.toString().trim()
        
        if (!currentText || currentText.length < minSelectionLength) {
          setIsSelecting(false)
          return
        }

        const { cleanText, isWord, wordCount } = cleanAndAnalyzeText(currentText)
        
        if (cleanText && wordCount > 0) {
          const currentRange = currentSelection!.getRangeAt(0)
          const position = getSelectionPosition(currentRange)
          const textSelection: TextSelection = {
            text: cleanText,
            position,
            isWord,
            element: currentRange.commonAncestorContainer.parentElement
          }
          
          setSelection(textSelection)
          onTextSelect?.(textSelection)
        }
        setIsSelecting(false)
      }, debounceMs)
    }, 50) // 50ms delay to ensure selection is complete
  }, [containerRef, onTextSelect, cleanAndAnalyzeText, getSelectionPosition, minSelectionLength, debounceMs])

  // Handle selection change - only for visual feedback during drag
  const handleSelectionChange = useCallback(() => {
    if (!isMouseDownRef.current || !containerRef.current) return

    const windowSelection = window.getSelection()
    const text = windowSelection?.toString().trim()

    // Only show selecting state if user is actively dragging and has some text
    if (text && text.length >= minSelectionLength && !hasSelectedTextRef.current) {
      setIsSelecting(true)
    }
  }, [containerRef, minSelectionLength])

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelection(null)
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    window.getSelection()?.removeAllRanges()
  }, [])

  // Setup event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('dblclick', handleDoubleClick)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      container.removeEventListener('dblclick', handleDoubleClick)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('selectionchange', handleSelectionChange)
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [handleDoubleClick, handleMouseDown, handleMouseUp, handleSelectionChange])

  // Clear selection when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        clearSelection()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clearSelection, containerRef])

  return {
    selection,
    isSelecting,
    clearSelection
  }
}