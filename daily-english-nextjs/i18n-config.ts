export const i18n = {
  defaultLocale: 'zh-TW',
  locales: ['zh-TW', 'zh-CN', 'en', 'ja', 'ko'],
} as const

export type Locale = (typeof i18n)['locales'][number]