/**
 * Type definitions for the Daily English Topics application
 */

/**
 * Topic related types
 */
export interface Topic {
  date: string
  title: string
  description: string | null
  slides: Slide[]
  tags: string[]
  redditUrl: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  metadata: Record<string, any>
}

export interface Slide {
  id: string
  content: string
  type: 'title' | 'content' | 'exercise' | 'summary'
  interactiveWords?: InteractiveWord[]
}

export interface InteractiveWord {
  word: string
  definition: string | null
  pronunciation: string | null
  partOfSpeech: string | null
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