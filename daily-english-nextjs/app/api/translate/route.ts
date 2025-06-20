import { NextRequest, NextResponse } from 'next/server'
import { translateText, TranslationStrategy, getCacheStats } from '@/lib/translation-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      text, 
      targetLanguage = 'zh-TW',
      strategy = process.env.DEFAULT_TRANSLATION_STRATEGY || 'QUICK'
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

    // 驗證翻譯策略
    const translationStrategy = strategy === 'EDUCATIONAL' 
      ? TranslationStrategy.EDUCATIONAL 
      : TranslationStrategy.QUICK

    // 使用混合翻譯服務
    const result = await translateText(cleanText, targetLanguage, translationStrategy)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Translation route error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}

// 新增：獲取快取統計的 GET endpoint
export async function GET() {
  try {
    const stats = getCacheStats()
    return NextResponse.json({
      cache: stats,
      services: {
        googleTranslate: !!process.env.GOOGLE_TRANSLATE_API_KEY,
        gemini: !!process.env.GEMINI_API_KEY
      },
      defaultStrategy: process.env.DEFAULT_TRANSLATION_STRATEGY || 'QUICK'
    })
  } catch (error) {
    console.error('Translation stats error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get translation stats',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    )
  }
}