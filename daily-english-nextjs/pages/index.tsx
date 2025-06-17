import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { getAllTopics, Topic } from '../lib/topics'

interface HomeProps {
  topics: Topic[]
}

export default function Home({ topics }: HomeProps) {
  return (
    <>
      <Head>
        <title>Daily English Topics - Learn English with Reddit Discussions</title>
        <meta name="description" content="Daily English learning topics generated from Reddit discussions. Improve your vocabulary, grammar, and conversation skills with real-world content." />
        <meta name="keywords" content="English learning, vocabulary, grammar, conversation, Reddit, daily topics, language practice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>💬</text></svg>" />
      </Head>

      {/* Animated Background */}
      <div className="bg-animation"></div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">💬 Daily English Topics</h1>
          <p className="subtitle">
            Learn English through interactive slide presentations from real Reddit discussions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="topics-grid">
          {topics.map((topic, index) => (
            <Link key={topic.date} href={`/topic/${topic.date}`} className="topic-card">
              <div className="card-content">
                <div className="topic-date">
                  <i className="fas fa-calendar-alt"></i>
                  {formatDate(topic.date)}
                </div>
                <h3 className="topic-title">{topic.title}</h3>
                {topic.description && (
                  <p className="topic-description">{topic.description}</p>
                )}
                <div className="topic-tags">
                  {topic.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <button className="slide-button">
                  <i className="fas fa-play"></i>
                  Start Learning
                </button>
              </div>
            </Link>
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