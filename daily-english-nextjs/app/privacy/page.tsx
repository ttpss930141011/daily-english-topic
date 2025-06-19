export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-animated-dots opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8 text-center">
            Privacy Policy
          </h1>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Data Collection</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">We do not collect personal information.</strong> Daily English Topics is a static website 
              that does not require user registration, login, or any personal data submission.
            </p>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc">
              <li>No cookies are stored on your device</li>
              <li>No tracking scripts or analytics are used</li>
              <li>No user accounts or profiles are created</li>
              <li>No personal information is requested or stored</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Content Sources</h2>
            <h3 className="text-lg font-medium text-purple-300 mb-2">Reddit API</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              We use Reddit&apos;s public API to fetch discussions from the r/AskReddit community. 
              All content accessed is already publicly available on Reddit.
            </p>
            <ul className="text-gray-300 space-y-2 ml-6 list-disc mb-4">
              <li>Only public posts and comments are accessed</li>
              <li>No private or deleted content is used</li>
              <li>Reddit usernames are not displayed or stored</li>
              <li>Content is used for educational purposes only</li>
            </ul>

            <h3 className="text-lg font-medium text-purple-300 mb-2">Azure OpenAI</h3>
            <p className="text-gray-300 leading-relaxed">
              We use Azure OpenAI services to analyze Reddit content and generate educational materials. 
              Reddit discussions are processed to create English learning content, but no personal data is involved.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">GitHub Pages</h3>
                <p className="text-gray-300 text-sm">
                  This website is hosted on GitHub Pages. Please refer to 
                  <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" 
                     className="text-blue-400 hover:text-blue-300 transition-colors"> GitHub&apos;s Privacy Policy</a> 
                  for information about their data handling practices.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">External Links</h3>
                <p className="text-gray-300 text-sm">
                  Our content includes links to Reddit discussions. When you click these links, 
                  you will be redirected to Reddit.com, which has its own privacy policy.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Since we do not collect personal data, there is no personal information to access, 
              modify, or delete. You can use this website anonymously without any privacy concerns.
            </p>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about content sourcing or would like a specific Reddit discussion 
              removed from our educational materials, please contact us through our GitHub repository.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Updates</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              This privacy policy may be updated occasionally to reflect changes in our practices 
              or legal requirements. Any updates will be posted on this page.
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