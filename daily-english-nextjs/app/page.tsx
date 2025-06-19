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
      <div className="loading-container">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <HomeHeader topicsCount={topics.length} />
      
      <main className="main-content">
        {/* Category Filter */}
        <motion.div 
          className="filter-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-button ${
                selectedCategory === category ? 'active' : ''
              }`}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid transparent',
                transform: selectedCategory === category ? 'scale(1.05)' : 'scale(1)',
                cursor: 'pointer'
              }}
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem'
          }}
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
            style={{
              textAlign: 'center',
              padding: '5rem 0',
              gridColumn: '1 / -1'
            }}
          >
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.125rem' }}>
              No topics found in this category.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}