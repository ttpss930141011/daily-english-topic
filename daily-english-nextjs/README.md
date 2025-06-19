# Daily English Topics - Next.js

A modern, animated English learning platform built with Next.js, React, and Framer Motion.

## Architecture

### Project Structure

```
daily-english-nextjs/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Homepage
│   └── topic/[date]/
│       └── page.tsx           # Dynamic topic routes
├── components/
│   ├── AnimatedBackground.tsx # Dynamic background effects
│   ├── HomeHeader.tsx         # Main header component
│   ├── SlideViewer.tsx        # Core slide presentation
│   ├── TopicCard.tsx          # Topic card display
│   ├── TopicGrid.tsx          # Topic grid layout
│   ├── WordPopup.tsx          # Interactive word definitions
│   ├── InteractiveWord.tsx    # Clickable word component
│   ├── slide/                 # Slide-specific components
│   │   ├── SlideHeader.tsx
│   │   └── SlideNavigation.tsx
│   └── ui/                    # Reusable UI components
│       ├── Button.tsx
│       ├── LoadingSpinner.tsx
│       └── ...shadcn components
├── hooks/                     # Custom React hooks
│   ├── useKeyboardNavigation.ts
│   └── useFullscreen.ts
├── lib/                       # Utilities and configurations
│   ├── animations.ts          # Framer Motion variants
│   ├── styles.ts             # Tailwind class utilities
│   └── topics.ts             # Topic data management
└── types/                     # TypeScript definitions
    └── index.ts              # Centralized type exports
```

### Key Features

1. **Animated Transitions**: Smooth page and slide transitions using Framer Motion
2. **Interactive Learning**: Click on words for definitions and pronunciation
3. **Keyboard Navigation**: Arrow keys, Space, and Escape for navigation
4. **Fullscreen Mode**: Immersive presentation view with F key
5. **Responsive Design**: Mobile-first approach with adaptive layouts
6. **TypeScript**: Full type safety across the application

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.