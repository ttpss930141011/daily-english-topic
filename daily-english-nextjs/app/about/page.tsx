export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-animated-dots opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">
            About Daily English Topics
          </h1>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Daily English Topics transforms real Reddit discussions into interactive English learning experiences. 
              We believe that authentic conversations are the best way to learn a language naturally.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Every day, our AI-powered system discovers trending discussions on Reddit, analyzes the language used, 
              and creates structured lessons focusing on vocabulary, grammar, pronunciation, and cultural context.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">1. Content Discovery</h3>
                <p className="text-gray-300 text-sm">
                  We automatically fetch popular discussions from Reddit&apos;s AskReddit community, 
                  ensuring fresh and relevant content daily.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">2. AI Analysis</h3>
                <p className="text-gray-300 text-sm">
                  Azure OpenAI analyzes the discussions to extract key vocabulary, grammar patterns, 
                  and cultural insights for effective language learning.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">3. Interactive Slides</h3>
                <p className="text-gray-300 text-sm">
                  Content is formatted into engaging slide presentations with pronunciation guides, 
                  discussion questions, and practice activities.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">4. Continuous Learning</h3>
                <p className="text-gray-300 text-sm">
                  Browse topics by difficulty, category, or date. Practice with real-world English 
                  used by native speakers in authentic contexts.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Technology Stack</h2>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm">Next.js 15</span>
              <span className="px-3 py-1 bg-blue-600/30 text-blue-200 rounded-full text-sm">TypeScript</span>
              <span className="px-3 py-1 bg-indigo-600/30 text-indigo-200 rounded-full text-sm">Tailwind CSS</span>
              <span className="px-3 py-1 bg-green-600/30 text-green-200 rounded-full text-sm">Azure OpenAI</span>
              <span className="px-3 py-1 bg-orange-600/30 text-orange-200 rounded-full text-sm">LangChain</span>
              <span className="px-3 py-1 bg-red-600/30 text-red-200 rounded-full text-sm">Reddit API</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Open Source</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              This project is completely open source and available on GitHub. We welcome contributions, 
              suggestions, and feedback from the community.
            </p>
            <a 
              href="https://github.com/ttpss930141011/daily-english-topic" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300"
            >
              <i className="fab fa-github mr-2"></i>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}