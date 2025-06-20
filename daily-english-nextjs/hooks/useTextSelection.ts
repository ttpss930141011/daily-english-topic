import { useState, useEffect, useCallback, useRef } from 'react'

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
}

export function useTextSelection({
  containerRef,
  onWordDoubleClick,
  onTextSelect,
  minSelectionLength = 1,
  debounceMs = 300
}: UseTextSelectionOptions) {
  const [selection, setSelection] = useState<TextSelection | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  // Handle double click for single word lookup
  const handleDoubleClick = useCallback((event: MouseEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) return

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

  // Handle text selection (drag)
  const handleSelectionChange = useCallback(() => {
    if (!containerRef.current) return

    const windowSelection = window.getSelection()
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setIsSelecting(false)
      return
    }

    const range = windowSelection.getRangeAt(0)
    const text = windowSelection.toString().trim()

    // Clear existing debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    if (!text || text.length < minSelectionLength) {
      setIsSelecting(false)
      return
    }

    // Check if selection is within our container
    const containerElement = containerRef.current
    if (!containerElement.contains(range.commonAncestorContainer)) {
      return
    }

    setIsSelecting(true)

    // Debounce the selection callback
    debounceTimeoutRef.current = setTimeout(() => {
      const { cleanText, isWord, wordCount } = cleanAndAnalyzeText(text)
      
      if (cleanText && wordCount > 0) {
        const position = getSelectionPosition(range)
        const textSelection: TextSelection = {
          text: cleanText,
          position,
          isWord,
          element: range.commonAncestorContainer.parentElement
        }
        
        setSelection(textSelection)
        onTextSelect?.(textSelection)
      }
      setIsSelecting(false)
    }, debounceMs)
  }, [containerRef, onTextSelect, cleanAndAnalyzeText, getSelectionPosition, minSelectionLength, debounceMs])

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
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      container.removeEventListener('dblclick', handleDoubleClick)
      document.removeEventListener('selectionchange', handleSelectionChange)
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [handleDoubleClick, handleSelectionChange])

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