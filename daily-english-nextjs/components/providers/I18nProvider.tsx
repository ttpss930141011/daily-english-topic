'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Dictionary } from '@/types/dictionary'
import { Locale } from '@/i18n-config'
import { getClientDictionary } from '@/lib/client-dictionary'

interface LanguageOption {
  code: Locale
  name: string
  nativeName: string
}

interface I18nContextType {
  dictionary: Dictionary
  currentLanguage: Locale
  availableLanguages: LanguageOption[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  dictionary: Dictionary
  locale: Locale
}

// Available language options
const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: '日本語', nativeName: '日本語' },
  { code: 'ko', name: '한국어', nativeName: '한국어' }
]

/**
 * Simple I18n Provider using Next.js App Router approach
 * 按照官方建議的 getDictionary 方式
 */
export function I18nProvider({ children, dictionary, locale }: I18nProviderProps) {
  const safeDictionary = getClientDictionary(dictionary)

  const value: I18nContextType = {
    dictionary: safeDictionary,
    currentLanguage: locale,
    availableLanguages: AVAILABLE_LANGUAGES
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * Hook to access translation context
 */
export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

/**
 * Hook for accessing dictionary with type safety
 */
export function useDictionary(): Dictionary {
  const { dictionary } = useI18n()
  return dictionary
}

/**
 * Hook for accessing current language
 */
export function useLocale(): Locale {
  const { currentLanguage } = useI18n()
  return currentLanguage
}

/**
 * Hook for accessing available languages
 */
export function useLanguages(): LanguageOption[] {
  const { availableLanguages } = useI18n()
  return availableLanguages
}

/**
 * Legacy compatibility hook for components still using useAppTranslation
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useAppTranslation(_ns?: string) {
  const dictionary = useDictionary()
  const locale = useLocale()
  
  // Simple translation function using dot notation
  const t = (key: string) => {
    const keys = key.split('.')
    let value: unknown = dictionary
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return (typeof value === 'string' ? value : key)
  }
  
  return {
    t,
    language: locale,
    i18n: { language: locale }
  }
}

/**
 * Legacy compatibility hook for components still using useAppLanguage
 */
export function useAppLanguage() {
  const { currentLanguage, availableLanguages } = useI18n()
  return {
    currentLanguage,
    availableLanguages,
    isLoading: false
  }
}