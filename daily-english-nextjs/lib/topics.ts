import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Slide {
  content: string
  type: string
  interactiveWords?: { word: string }[]
}

export interface Topic {
  date: string
  title: string
  description?: string
  tags: string[]
  slides: Slide[]
}

const postsDirectory = path.join(process.cwd(), 'posts')

function getTopicData(filename: string): Topic {
  const slug = filename.replace(/\.md$/, '')
  const date = slug.slice(-8)
  const titleSlug = slug.slice(0, -9)
  const title = titleSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  const filePath = path.join(postsDirectory, filename)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { content } = matter(fileContents)

  // Split slides by '---' delimiter and filter out empty segments
  const rawSlides = content.split(/^---$/m).filter(segment => segment.trim().length > 0)

  const slides: Slide[] = rawSlides.map(segment => ({
    content: segment.trim(),
    type: 'content',
    interactiveWords: []
  }))

  return {
    date,
    title,
    tags: [],
    slides
  }
}

export function getAllTopics(): Topic[] {
  const filenames = fs.readdirSync(postsDirectory).filter(fn => fn.endsWith('.md'))
  const topics = filenames.map(getTopicData)
  return topics
}

export function getTopicByDate(date: string): Topic | null {
  const topics = getAllTopics()
  return topics.find(topic => topic.date === date) || null
}
