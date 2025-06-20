import 'server-only'
import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/dictionary'

const dictionaries = {
  'en': () => import('@/dictionaries/en.json').then((module) => module.default),
  'zh-TW': () => import('@/dictionaries/zh-TW.json').then((module) => module.default),
  'zh-CN': () => import('@/dictionaries/zh-CN.json').then((module) => module.default),
  'ja': () => import('@/dictionaries/ja.json').then((module) => module.default),
  'ko': () => import('@/dictionaries/ko.json').then((module) => module.default),
} satisfies Record<Locale, () => Promise<Dictionary>>

export const getDictionary = async (locale: Locale): Promise<Dictionary> => 
  dictionaries[locale]?.() ?? dictionaries.en()

