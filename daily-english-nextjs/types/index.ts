/**
 * Type definitions for the Daily English Topics application
 */

/**
 * Topic related types
 */
export interface Topic {
  title: string
  date: string
  description?: string
  tags: string[]
  slides: Slide[]
}

export interface Slide {
  type: 'title' | 'content' | 'summary'
  content: string
  interactiveWords?: InteractiveWord[]
}

export interface InteractiveWord {
  word: string
  definition?: string
}

/**
 * Dictionary API types
 */
export interface WordDefinition {
  word: string
  phonetics: Phonetic[]
  meanings: Meaning[]
}

export interface Phonetic {
  text?: string
  audio?: string
}

export interface Meaning {
  partOfSpeech: string
  definitions: Definition[]
}

export interface Definition {
  definition: string
  example?: string
}

/**
 * Component prop types
 */
export interface SlideViewerProps {
  topic: Topic
  interactive?: boolean
  theme?: 'light' | 'dark'
}

export interface WordPopupProps {
  word: string
  position: { x: number; y: number }
  onClose: () => void
}

export interface InteractiveWordProps {
  word: string
  onClick: (word: string, event: React.MouseEvent) => void
}

/**
 * Animation types
 */
export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string | number[]
}

/**
 * Theme types
 */
export type Theme = 'light' | 'dark'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
}