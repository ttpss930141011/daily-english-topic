'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Topic } from '@/types'
import { fetchTopics } from '@/lib/api'
import HomeHeader from '@/components/HomeHeader'
import TopicCard from '@/components/TopicCard'
import { LoadingSpinner } from '@/components/ui'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const allTopics = await fetchTopics()
        setTopics(allTopics)
      } catch (error) {
        console.error('Error loading topics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTopics()
  }, [])

  const filteredTopics = selectedCategory === 'all' 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory)

  const categories = ['all', ...new Set(topics.map(t => t.category || 'general'))]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HomeHeader topicsCount={topics.length} />
      
      <main className="container mx-auto px-4 pb-20">
        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-white text-gray-900 shadow-lg scale-105'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTopics.map((topic, index) => (
            <motion.div key={topic.date} variants={fadeInUp}>
              <TopicCard 
                topic={topic} 
                index={index}
                hoveredCard={hoveredCard}
                onHoverStart={(date) => setHoveredCard(date)}
                onHoverEnd={() => setHoveredCard(null)}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredTopics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/60 text-lg">
              No topics found in this category.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}