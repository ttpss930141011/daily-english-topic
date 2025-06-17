# Daily English Topics - Next.js

A modern web application for daily English learning topics, featuring an interactive slide viewer and comprehensive learning materials.

## 🌟 Features

- **Interactive Slide Viewer**: Navigate through learning content with keyboard shortcuts
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Topic Categories**: Organized by Discussion, Language, Lifestyle, Ethics, and Career
- **Fullscreen Mode**: Immersive learning experience
- **Modern UI**: Clean, animated interface with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/daily-english-topic.git
cd daily-english-topic/daily-english-nextjs

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
daily-english-nextjs/
├── content/posts/      # Markdown files for daily topics
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── package.json      # Project dependencies
```

## ⌨️ Keyboard Shortcuts

When viewing slides:
- **Arrow Keys**: Navigate between slides
- **Space/Enter**: Next slide
- **F/F11**: Toggle fullscreen
- **Home/End**: First/last slide
- **Escape**: Exit fullscreen

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📝 Content Format

Topics are stored as Markdown files in `content/posts/` with the following frontmatter:

```markdown
---
title: "Topic Title"
date: "2025-06-16"
category: "DISCUSSION"
reddit_url: "https://reddit.com/..."
---

# Slide 1 Content
---
# Slide 2 Content
```

## 🌐 Deployment

This project can be deployed to:

- **Vercel**: The easiest deployment platform for Next.js
- **Netlify**: Alternative static hosting
- **Docker**: Containerized deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/daily-english-topic)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Content generated using Azure OpenAI GPT-4
- Reddit community for discussion topics
- Built with Next.js and Tailwind CSS