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

import { getLanguageName } from '@/lib/language-utils'

/**
 * Builds optimized prompt for deep explanation according to user requirements.
 * Follows Single Responsibility Principle by focusing only on prompt construction.
 * 
 * @param text - The text to explain
 * @param userLanguage - User's preferred language for explanation
 * @param context - Optional context surrounding the text
 * @param difficulty - Learning difficulty level
 * @returns Formatted prompt string for AI model
 */
function buildPrompt(text: string, userLanguage: string, context?: string): string {
  const targetLanguage = getLanguageName(userLanguage)

  return `As an experienced English teacher, provide a comprehensive explanation of "${text}" in ${targetLanguage}. Follow this structure:

📖 Literal Translation

Provide the direct translation and meaning.

📝 Usage

Explain when and how to use this word or phrase, including formality level and appropriate contexts.

💡 Example Sentences

Provide 2-3 natural example sentences in different contexts with ${targetLanguage} translations:

Example: "[concrete example sentence]"
Translation: "[${targetLanguage} translation]"

🌍 Cultural Background

Explain relevant cultural background or linguistic features, including regional differences and social usage patterns.

📚 Grammar Points

Related grammar patterns and rules.

🔗 Related Expressions

Similar phrases, synonyms, or related expressions.

Please respond in ${targetLanguage}, keeping content concise and practical, focusing on helping learners master the core concept of "${text}".${context ? `\n\nContext reference: ${context}` : ''}`
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
    const { text, userLanguage = 'zh-TW', context } = body

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
    const prompt = buildPrompt(cleanText, userLanguage, context)

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