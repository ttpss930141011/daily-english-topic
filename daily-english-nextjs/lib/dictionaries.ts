import 'server-only'
import type { Locale } from '@/i18n-config'
import type { Dictionary } from '@/types/dictionary'

const dictionaries = {
  'en': () => import('@/dictionaries/en.json').then((module) => module.default as Dictionary),
  'zh-TW': () => import('@/dictionaries/zh-TW.json').then((module) => module.default as Dictionary),
  'zh-CN': () => import('@/dictionaries/zh-CN.json').then((module) => module.default as Dictionary),
  'ja': () => import('@/dictionaries/ja.json').then((module) => module.default as Dictionary),
  'ko': () => import('@/dictionaries/ko.json').then((module) => module.default as Dictionary),
} satisfies Record<Locale, () => Promise<Dictionary>>

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]?.() ?? dictionaries['zh-TW']()
}