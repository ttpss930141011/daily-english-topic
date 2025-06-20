'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Globe, LogIn } from 'lucide-react'
import { useAppTranslation, useAppLanguage } from '@/components/providers/I18nProvider'
import { SignInModal } from '@/components/SignInModal'

interface AppHeaderProps {
  className?: string
}

/**
 * Application header component with user avatar and settings.
 * Follows Single Responsibility and Open-Closed principles.
 * 
 * @param props - Component properties
 * @returns JSX element for app header
 */
export function AppHeader({ className = '' }: AppHeaderProps) {
  const { t } = useAppTranslation('common')
  const { currentLanguage, changeLanguage, availableLanguages } = useAppLanguage()
  
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const languageRef = useRef<HTMLDivElement>(null)

  /**
   * Handles language change from dropdown menu.
   * Updates both UI language and AI prompt language.
   * 
   * @param languageCode - New language code to switch to
   */
  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode)
    setShowLanguageMenu(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    /**
     * Handles clicks outside dropdown menus to close them.
     * 
     * @param event - Mouse click event
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`bg-transparent sticky top-0 z-30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Empty left side */}
          <div></div>

          {/* Right side - Language and Sign In */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={t('changeLanguage')}
              >
                <Globe className="h-5 w-5 text-gray-600" />
              </button>

              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    {t('selectLanguage')}
                  </div>
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        currentLanguage === lang.code 
                          ? 'text-purple-600 bg-purple-50' 
                          : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lang.name}</span>
                        {currentLanguage === lang.code && (
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <button
              className="hidden gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors md:flex items-center"
              onClick={() => setShowSignInModal(true)}
            >
              <span>{t('signIn')}</span>
              <LogIn className="size-4" />
            </button>
          </div>
        </div>
      </div>
      
      <SignInModal 
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    </header>
  )
}