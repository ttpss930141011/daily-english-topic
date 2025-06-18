import { GetStaticProps } from 'next'
import Head from 'next/head'
import { getAllTopics } from '@/lib/topics'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Topic } from '@/types'
import { cardContainerVariants } from '@/lib/animations'
import AnimatedBackground from '@/components/AnimatedBackground'
import HomeHeader from '@/components/HomeHeader'
import TopicCard from '@/components/TopicCard'

interface HomeProps {
  topics: Topic[]
}

export default function Home({ topics }: HomeProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  return (
    <>
      <Head>
        <title>Daily English Topics - Learn English with Reddit Discussions</title>
        <meta name="description" content="Daily English learning topics generated from Reddit discussions. Improve your vocabulary, grammar, and conversation skills with real-world content." />
        <meta name="keywords" content="English learning, vocabulary, grammar, conversation, Reddit, daily topics, language practice" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>💬</text></svg>" />
      </Head>

      <AnimatedBackground />

      <HomeHeader topicsCount={topics.length} />

      <main className="main-content">
        <motion.section 
          className="topics-grid"
          variants={cardContainerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.date}
                topic={topic}
                index={index}
                hoveredCard={hoveredCard}
                onHoverStart={setHoveredCard}
                onHoverEnd={() => setHoveredCard(null)}
              />
            ))}
          </AnimatePresence>
        </motion.section>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const topics = await getAllTopics()
  
  return {
    props: {
      topics: topics.sort((a, b) => b.date.localeCompare(a.date))
    }
  }
}