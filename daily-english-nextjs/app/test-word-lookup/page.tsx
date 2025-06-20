'use client'

import { WordLookupProvider } from '@/contexts/WordLookupContext'
import { WordLookupManager } from '@/components/word-lookup/WordLookupManager'

export default function TestWordLookupPage() {
  return (
    <WordLookupProvider defaultLanguage="zh-TW">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Word Lookup Test Page
          </h1>
          
          <WordLookupManager className="bg-white text-slate-800 rounded-xl p-8 shadow-2xl">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                  Test Text Selection and Word Lookup
                </h2>
                <p className="text-lg leading-relaxed">
                  Welcome to our <strong>interactive</strong> English learning platform! 
                  Here you can select any word to get detailed explanations, translations, 
                  and pronunciation guides. Try selecting words like "beautiful", "interesting", 
                  "affordable", or "explanation" to test the features.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                  Advanced Vocabulary
                </h2>
                <p className="text-lg leading-relaxed">
                  This paragraph contains more <em>sophisticated</em> vocabulary. Words like 
                  "magnificent", "extraordinary", "phenomenal", and "unprecedented" are perfect 
                  for testing the deep explanation feature. The system should provide comprehensive 
                  analysis including etymology, usage patterns, and cultural context.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                  Common Phrases and Idioms
                </h2>
                <p className="text-lg leading-relaxed">
                  English idioms can be tricky! Phrases like "break the ice", "piece of cake", 
                  "hit the nail on the head", and "spill the beans" have meanings that go beyond 
                  their literal words. Select these phrases to see how the system handles 
                  multi-word expressions and cultural explanations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-600">
                  Technical Terms
                </h2>
                <p className="text-lg leading-relaxed">
                  For more advanced learners, try technical terms like "algorithm", "paradigm", 
                  "infrastructure", "authentication", and "optimization". These words often have 
                  specific meanings in professional contexts and should trigger detailed explanations.
                </p>
              </section>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  How to Test:
                </h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• Select any word by double-clicking or dragging</li>
                  <li>• Wait for the quick lookup popup to appear</li>
                  <li>• Test the drag functionality by moving the popup</li>
                  <li>• Click "查看更多定義" to open deep explanation</li>
                  <li>• Try the translation feature with different words</li>
                </ul>
              </div>
            </div>
          </WordLookupManager>
        </div>
      </div>
    </WordLookupProvider>
  )
}