import Link from 'next/link';
import { Topic } from '@/types/topic';
import { formatDate } from '@/lib/mdx';

interface TopicCardProps {
  topic: Topic;
}

const categoryColors = {
  DISCUSSION: 'bg-blue-100 text-blue-800',
  LANGUAGE: 'bg-green-100 text-green-800', 
  LIFESTYLE: 'bg-purple-100 text-purple-800',
  ETHICS: 'bg-red-100 text-red-800',
  CAREER: 'bg-yellow-100 text-yellow-800',
  GENERAL: 'bg-gray-100 text-gray-800',
};

export default function TopicCard({ topic }: TopicCardProps) {
  const categoryClass = categoryColors[topic.category as keyof typeof categoryColors] || categoryColors.GENERAL;

  return (
    <Link href={`/topics/${topic.slug}`}>
      <div className="group block p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryClass}`}>
            {topic.category}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(topic.date)}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
          {topic.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Learn English</span>
          <span className="text-blue-500 group-hover:text-blue-600 font-medium">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}