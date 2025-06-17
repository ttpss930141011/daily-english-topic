import { Topic } from '@/types/topic';
import TopicCard from './TopicCard';

interface TopicGridProps {
  topics: Topic[];
}

export default function TopicGrid({ topics }: TopicGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topics.map((topic) => (
        <TopicCard key={topic.slug} topic={topic} />
      ))}
    </div>
  );
}