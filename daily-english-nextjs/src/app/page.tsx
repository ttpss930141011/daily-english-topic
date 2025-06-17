import { getAllTopics } from '@/lib/mdx';
import TopicGrid from '@/components/TopicGrid';

export default async function Home() {
  const topics = await getAllTopics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Daily English Topics
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Improve your English with daily Reddit discussions
            </p>
            <div className="flex justify-center space-x-8 text-sm md:text-base">
              <div className="text-center">
                <div className="text-2xl font-bold">{topics.length}</div>
                <div className="text-blue-200">Topics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Daily</div>
                <div className="text-blue-200">Updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Free</div>
                <div className="text-blue-200">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Latest Topics
              </h2>
              <span className="text-sm text-gray-500">
                {topics.length} topics available
              </span>
            </div>
            
            <TopicGrid topics={topics} />
          </div>

          {/* Sidebar - Ad Space */}
          <div className="lg:w-80">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Advertisement</h3>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                  <span>Ad space - 300x250</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Daily English Topics helps you improve your English through real Reddit discussions. 
                  Each topic includes vocabulary, learning points, and practice questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
