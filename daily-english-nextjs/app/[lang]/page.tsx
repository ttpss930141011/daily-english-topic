import { getAllTopics, Topic } from '@/lib/topics'
import TopicGrid from '@/components/TopicGrid'
import BuyMeACoffeeButton from '@/components/BuyMeACoffeeButton'
import Link from 'next/link'
import { getDictionary } from '@/lib/dictionaries'
import { type Locale } from '@/i18n-config'

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const topics: Topic[] = getAllTopics()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-animated-dots opacity-30">
        </div>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Main Content */}
      <main className="relative z-10">
        <TopicGrid topics={topics} lang={lang} dictionary={dictionary} />
        
        {/* Buy Me a Coffee Section */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <BuyMeACoffeeButton />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-lg py-8 border-t border-white/10">
        <div className="container mx-auto px-6 text-gray-300">
          <div className="flex flex-wrap justify-center space-x-6">
            <a href="https://github.com/ttpss930141011/daily-english-topic" className="hover:text-white transition-colors">
              <i className="fab fa-github mr-1"></i>GitHub
            </a>
            <Link href={`/${lang}/about`} className="hover:text-white transition-colors">About</Link>
            <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors">Privacy</Link>
            <Link href={`/${lang}/terms`} className="hover:text-white transition-colors">Terms</Link>
          </div>
          <p className="mt-4 text-center text-sm">
            Updated on {new Date().toLocaleDateString()} • Powered by Reddit API & Azure OpenAI
          </p>
        </div>
      </footer>
    </div>
  )
}