import { Topic } from '@/types'

export async function fetchTopics(): Promise<Topic[]> {
  try {
    const response = await fetch('/api/topics')
    if (!response.ok) {
      throw new Error('Failed to fetch topics')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching topics:', error)
    return []
  }
}

export async function fetchTopicByDate(date: string): Promise<Topic | null> {
  try {
    const response = await fetch(`/api/topics/${date}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch topic')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching topic:', error)
    return null
  }
}