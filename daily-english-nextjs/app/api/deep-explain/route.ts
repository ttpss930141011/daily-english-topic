import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface DeepExplainRequest {
  text: string
  userLanguage: string
  context?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

function buildPrompt(text: string, userLanguage: string, context?: string, difficulty = 'intermediate'): string {
  const languageMap: Record<string, string> = {
    'zh-TW': '繁體中文',
    'zh-CN': '简体中文',
    'ja': '日本語',
    'ko': '한국어',
    'en': 'English'
  }

  const targetLanguage = languageMap[userLanguage] || '繁體中文'
  const difficultyMap: Record<string, string> = {
    beginner: '初學者',
    intermediate: '中級',
    advanced: '高級'
  }

  return `作為一位經驗豐富的英語教師，請針對以下文字提供深度解釋：

**要解釋的文字：** "${text}"
**使用者語言：** ${targetLanguage}
**學習程度：** ${difficultyMap[difficulty]}
${context ? `**上下文：** "${context}"` : ''}

請以${targetLanguage}提供以下內容：

## 📖 字面翻譯
提供直接的翻譯含義

## 📝 用法說明
解釋何時及如何使用這個詞彙或片語

## 💡 例句示範
提供 2-3 個不同情境下的自然例句，並附上${targetLanguage}翻譯

## 🌍 文化背景
解釋任何相關的文化背景或語言特色

## 📚 語法重點
相關的語法模式和規則

## 🔗 相關表達
類似的片語、同義詞或相關表達方式

## 💭 學習技巧
記憶或理解這個詞彙的實用技巧

請像一位友善的老師一樣，用教育性但有趣的方式來解釋，幫助學生真正理解和掌握這個概念。`
}

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not found')
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const body: DeepExplainRequest = await request.json()
    const { text, userLanguage = 'zh-TW', context, difficulty = 'intermediate' } = body

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text parameter is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const cleanText = text.trim()
    if (cleanText.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text cannot be empty' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (cleanText.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Text too long (max 500 characters)' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Build the prompt
    const prompt = buildPrompt(cleanText, userLanguage, context, difficulty)

    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      // Generate content with streaming
      const result = await model.generateContentStream(prompt)

      // Create a readable stream for the response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const chunkText = chunk.text()
              if (chunkText) {
                controller.enqueue(encoder.encode(chunkText))
              }
            }
            controller.close()
          } catch (error) {
            console.error('Streaming error:', error)
            controller.error(error)
          }
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })

    } catch (genAIError) {
      console.error('Gemini AI error:', genAIError)
      
      // Fallback response if Gemini fails
      const fallbackResponse = `# 深度解釋：${cleanText}

很抱歉，AI 解釋服務暫時無法使用。以下是基本資訊：

## 📖 基本翻譯
"${cleanText}" 的基本含義需要進一步查詢。

## 💡 學習建議
1. 嘗試在不同語境中使用這個詞彙
2. 查閱英英字典獲得更深入的理解
3. 尋找更多相關例句

請稍後再試或使用其他學習資源。`

      return new Response(fallbackResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }

  } catch (error) {
    console.error('Deep explain route error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}