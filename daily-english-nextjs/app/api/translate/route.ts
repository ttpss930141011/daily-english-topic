import { NextRequest, NextResponse } from 'next/server'
import { TranslationResult } from '@/contexts/WordLookupContext'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI if API key is available
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

import { getLanguageName } from '@/lib/language-utils'

async function translateWithGemini(text: string, targetLanguage: string): Promise<TranslationResult> {
  if (!genAI) {
    throw new Error('Gemini API not configured')
  }

  const targetLangName = getLanguageName(targetLanguage)
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const prompt = `As a professional translator, translate the following English text to ${targetLangName}.

Text to translate: "${text}"

Requirements:
1. Provide a natural, fluent translation
2. Maintain the original meaning and tone
3. If there are multiple valid translations, provide up to 2 alternatives
4. For idioms or cultural expressions, provide contextual explanation if needed

Response format (JSON):
{
  "translation": "main translation here",
  "alternatives": ["alternative 1", "alternative 2"],
  "note": "optional cultural or contextual note"
}`

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    
    // Parse JSON response (handle markdown code blocks)
    try {
      let jsonStr = response.trim()
      
      // Remove markdown code block formatting if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```\s*/, '').replace(/\s*```$/, '')
      }
      
      const parsed = JSON.parse(jsonStr.trim())
      return {
        originalText: text,
        translation: parsed.translation || text,
        confidence: 0.95,
        alternatives: parsed.alternatives || []
      }
    } catch {
      // If JSON parsing fails, use the raw response
      return {
        originalText: text,
        translation: response.trim(),
        confidence: 0.8,
        alternatives: []
      }
    }
  } catch (error) {
    console.error('Gemini translation error:', error)
    throw error
  }
}

// Fallback translation for common phrases
function getFallbackTranslation(text: string, targetLanguage: string): TranslationResult | null {
  const commonPhrases: Record<string, Record<string, string>> = {
    'hello': { 'zh-TW': '你好', 'zh-CN': '你好', 'ja': 'こんにちは', 'ko': '안녕하세요' },
    'thank you': { 'zh-TW': '謝謝', 'zh-CN': '谢谢', 'ja': 'ありがとう', 'ko': '감사합니다' },
    'good morning': { 'zh-TW': '早安', 'zh-CN': '早上好', 'ja': 'おはよう', 'ko': '좋은 아침' },
    'goodbye': { 'zh-TW': '再見', 'zh-CN': '再见', 'ja': 'さようなら', 'ko': '안녕히 가세요' }
  }

  const lowerText = text.toLowerCase().trim()
  if (commonPhrases[lowerText] && commonPhrases[lowerText][targetLanguage]) {
    return {
      originalText: text,
      translation: commonPhrases[lowerText][targetLanguage],
      confidence: 1.0,
      alternatives: []
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, targetLanguage = 'zh-TW' } = body

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

    // Check for common phrases first
    const fallbackResult = getFallbackTranslation(cleanText, targetLanguage)
    if (fallbackResult) {
      return NextResponse.json(fallbackResult)
    }

    // Use Gemini if available
    if (genAI) {
      try {
        const result = await translateWithGemini(cleanText, targetLanguage)
        return NextResponse.json(result)
      } catch (geminiError) {
        console.error('Gemini translation failed:', geminiError)
        // Continue to fallback
      }
    }

    // Ultimate fallback - return original text with low confidence
    return NextResponse.json({
      originalText: text,
      translation: text,
      confidence: 0.1,
      alternatives: [],
      error: 'Translation service unavailable'
    })

  } catch (error) {
    console.error('Translation route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}