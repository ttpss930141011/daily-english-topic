/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'zh-CN', 'ja', 'ko', 'en'],
    localePath: './public/locales',
    localeDetection: false, // 關閉自動語言偵測，由用戶手動選擇
  },
  fallbackLng: {
    'zh-CN': ['zh-TW', 'en'],
    'ja': ['en', 'zh-TW'],
    'ko': ['en', 'zh-TW'],
    'default': ['zh-TW', 'en']
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  // 命名空間配置
  defaultNS: 'common',
  ns: ['common', 'word-lookup', 'errors', 'navigation'],
  // 插值配置
  interpolation: {
    escapeValue: false, // React 已經處理 XSS
  },
  // 快取配置
  cache: {
    enabled: true,
    prefix: 'daily-english-i18n',
    expirationTime: 7 * 24 * 60 * 60 * 1000, // 7 天
  }
}