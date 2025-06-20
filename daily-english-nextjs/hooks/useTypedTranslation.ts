import { Dictionary } from '@/types/dictionary'
import { FALLBACK_DICTIONARY } from '@/lib/fallback-dictionary'

/**
 * Type-safe translation hook with deep object access
 * 支援巢狀屬性訪問，如 'homepage.hero.title'
 */
export function useTypedTranslation(dictionary?: Dictionary) {
  const dict = dictionary || FALLBACK_DICTIONARY

  /**
   * Get nested value from object using dot notation
   * @param obj - Dictionary object
   * @param path - Dot notation path like 'homepage.hero.title'
   * @returns Translation string or undefined
   */
  function getNestedValue(obj: any, path: string): string | undefined {
    return path.split('.').reduce((current, key) => {
      return current?.[key]
    }, obj)
  }

  /**
   * Type-safe translation function
   * @param key - Translation key with dot notation support
   * @param fallback - Optional fallback text
   * @returns Translated string
   */
  function t<T extends string>(key: T, fallback?: string): string {
    const value = getNestedValue(dict, key)
    
    if (value !== undefined) {
      return value
    }
    
    if (fallback !== undefined) {
      return fallback
    }
    
    // Development mode warning
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation key: ${key}`)
    }
    
    return key // Return key as fallback
  }

  /**
   * Check if translation key exists
   */
  function hasTranslation(key: string): boolean {
    return getNestedValue(dict, key) !== undefined
  }

  return {
    t,
    hasTranslation,
    dictionary: dict
  }
}

// Type helper for translation keys
export type TranslationKey = 
  | `common.${keyof Dictionary['common']}`
  | `homepage.hero.${keyof Dictionary['homepage']['hero']}`
  | `homepage.stats.${keyof Dictionary['homepage']['stats']}`
  | `homepage.filters.${keyof Dictionary['homepage']['filters']}`
  | `homepage.search.${keyof Dictionary['homepage']['search']}`
  | `homepage.topicCard.${keyof Dictionary['homepage']['topicCard']}`
  | `homepage.topicCount.${keyof Dictionary['homepage']['topicCount']}`
  | `homepage.emptyState.${keyof Dictionary['homepage']['emptyState']}`
  | `homepage.tags.${keyof Dictionary['homepage']['tags']}`
  | `wordLookup.${keyof Dictionary['wordLookup']}`