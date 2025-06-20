import { NextRequest, NextResponse } from 'next/server'
import { TranslationResult } from '@/contexts/WordLookupContext'

// Language mapping for translation
const LANGUAGE_CODES: Record<string, string> = {
  'zh-TW': 'zh-tw',
  'zh-CN': 'zh-cn', 
  'ja': 'ja',
  'ko': 'ko',
  'en': 'en'
}

async function translateText(text: string, targetLanguage: string): Promise<TranslationResult> {
  const targetLangCode = LANGUAGE_CODES[targetLanguage] || 'zh-tw'
  
  try {
    // For now, we'll provide basic translations
    // In production, you might want to use Google Translate API, Azure Translator, or other services
    
    // Simple word-based translation lookup
    const commonTranslations: Record<string, Record<string, string>> = {
      'hello world': {
        'zh-tw': '你好世界',
        'zh-cn': '你好世界',
        'ja': 'ハローワールド',
        'ko': '헬로 월드'
      },
      'good morning': {
        'zh-tw': '早上好',
        'zh-cn': '早上好',
        'ja': 'おはよう',
        'ko': '좋은 아침'
      },
      'how are you': {
        'zh-tw': '你好嗎',
        'zh-cn': '你好吗',
        'ja': '元気ですか',
        'ko': '어떻게 지내세요'
      },
      'thank you': {
        'zh-tw': '謝謝',
        'zh-cn': '谢谢',
        'ja': 'ありがとう',
        'ko': '감사합니다'
      },
      'excuse me': {
        'zh-tw': '不好意思',
        'zh-cn': '不好意思',
        'ja': 'すみません',
        'ko': '실례합니다'
      },
      'i love you': {
        'zh-tw': '我愛你',
        'zh-cn': '我爱你',
        'ja': '愛してる',
        'ko': '사랑해요'
      }
    }

    const textKey = text.toLowerCase().trim()
    
    // Check for exact phrase match
    if (commonTranslations[textKey] && commonTranslations[textKey][targetLangCode]) {
      return {
        originalText: text,
        translation: commonTranslations[textKey][targetLangCode],
        confidence: 0.95,
        alternatives: []
      }
    }

    // If no exact match, try to provide a basic word-by-word translation
    const words = text.split(/\s+/)
    const translatedWords = words.map(word => {
      const wordKey = word.toLowerCase().replace(/[^\w]/g, '')
      
      // Basic word translations
      const wordTranslations: Record<string, Record<string, string>> = {
        'the': { 'zh-tw': '', 'zh-cn': '', 'ja': '', 'ko': '' },
        'and': { 'zh-tw': '和', 'zh-cn': '和', 'ja': 'と', 'ko': '그리고' },
        'or': { 'zh-tw': '或', 'zh-cn': '或', 'ja': 'または', 'ko': '또는' },
        'but': { 'zh-tw': '但是', 'zh-cn': '但是', 'ja': 'でも', 'ko': '하지만' },
        'yes': { 'zh-tw': '是', 'zh-cn': '是', 'ja': 'はい', 'ko': '네' },
        'no': { 'zh-tw': '不', 'zh-cn': '不', 'ja': 'いいえ', 'ko': '아니오' },
        'good': { 'zh-tw': '好的', 'zh-cn': '好的', 'ja': '良い', 'ko': '좋은' },
        'bad': { 'zh-tw': '壞的', 'zh-cn': '坏的', 'ja': '悪い', 'ko': '나쁜' },
        'big': { 'zh-tw': '大的', 'zh-cn': '大的', 'ja': '大きい', 'ko': '큰' },
        'small': { 'zh-tw': '小的', 'zh-cn': '小的', 'ja': '小さい', 'ko': '작은' },
        'beautiful': { 'zh-tw': '美麗的', 'zh-cn': '美丽的', 'ja': '美しい', 'ko': '아름다운' },
        'important': { 'zh-tw': '重要的', 'zh-cn': '重要的', 'ja': '重要な', 'ko': '중요한' },
        'interesting': { 'zh-tw': '有趣的', 'zh-cn': '有趣的', 'ja': '面白い', 'ko': '흥미로운' },
        'difficult': { 'zh-tw': '困難的', 'zh-cn': '困难的', 'ja': '難しい', 'ko': '어려운' },
        'easy': { 'zh-tw': '容易的', 'zh-cn': '容易的', 'ja': '簡単な', 'ko': '쉬운' },
        'love': { 'zh-tw': '愛', 'zh-cn': '爱', 'ja': '愛', 'ko': '사랑' },
        'like': { 'zh-tw': '喜歡', 'zh-cn': '喜欢', 'ja': '好き', 'ko': '좋아하다' },
        'want': { 'zh-tw': '想要', 'zh-cn': '想要', 'ja': '欲しい', 'ko': '원하다' },
        'need': { 'zh-tw': '需要', 'zh-cn': '需要', 'ja': '必要', 'ko': '필요하다' },
        'can': { 'zh-tw': '可以', 'zh-cn': '可以', 'ja': 'できる', 'ko': '할 수 있다' },
        'will': { 'zh-tw': '將會', 'zh-cn': '将会', 'ja': 'でしょう', 'ko': '할 것이다' },
        'should': { 'zh-tw': '應該', 'zh-cn': '应该', 'ja': 'すべき', 'ko': '해야 한다' }
      }

      if (wordTranslations[wordKey] && wordTranslations[wordKey][targetLangCode]) {
        return wordTranslations[wordKey][targetLangCode]
      }
      
      return word // Return original if no translation found
    })

    const translation = translatedWords.filter(w => w).join(' ')

    return {
      originalText: text,
      translation: translation || `${text} (翻譯)`,
      confidence: 0.7,
      alternatives: []
    }

  } catch (error) {
    console.error('Translation error:', error)
    
    // Fallback translation
    return {
      originalText: text,
      translation: `${text} (翻譯)`,
      confidence: 0.1,
      alternatives: []
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      text, 
      targetLanguage = 'zh-TW'
    } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      )
    }

    const cleanText = text.trim()

    if (cleanText.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      )
    }

    if (cleanText.length > 1000) {
      return NextResponse.json(
        { error: 'Text too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Perform translation
    const result = await translateText(cleanText, targetLanguage)

    return NextResponse.json(result)

  } catch (error) {
    console.error('Translation route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}