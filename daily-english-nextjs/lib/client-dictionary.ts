import type { Dictionary } from '@/types/dictionary'
import { FALLBACK_DICTIONARY } from '@/lib/fallback-dictionary'

/**
 * Client-side safe dictionary access
 * 這個檔案可以在客戶端組件中安全使用
 */
export const getClientDictionary = (dictionary?: Dictionary): Dictionary => {
  return dictionary || FALLBACK_DICTIONARY
}