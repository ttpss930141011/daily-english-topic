import { getAllTopics, Topic } from '@/lib/topics'
import TopicGrid from '@/components/TopicGrid'

export default function HomePage() {
  const topics: Topic[] = getAllTopics()

  return (
    <main className="main-content">
      <TopicGrid topics={topics} />
    </main>
  )
}