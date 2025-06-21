// Centralized language utilities
export const SUPPORTED_LANGUAGES = {
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'ja': '日本語',
  'ko': '한국어',
  'en': 'English'
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

// Get language name for AI prompts
export function getLanguageName(code: string): string {
  return SUPPORTED_LANGUAGES[code as LanguageCode] || '繁體中文'
}

// Check if language is supported
export function isLanguageSupported(code: string): code is LanguageCode {
  return code in SUPPORTED_LANGUAGES
}

// Get default language from browser
export function getDefaultLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'zh-TW'
  
  const browserLang = navigator.language.toLowerCase()
  
  // Map browser language codes to our supported codes
  if (browserLang.startsWith('zh-tw') || browserLang === 'zh-hant') return 'zh-TW'
  if (browserLang.startsWith('zh') || browserLang === 'zh-hans') return 'zh-CN'
  if (browserLang.startsWith('ja')) return 'ja'
  if (browserLang.startsWith('ko')) return 'ko'
  if (browserLang.startsWith('en')) return 'en'
  
  return 'zh-TW' // Default fallback
}

// Format language code for display
export function formatLanguageCode(code: LanguageCode): string {
  const names = {
    'zh-TW': '繁中',
    'zh-CN': '简中',
    'ja': '日',
    'ko': '韓',
    'en': 'EN'
  }
  return names[code] || code
}