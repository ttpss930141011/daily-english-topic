import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Import types from centralized location
import { Topic, Slide, InteractiveWord } from '@/types'

// Re-export for backward compatibility
export type { Topic, Slide, InteractiveWord }

const POSTS_DIRECTORY = path.join(process.cwd(), '..', 'posts')

export function getAllTopics(): Topic[] {
  try {
    // Check if posts directory exists
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      console.warn('Posts directory not found, returning empty array')
      return []
    }

    const fileNames = fs.readdirSync(POSTS_DIRECTORY)
    const topics = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => getTopicFromFile(fileName))
      .filter(Boolean) as Topic[]

    // Sort by date, newest first
    return topics.sort((a, b) => {
      const dateA = parseDateString(a.date)
      const dateB = parseDateString(b.date)
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error('Error loading topics:', error)
    return []
  }
}

export function getTopicByDate(date: string): Topic | null {
  try {
    const topics = getAllTopics()
    return topics.find(topic => topic.date === date) || null
  } catch (error) {
    console.error('Error getting topic by date:', error)
    return null
  }
}

function getTopicFromFile(fileName: string): Topic | null {
  try {
    const fullPath = path.join(POSTS_DIRECTORY, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Extract date from filename (format: slug-DDMMYYYY.md)
    const dateMatch = fileName.match(/(\d{8})\.md$/)
    if (!dateMatch) {
      console.warn(`Could not extract date from filename: ${fileName}`)
      return null
    }

    const date = dateMatch[1]
    
    // Parse slides from markdown content
    const slides = parseSlides(content)
    
    // Extract title from first slide or use from frontmatter
    const title = data.title || extractTitleFromContent(content) || 'Untitled Topic'

    return {
      date,
      title,
      description: data.description || null,
      slides,
      tags: data.tags || [],
      redditUrl: data.redditUrl || null,
      difficulty: data.difficulty || 'intermediate',
      category: data.category || 'general',
      metadata: data || {}
    }
  } catch (error) {
    console.error(`Error processing file ${fileName}:`, error)
    return null
  }
}

function parseSlides(content: string): Slide[] {
  // Split content by Marp slide separators
  const slideContents = content.split(/^---$/m)
  
  return slideContents
    .filter(slide => slide.trim().length > 0)
    .map((slideContent, index) => {
      const trimmedContent = slideContent.trim()
      
      return {
        id: `slide-${index + 1}`,
        content: trimmedContent,
        type: determineSlideType(trimmedContent, index),
        interactiveWords: extractInteractiveWords(trimmedContent)
      }
    })
}

function determineSlideType(content: string, index: number): Slide['type'] {
  if (index === 0) return 'title'
  
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('exercise') || lowerContent.includes('practice')) {
    return 'exercise'
  }
  
  if (lowerContent.includes('summary') || lowerContent.includes('conclusion')) {
    return 'summary'
  }
  
  return 'content'
}

function extractTitleFromContent(content: string): string | null {
  // Look for the first heading in the content
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1].trim() : null
}

function extractInteractiveWords(content: string): InteractiveWord[] {
  // Define words that should be interactive
  const interactiveWordsList = [
    'expression', 'phrase', 'meaning', 'example', 'discussion', 'conversation',
    'pronunciation', 'vocabulary', 'grammar', 'practice', 'learning', 'language',
    'communication', 'understanding', 'context', 'culture', 'native', 'speaker',
    'fluent', 'accent', 'dialect', 'slang', 'idiom', 'colloquial', 'formal',
    'informal', 'professional', 'casual', 'everyday', 'common', 'frequent'
  ]

  const words: InteractiveWord[] = []
  const wordSet = new Set(interactiveWordsList)

  // Find words in content that match our interactive words
  const wordRegex = /\b\w+\b/g
  let match

  while ((match = wordRegex.exec(content)) !== null) {
    const word = match[0].toLowerCase()
    if (wordSet.has(word) && word.length > 3) {
      // Avoid duplicates
      if (!words.some(w => w.word === word)) {
        words.push({
          word: word,
          // These will be fetched from API when clicked
          definition: null,
          pronunciation: null,
          partOfSpeech: null
        })
      }
    }
  }

  return words
}

function parseDateString(dateStr: string): Date {
  // Parse DDMMYYYY format
  const day = parseInt(dateStr.substring(0, 2))
  const month = parseInt(dateStr.substring(2, 4)) - 1 // Month is 0-indexed
  const year = parseInt(dateStr.substring(4, 8))
  return new Date(year, month, day)
}