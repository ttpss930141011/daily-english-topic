# Daily English Topics

An automated English learning platform that generates daily discussion topics from Reddit's most popular posts, presented as interactive slides.

## 🌟 Features

- **Automated Content Generation**: Fetches hot posts from r/AskReddit daily using Reddit API
- **OAuth Authentication**: Supports Reddit OAuth to bypass IP blocking in CI environments  
- **Interactive Learning Slides**: Converts content to engaging Marp presentations
- **Comprehensive Learning Materials**: Each topic includes:
  - Vocabulary and phrases analysis
  - Cultural context explanations
  - Grammar points and usage examples
  - Extension activities for practice
- **Organized Archive**: All topics stored with descriptive slugified filenames
- **Responsive Web Interface**: Clean, mobile-friendly topic browser

## 🚀 Quick Start

### Prerequisites

- Python 3.x
- Node.js (for Marp CLI)
- Azure OpenAI API access
- Reddit API credentials (optional, for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ttpss930141011/daily-english-topic.git
   cd daily-english-topic
   ```

2. **Install dependencies**
   ```bash
   # Python dependencies
   pip install openai requests
   
   # Node.js dependencies  
   npm install -g @marp-team/marp-cli
   ```

3. **Configure environment variables**
   ```bash
   export AZURE_API_KEY="your-azure-openai-key"
   export REDDIT_CLIENT_ID="your-reddit-client-id"     # Optional
   export REDDIT_CLIENT_SECRET="your-reddit-secret"    # Optional
   ```

4. **Generate a topic**
   ```bash
   python scripts/generate_topic.py
   ```

5. **Build HTML slides**
   ```bash
   bash scripts/build_html.sh
   ```

## 📁 Project Structure

```
daily-english-topic/
├── posts/                          # Generated topic markdown files
│   └── {slug}-{ddmmyyyy}.md        # Format: what-is-your-biggest-regret-15062025.md
├── docs/                           # Generated HTML presentations
│   ├── {mmddyyyy}/index.html       # Daily slide presentations
│   └── index.html                  # Topic archive browser
├── scripts/
│   ├── generate_topic.py           # Main topic generation script
│   ├── reddit_oauth.py             # Reddit OAuth authentication
│   ├── build_html.sh              # HTML build script
│   ├── update_index.py             # Archive index generator
│   └── debug_ci.py                 # CI debugging utilities
├── .github/workflows/daily.yml     # Automated daily generation
├── config.json                     # Configuration settings
├── prompt.txt                      # LLM prompt template
└── CLAUDE.md                       # Development guidelines
```

## ⚙️ Configuration

Edit `config.json` to customize the behavior:

```json
{
  "reddit": {
    "comment_limit": 8,              # Number of comments to fetch
    "subreddit": "AskReddit",        # Target subreddit
    "post_limit": 1                  # Number of posts to fetch
  },
  "output": {
    "posts_directory": "posts",      # Markdown output directory
    "docs_directory": "docs",        # HTML output directory  
    "filename_format": "{title}-{date}.md"  # File naming pattern
  },
  "llm": {
    "max_tokens": 100000,           # Maximum response length
    "model": "o4-mini"              # Azure OpenAI model
  }
}
```

## 🔐 Reddit API Setup

### Option 1: OAuth Authentication (Recommended for CI)

1. Create a Reddit app at https://www.reddit.com/prefs/apps
2. Choose "script" type application
3. Set environment variables:
   ```bash
   export REDDIT_CLIENT_ID="your-app-id"
   export REDDIT_CLIENT_SECRET="your-app-secret"
   ```

### Option 2: Basic HTTP Requests

The system automatically falls back to basic requests when OAuth credentials are unavailable. Note that this may be blocked by Reddit in some CI environments.

## 🤖 Automated Generation

GitHub Actions automatically generates new topics daily at midnight UTC. The workflow:

1. Fetches the hottest post from r/AskReddit
2. Retrieves top comments for context
3. Generates educational content using Azure OpenAI
4. Creates Marp presentation slides
5. Updates the topic archive
6. Commits and publishes to GitHub Pages

## 📚 Topic Format

Each generated topic follows a structured format optimized for English learners:

### Content Sections
- **Link**: Original Reddit discussion
- **Topic Introduction**: Context and relevance
- **Learning Points**: Vocabulary, idioms, slang, grammar
- **Cultural Context**: Background information
- **Extension Activity**: Practice exercises

### File Naming Convention
- **Markdown**: `posts/{slug}-{ddmmyyyy}.md`
- **HTML**: `docs/{mmddyyyy}/index.html`  
- **Display**: Humanized titles in archive

Example: `posts/what-is-your-biggest-regret-15062025.md` → "What Is Your Biggest Regret"

## 🛠️ Development

### Adding New Features

1. Check `CLAUDE.md` for development guidelines
2. Update configuration in `config.json` if needed
3. Test locally before deploying
4. Follow conventional commit format

### Debugging

Use the debug script to troubleshoot issues:

```bash
python scripts/debug_ci.py
```

This script provides detailed information about:
- Environment variables
- File structure
- API connectivity
- Configuration validation

## 📖 Usage Examples

### Manual Topic Generation
```bash
# Generate today's topic
python scripts/generate_topic.py

# Build HTML presentation
bash scripts/build_html.sh

# Update topic archive
python scripts/update_index.py
```

### Custom Subreddit
Modify `config.json` to fetch from different subreddits:
```json
{
  "reddit": {
    "subreddit": "explainlikeimfive"
  }
}
```

## 🌐 Live Demo

Visit the live site: [Daily English Topics](https://ttpss930141011.github.io/daily-english-topic/)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📧 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/ttpss930141011/daily-english-topic/issues) on GitHub.