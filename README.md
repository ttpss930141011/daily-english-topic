# Daily English Topics

An automated English learning platform that generates daily discussion topics from Reddit's most popular posts, presented as interactive slide presentations.

## 🌟 Features

- **Modern Next.js Interface**: Interactive slide viewer with navigation and search
- **Automated Content Generation**: Daily topics from Reddit's r/AskReddit using LangChain + Azure OpenAI
- **Structured Learning Materials**: Each topic includes vocabulary, grammar, cultural context, and practice activities
- **Advanced Filtering**: Filter by tags, categories, and difficulty levels with date sorting
- **Interactive Slide Navigation**: Smooth slide transitions with keyboard shortcuts and progress tracking
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **OAuth Authentication**: Robust Reddit API integration with fallback mechanisms

## 🚀 Quick Start

### Prerequisites

- Python 3.x with LangChain support
- Node.js 18+ and npm
- Azure OpenAI API access
- Reddit API credentials (optional, for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ttpss930141011/daily-english-topic.git
   cd daily-english-topic
   ```

2. **Install Python dependencies**
   ```bash
   pip install openai langchain-openai pydantic requests
   ```

3. **Install and setup Next.js frontend**
   ```bash
   cd daily-english-nextjs
   npm install
   npm run build
   ```

4. **Configure environment variables**
   ```bash
   export AZURE_API_KEY="your-azure-openai-key"
   export REDDIT_CLIENT_ID="your-reddit-client-id"     # Optional
   export REDDIT_CLIENT_SECRET="your-reddit-secret"    # Optional
   ```

5. **Generate a topic**
   ```bash
   python scripts/generate_topic_langchain.py
   ```

6. **Start the development server**
   ```bash
   cd daily-english-nextjs
   npm run dev
   ```

## 📁 Project Structure

```
daily-english-topic/
├── daily-english-nextjs/           # Next.js frontend application
│   ├── app/                        # App router pages
│   │   ├── about/                  # About page
│   │   ├── privacy/                # Privacy policy
│   │   ├── terms/                  # Terms of service
│   │   └── topic/[date]/           # Dynamic topic pages
│   ├── components/                 # React components
│   │   ├── TopicGrid.tsx          # Main topic browser with filtering
│   │   ├── SlideViewer.tsx        # Interactive slide presentation
│   │   └── BuyMeACoffeeButton.tsx # Support button
│   ├── lib/                       # Utility functions
│   │   └── topics.ts              # Topic data parsing and management
│   └── posts/                     # Generated markdown content
├── scripts/
│   ├── generate_topic_langchain.py # LangChain-powered topic generation
│   ├── reddit_oauth.py            # Reddit OAuth authentication
│   └── debug_ci.py                # CI debugging utilities
├── .github/workflows/daily.yml     # Automated daily generation
├── config.json                     # Configuration settings
├── prompt_langchain.txt            # Structured LLM prompt template
└── CLAUDE.md                       # Development guidelines
```

## ⚙️ Configuration

Edit `config.json` to customize behavior:

```json
{
  "reddit": {
    "comment_limit": 20,             # Number of comments to analyze
    "subreddit": "AskReddit",        # Target subreddit
    "post_limit": 1                  # Posts to fetch per run
  },
  "output": {
    "posts_directory": "daily-english-nextjs/posts",
    "docs_directory": "docs",        # Legacy HTML output
    "filename_format": "{title}-{date}.md"
  },
  "llm": {
    "max_tokens": 100000,           # Token limit for responses
    "model": "o4-mini"              # Azure OpenAI model
  }
}
```

## 🎯 Topic Format & Structure

Each generated topic follows a comprehensive educational structure:

### Content Sections
- **Link**: Original Reddit discussion
- **Topic Introduction**: Context and learning relevance
- **Learning Points**: 
  - Colloquial phrases & idioms
  - Internet slang & abbreviations  
  - Grammar patterns with examples
- **Pronunciation Practice**: Phonetic guides and stress patterns
- **Discussion Questions**: Open-ended conversation starters
- **Template Answers**: Example responses using lesson vocabulary
- **Cultural Context**: Background explanations and cultural insights
- **Extension Activity**: Practical role-play and practice exercises

### Metadata Structure
```yaml
---
title: "Topic Title"
category: "Discussion|Language|Lifestyle|Ethics|Career|General"
date: "YYYY-MM-DD"
subreddit: "AskReddit"
tags: ["tag1", "tag2", "tag3"]
difficulty: "beginner|intermediate|advanced"
---
```

## 🎨 User Interface Features

### Topic Browser
- **Smart Filtering**: Filter by category, tags, and difficulty
- **Date Sorting**: Sort topics by newest/oldest first
- **Search Functionality**: Find topics by title or content
- **Responsive Cards**: Beautiful topic cards with metadata display

### Slide Viewer
- **Interactive Navigation**: Arrow keys, click navigation, and progress dots
- **Fullscreen Mode**: Distraction-free presentation view
- **Responsive Design**: Optimized for all screen sizes
- **Support Integration**: Buy Me a Coffee button on final slides

## 🤖 Automated Generation

GitHub Actions runs daily topic generation:

1. **Content Discovery**: Fetches trending Reddit discussions
2. **AI Analysis**: LangChain + Azure OpenAI processes content
3. **Structured Output**: Pydantic models ensure consistent formatting
4. **Quality Assurance**: Validates generated content structure
5. **Deployment**: Commits and deploys to GitHub Pages

## 🔐 Reddit API Setup

### OAuth Authentication (Recommended)
1. Create Reddit app at https://www.reddit.com/prefs/apps
2. Choose "script" type application
3. Set environment variables:
   ```bash
   export REDDIT_CLIENT_ID="your-app-id"
   export REDDIT_CLIENT_SECRET="your-app-secret"
   ```

### Fallback Mode
Automatically uses basic HTTP requests when OAuth unavailable.

## 🌐 Live Demo

Visit: [Daily English Topics](https://ttpss930141011.github.io/daily-english-topic/)

### Sample Pages
- **Homepage**: Browse all topics with filtering and search
- **About**: Project information and technology details
- **Privacy**: Data handling and privacy policy
- **Terms**: Usage terms and content licensing

## 🛠️ Development

### Local Development
```bash
# Backend: Generate new content
python scripts/generate_topic_langchain.py

# Frontend: Start development server
cd daily-english-nextjs
npm run dev

# Build for production
npm run build
```

### Key Technologies
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Python, LangChain, Pydantic, Azure OpenAI
- **UI Components**: Radix UI, Lucide React icons
- **Deployment**: GitHub Pages, GitHub Actions

## 📊 Content Quality

The LangChain integration ensures high-quality educational content:

- **Structured Parsing**: Pydantic models validate output format
- **Authentic Language**: Direct extraction from real conversations
- **Educational Focus**: Systematic coverage of vocabulary, grammar, and culture
- **Consistency**: Template-driven generation for uniform quality

## ☕ Support

If you find this project helpful, consider supporting it:
- [Buy me a coffee](https://coff.ee/o927416847f) ☕
- ⭐ Star this repository
- 🐛 Report issues or suggest features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

For major changes, open an issue first to discuss your ideas.

## 📧 Support & Issues

- [GitHub Issues](https://github.com/ttpss930141011/daily-english-topic/issues)
- [Discussions](https://github.com/ttpss930141011/daily-english-topic/discussions)

---

**Made with ❤️ for English learners worldwide**