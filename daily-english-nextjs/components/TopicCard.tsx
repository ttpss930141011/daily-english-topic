/**
 * TopicCard Component
 * Displays a single topic card with animations and hover effects
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Play } from 'lucide-react'
import { Topic } from '@/types'
import { hoverScale, shineAnimation } from '@/lib/animations'

interface TopicCardProps {
  topic: Topic
  index: number
  hoveredCard: string | null
  onHoverStart: (date: string) => void
  onHoverEnd: () => void
}

export default function TopicCard({ 
  topic, 
  index, 
  hoveredCard, 
  onHoverStart, 
  onHoverEnd 
}: TopicCardProps) {
  const formatDate = (dateString: string): string => {
    const month = dateString.substring(0, 2)
    const day = dateString.substring(2, 4)
    const year = dateString.substring(4, 8)
    
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => onHoverStart(topic.date)}
      onHoverEnd={onHoverEnd}
    >
      <Link href={`/topic/${topic.date}`} className="topic-card">
        <motion.div 
          className="card-glow"
          animate={{
            opacity: hoveredCard === topic.date ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="card-content">
          <motion.div 
            className="topic-date"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <Calendar size={16} />
            {formatDate(topic.date)}
          </motion.div>
          
          <motion.h3 
            className="topic-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {topic.title}
          </motion.h3>
          
          {topic.description && (
            <motion.p 
              className="topic-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {topic.description}
            </motion.p>
          )}
          
          <motion.div 
            className="topic-tags"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            {topic.tags.map((tag, tagIndex) => (
              <motion.span 
                key={tag} 
                className="tag"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1 + 0.6 + tagIndex * 0.05,
                  type: "spring",
                  stiffness: 300
                }}
                whileHover={{ scale: 1.1 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.button 
            className="slide-button"
            {...hoverScale}
          >
            <Play size={16} />
            Start Learning
            <motion.span
              className="button-shine"
              animate={hoveredCard === topic.date ? shineAnimation.animate : { x: '-100%' }}
              transition={shineAnimation.transition}
            />
          </motion.button>
        </div>
      </Link>
    </motion.div>
  )
}