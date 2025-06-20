import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'

// 初始化 i18n - 使用動態載入，避免全部打包到 bundle
if (!i18n.isInitialized) {
  i18n
    .use(resourcesToBackend((language: string, namespace: string) => 
      import(`../public/locales/${language}/${namespace}.json`)
    ))
    .use(initReactI18next)
    .init({
      fallbackLng: 'zh-TW',
      defaultNS: 'common',
      ns: ['common', 'word-lookup', 'homepage'],
      
      debug: false,
      
      interpolation: {
        escapeValue: false,
      },
      
      react: {
        useSuspense: false,
      },
    })
}

export default i18n