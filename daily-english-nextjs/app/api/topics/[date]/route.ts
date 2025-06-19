import { NextResponse } from 'next/server'
import { getTopicByDate } from '@/lib/topics'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params
    const topic = getTopicByDate(date)
    
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }
    
    return NextResponse.json(topic)
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 })
  }
}