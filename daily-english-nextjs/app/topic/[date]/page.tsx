import { getAllTopics, getTopicByDate } from '@/lib/topics'
import SlideViewer from '@/components/SlideViewer'
import { notFound } from 'next/navigation'

interface TopicPageProps {
  params: Promise<{ date: string }>
}

export async function generateStaticParams() {
  return getAllTopics().map((topic) => ({ date: topic.date }))
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { date } = await params
  const topic = getTopicByDate(date)

  if (!topic) {
    notFound()
  }

  return <SlideViewer topic={topic} interactive />
}