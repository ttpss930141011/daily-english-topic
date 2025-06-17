import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getAllTopics, Topic } from '@/lib/topics'

interface HomeProps {
  topics: Topic[]
}

export default function Home({ topics }: HomeProps) {
  return (
    <>
      <Head>
        <title>Daily English Topics - Interactive Learning</title>
        <meta name="description" content="Learn English through daily topics and interactive slides" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container">
        <header className="hero">
          <h1>🎓 Daily English Topics</h1>
          <p>Learn English through interactive slide presentations</p>
        </header>

        <section className="topics-grid">
          {topics.map((topic) => (
            <div key={topic.date} className="topic-card">
              <Link href={`/topic/${topic.date}`}>
                <div className="card-content">
                  <h3>{topic.title}</h3>
                  <p className="topic-date">{formatDate(topic.date)}</p>
                  {topic.description && (
                    <p className="topic-description">{topic.description}</p>
                  )}
                  <div className="topic-tags">
                    {topic.tags?.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button className="slide-button">
                    ▶ Start Learning
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}

function formatDate(dateString: string): string {
  // Convert MMDDYYYY to readable format
  const month = dateString.substring(0, 2)
  const day = dateString.substring(2, 4)
  const year = dateString.substring(4, 8)
  
  return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const getStaticProps: GetStaticProps = async () => {
  const topics = await getAllTopics()
  
  return {
    props: {
      topics: topics.sort((a, b) => b.date.localeCompare(a.date))
    }
  }
}