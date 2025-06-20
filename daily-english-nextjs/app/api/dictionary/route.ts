import { NextRequest, NextResponse } from 'next/server'
import { DictionaryEntry } from '@/contexts/WordLookupContext'

interface FreeDictionaryResponse {
  word: string
  phonetics: Array<{
    text?: string
    audio?: string
  }>
  meanings: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
    }>
  }>
}


// Language mapping for translation
const LANGUAGE_CODES: Record<string, string> = {
  'zh-TW': 'zh-tw',
  'zh-CN': 'zh-cn', 
  'ja': 'ja',
  'ko': 'ko',
  'en': 'en'
}

async function translateText(text: string, targetLanguage: string): Promise<string> {
  const targetLangCode = LANGUAGE_CODES[targetLanguage] || 'zh-tw'
  
  try {
    // Use a simple translation API or service
    // For now, we'll provide basic translations for common cases
    const commonTranslations: Record<string, Record<string, string>> = {
      'hello': {
        'zh-tw': '你好',
        'zh-cn': '你好',
        'ja': 'こんにちは',
        'ko': '안녕하세요'
      },
      'world': {
        'zh-tw': '世界',
        'zh-cn': '世界',
        'ja': '世界',
        'ko': '세계'
      },
      'good': {
        'zh-tw': '好的',
        'zh-cn': '好的',
        'ja': '良い',
        'ko': '좋은'
      },
      'bad': {
        'zh-tw': '壞的',
        'zh-cn': '坏的',
        'ja': '悪い',
        'ko': '나쁜'
      },
      'beautiful': {
        'zh-tw': '美麗的',
        'zh-cn': '美丽的',
        'ja': '美しい',
        'ko': '아름다운'
      },
      'important': {
        'zh-tw': '重要的',
        'zh-cn': '重要的',
        'ja': '重要な',
        'ko': '중요한'
      },
      'interesting': {
        'zh-tw': '有趣的',
        'zh-cn': '有趣的',
        'ja': '面白い',
        'ko': '흥미로운'
      },
      'difficult': {
        'zh-tw': '困難的',
        'zh-cn': '困难的',
        'ja': '難しい',
        'ko': '어려운'
      },
      'easy': {
        'zh-tw': '容易的',
        'zh-cn': '容易的',
        'ja': '簡単な',
        'ko': '쉬운'
      },
      'love': {
        'zh-tw': '愛',
        'zh-cn': '爱',
        'ja': '愛',
        'ko': '사랑'
      }
    }

    const wordKey = text.toLowerCase()
    if (commonTranslations[wordKey] && commonTranslations[wordKey][targetLangCode]) {
      return commonTranslations[wordKey][targetLangCode]
    }

    // Fallback: return original text without suffix  
    return text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

async function fetchDictionaryData(word: string): Promise<FreeDictionaryResponse | null> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      {
        headers: {
          'User-Agent': 'daily-english-topic/1.0'
        }
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return Array.isArray(data) ? data[0] : data
  } catch (error) {
    console.error('Dictionary API error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { word, userLanguage = 'zh-TW' } = body

    if (!word || typeof word !== 'string') {
      return NextResponse.json(
        { error: 'Word parameter is required' },
        { status: 400 }
      )
    }

    const cleanWord = word.trim().toLowerCase()

    // Fetch dictionary data
    const dictionaryData = await fetchDictionaryData(cleanWord)

    if (!dictionaryData) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      )
    }

    // Process phonetics
    let phonetic = ''
    let audioUrl = ''
    if (dictionaryData.phonetics && dictionaryData.phonetics.length > 0) {
      const phoneticWithText = dictionaryData.phonetics.find(p => p.text)
      const phoneticWithAudio = dictionaryData.phonetics.find(p => p.audio)
      
      phonetic = phoneticWithText?.text || ''
      audioUrl = phoneticWithAudio?.audio || ''
    }

    // Process definitions
    const definitions = []
    
    for (const meaning of dictionaryData.meanings.slice(0, 3)) {
      for (const definition of meaning.definitions.slice(0, 2)) {
        const translation = await translateText(definition.definition, userLanguage)
        
        definitions.push({
          partOfSpeech: meaning.partOfSpeech,
          definition: definition.definition,
          translation,
          example: definition.example
        })
      }
    }

    const result: DictionaryEntry = {
      word: dictionaryData.word,
      phonetic,
      audioUrl: audioUrl || undefined,
      definitions
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Dictionary route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}