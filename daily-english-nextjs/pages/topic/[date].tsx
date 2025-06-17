import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getAllTopics, getTopicByDate, Topic } from '@/lib/topics'
import SlideViewer from '@/components/SlideViewer'

interface TopicPageProps {
  topic: Topic
}

export default function TopicPage({ topic }: TopicPageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{topic.title} - Daily English Topics</title>
        <meta name="description" content={topic.description || topic.title} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="slide-page">
        <SlideViewer 
          topic={topic}
          interactive={true}
        />
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const topics = await getAllTopics()
  
  const paths = topics.map((topic) => ({
    params: { date: topic.date }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const date = params?.date as string
  
  if (!date) {
    return {
      notFound: true
    }
  }

  const topic = await getTopicByDate(date)
  
  if (!topic) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      topic
    }
  }
}