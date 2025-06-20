'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import i18n from '@/app/i18n'

interface I18nContextType {
  currentLanguage: string
  changeLanguage: (lng: string) => void
  isLoading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  initialLanguage?: string
}

export function I18nProvider({ children, initialLanguage = 'zh-TW' }: I18nProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 初始化 i18n
    const initI18n = async () => {
      try {
        // 從 localStorage 讀取保存的語言設定
        const savedLanguage = localStorage.getItem('preferred-language') || initialLanguage
        await i18n.changeLanguage(savedLanguage)
        setCurrentLanguage(savedLanguage)
      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        // 使用預設語言
        setCurrentLanguage(initialLanguage)
      } finally {
        setIsLoading(false)
      }
    }

    initI18n()
  }, [initialLanguage])

  const changeLanguage = async (lng: string) => {
    try {
      setIsLoading(true)
      await i18n.changeLanguage(lng)
      setCurrentLanguage(lng)
      localStorage.setItem('preferred-language', lng)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const value: I18nContextType = {
    currentLanguage,
    changeLanguage,
    isLoading,
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
    </div>
  }

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={value}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// 便利的 hook，結合了 react-i18next 的 useTranslation 和我們的 useI18n
export function useAppTranslation(ns?: string | string[]) {
  const { t, i18n } = useTranslation(ns)
  const { currentLanguage, changeLanguage, isLoading } = useI18n()
  
  return {
    t,
    language: currentLanguage,
    changeLanguage,
    isLoading,
    i18n,
  }
}