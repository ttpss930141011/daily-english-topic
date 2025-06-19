export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-animated-dots opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">
            Terms of Service
          </h1>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By accessing and using Daily English Topics, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use this website.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Educational Use</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Daily English Topics is provided for educational purposes only. The content is designed 
              to help English language learners improve their skills through authentic conversation examples.
            </p>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc">
              <li>Content is intended for personal learning and educational use</li>
              <li>Commercial use of our educational materials is not permitted</li>
              <li>You may share links to our content for educational purposes</li>
              <li>Bulk downloading or scraping of content is prohibited</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Content and Copyright</h2>
            <h3 className="text-lg font-medium text-purple-300 mb-2">Source Material</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Our educational content is based on public Reddit discussions. We transform these discussions 
              into structured learning materials while respecting the original sources.
            </p>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-4">
              <li>Original Reddit content belongs to its respective authors</li>
              <li>Educational adaptations and lesson structures are our original work</li>
              <li>Links to original Reddit discussions are always provided</li>
              <li>No Reddit usernames or personal information are displayed</li>
            </ul>

            <h3 className="text-lg font-medium text-purple-300 mb-2">Fair Use</h3>
            <p className="text-gray-300 leading-relaxed">
              Our use of Reddit content constitutes fair use for educational purposes under copyright law. 
              We transform public discussions into educational materials that provide significant value 
              for language learning.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">Daily English Topics is provided &quot;as is&quot; without warranty of any kind.</strong>
            </p>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc">
              <li>We do not guarantee the accuracy or completeness of educational content</li>
              <li>Content reflects authentic language use, which may include informal or colloquial expressions</li>
              <li>We are not responsible for the content of external links (Reddit)</li>
              <li>Language learning outcomes may vary for individual users</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              In no event shall Daily English Topics be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including but not limited to loss of profits, data, 
              or use, arising out of or related to your use of this website.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Content Removal</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you are the author of Reddit content that has been adapted into our educational materials 
              and would like it removed, please contact us through our GitHub repository.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We respect intellectual property rights and will respond to legitimate removal requests 
              in a timely manner.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Open Source License</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The source code for Daily English Topics is available under an open source license on GitHub. 
              You are free to fork, modify, and distribute the code according to the terms of that license.
            </p>
            <a 
              href="https://github.com/ttpss930141011/daily-english-topic" 
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <i className="fab fa-github mr-2"></i>
              View License on GitHub
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Changes will be posted on this page 
              and will be effective immediately upon posting.
            </p>
            <p className="text-gray-300 text-sm">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}