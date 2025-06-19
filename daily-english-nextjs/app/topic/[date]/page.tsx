'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Topic } from '@/types'
import { fetchTopicByDate } from '@/lib/api'
import SlideViewer from '@/components/SlideViewer'
import { LoadingSpinner } from '@/components/ui'
import { fadeIn } from '@/lib/animations'

export default function TopicPage() {
  const params = useParams()
  const router = useRouter()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTopic = async () => {
      try {
        const date = params.date as string
        const topicData = await fetchTopicByDate(date)
        
        if (!topicData) {
          setError('Topic not found')
          return
        }

        setTopic(topicData)
      } catch (err) {
        console.error('Error loading topic:', err)
        setError('Failed to load topic')
      } finally {
        setLoading(false)
      }
    }

    loadTopic()
  }, [params.date])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !topic) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        variants={fadeIn}
        initial="hidden"
        animate="show"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            {error || 'Topic not found'}
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen"
      variants={fadeIn}
      initial="hidden"
      animate="show"
    >
      <SlideViewer topic={topic} interactive={true} theme="dark" />
    </motion.div>
  )
}