import { NextResponse } from 'next/server'
import { getAllTopics } from '@/lib/topics'

export async function GET() {
  try {
    const topics = getAllTopics()
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
  }
}