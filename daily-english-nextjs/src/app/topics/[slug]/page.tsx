import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getTopicBySlug, formatDate } from '@/lib/mdx';
import { parseMarkdownToSlides } from '@/lib/slides';
import SlideViewer from '@/components/SlideViewer';
import Link from 'next/link';

interface TopicPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    mode?: string;
  }>;
}

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const { slug } = await params;
  const { mode } = await searchParams;
  const topic = await getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const slides = parseMarkdownToSlides(topic.content);
  const isArticleMode = mode === 'article';

  // 預設顯示投影片模式，除非明確要求文章模式
  if (!isArticleMode) {
    return <SlideViewer slides={slides} topicTitle={topic.title} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Topics
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Article Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {topic.category}
                  </span>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/topics/${slug}`}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      🎬 Slide Mode
                    </Link>
                    <span className="text-sm text-gray-500">
                      {formatDate(topic.date)}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {topic.title}
                </h1>
                
                {topic.redditUrl && (
                  <a
                    href={topic.redditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    View on Reddit ↗
                  </a>
                )}
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="prose prose-lg max-w-none">
                  <MDXRemote source={topic.content} />
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-8 space-y-6">
              {/* Advertisement */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Advertisement</h3>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-500">
                  <span>Ad space - 300x250</span>
                </div>
              </div>

              {/* Study Tips */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Study Tips</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Read each section aloud</li>
                  <li>• Take notes on new vocabulary</li>
                  <li>• Practice the examples</li>
                  <li>• Review daily for best results</li>
                </ul>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Navigation</h3>
                <div className="space-y-2 text-sm">
                  <a href="#summary" className="block text-blue-600 hover:text-blue-800">
                    Summary
                  </a>
                  <a href="#learning-points" className="block text-blue-600 hover:text-blue-800">
                    Learning Points
                  </a>
                  <a href="#vocabulary" className="block text-blue-600 hover:text-blue-800">
                    Vocabulary
                  </a>
                  <a href="#practice" className="block text-blue-600 hover:text-blue-800">
                    Practice Questions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}