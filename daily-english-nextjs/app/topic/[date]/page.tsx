import { getAllTopics, getTopicByDate } from '@/lib/topics'
import SlideViewer from '@/components/SlideViewer'
import { WordLookupProvider } from '@/contexts/WordLookupContext'
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

  return (
    <WordLookupProvider defaultLanguage="zh-TW">
      <SlideViewer topic={topic} interactive />
    </WordLookupProvider>
  )
}