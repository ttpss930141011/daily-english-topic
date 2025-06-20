'use client'

import React, { useState, useRef, useEffect } from 'react'
import { User, Settings, Globe, LogOut, LogIn } from 'lucide-react'
import { useAppTranslation, useAppLanguage } from '@/components/providers/I18nProvider'

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
  
  const [showSettings, setShowSettings] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  // Mock user state - will be replaced with real Google OAuth
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<{
    name?: string
    email?: string
    avatar?: string
  }>({})

  /**
   * Handles language change from dropdown menu.
   * Updates both UI language and AI prompt language.
   * 
   * @param languageCode - New language code to switch to
   */
  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode)
    setShowLanguageMenu(false)
    setShowSettings(false)
  }

  /**
   * Handles user login/logout actions.
   * Placeholder for future Google OAuth integration.
   */
  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Future: Google OAuth logout
      setIsLoggedIn(false)
      setUserProfile({})
    } else {
      // Future: Google OAuth login
      setIsLoggedIn(true)
      setUserProfile({
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: undefined
      })
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    /**
     * Handles clicks outside dropdown menus to close them.
     * 
     * @param event - Mouse click event
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false)
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DE</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                Daily English
              </span>
            </div>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => {
                  setShowLanguageMenu(!showLanguageMenu)
                  setShowSettings(false)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

            {/* Settings Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => {
                  setShowSettings(!showSettings)
                  setShowLanguageMenu(false)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('settings')}
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                    {t('settings')}
                  </div>
                  
                  {/* Language setting in dropdown too */}
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>{t('language')}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {availableLanguages.find(l => l.code === currentLanguage)?.name}
                    </span>
                  </button>

                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="px-3 py-1 text-xs text-gray-500">
                      {t('comingSoon')}
                    </div>
                    <div className="px-3 py-2 text-sm text-gray-400">
                      • {t('darkMode')}
                    </div>
                    <div className="px-3 py-2 text-sm text-gray-400">
                      • {t('notifications')}
                    </div>
                    <div className="px-3 py-2 text-sm text-gray-400">
                      • {t('learningPreferences')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar/Profile */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAuthAction}
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                title={isLoggedIn ? t('profile') : t('signIn')}
              >
                {isLoggedIn ? (
                  <>
                    {userProfile.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt={userProfile.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm text-gray-700">
                      {userProfile.name}
                    </span>
                    <LogOut className="h-4 w-4 text-gray-500 hidden sm:block" />
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="hidden sm:block text-sm text-gray-700">
                      {t('signIn')}
                    </span>
                    <LogIn className="h-4 w-4 text-gray-500 hidden sm:block" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}