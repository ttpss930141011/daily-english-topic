import { getAllTopics, getTopicByDate } from '@/lib/topics'
import SlideViewer from '@/components/SlideViewer'
import { notFound } from 'next/navigation'

interface TopicPageProps {
  params: { date: string }
}

export async function generateStaticParams() {
  return getAllTopics().map((topic) => ({ date: topic.date }))
}

export default function TopicPage({ params }: TopicPageProps) {
  const topic = getTopicByDate(params.date)

  if (!topic) {
    notFound()
  }

  return (
    <main className="slide-page">
      <SlideViewer topic={topic} interactive />
    </main>
  )
}