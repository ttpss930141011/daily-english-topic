# Daily English Topics - Next.js

A modern, animated English learning platform built with Next.js, React, and Framer Motion.

## Architecture

### Project Structure

```
daily-english-nextjs/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── slide/          # Slide viewer components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── lib/                # Core libraries and utilities
│   ├── animations.ts   # Framer Motion animations
│   ├── styles.ts       # Style constants
│   └── topics.ts       # Topic data management
├── pages/              # Next.js pages
├── public/             # Static assets
├── styles/             # Global CSS
└── types/              # TypeScript definitions
```

### Key Features

- **Modular Component Architecture**: Components are split into small, reusable pieces
- **Centralized Animation System**: All animations are defined in `lib/animations.ts`
- **Type Safety**: Full TypeScript support with centralized type definitions
- **Custom Hooks**: Reusable logic for keyboard navigation, fullscreen, etc.
- **Barrel Exports**: Clean import paths using index.ts files

### Component Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Documentation**: Include JSDoc comments for complex components
4. **Animations**: Use predefined animations from `lib/animations.ts`

### Animation System

All animations are centralized in `lib/animations.ts`:

```typescript
import { cardContainerVariants, hoverScale } from '@/lib'

// Use in components
<motion.div variants={cardContainerVariants} {...hoverScale}>
```

### Style System

Style constants are defined in `lib/styles.ts`:

```typescript
import { colors, spacing, shadows } from '@/lib'
```

### Custom Hooks

- `useKeyboardNavigation`: Handles keyboard shortcuts
- `useFullscreen`: Manages fullscreen state

### Performance Optimizations

- Static Site Generation (SSG) for all pages
- Lazy loading of components
- GPU-accelerated animations
- Optimized bundle size with barrel exports

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run export
```

## Code Quality

- ESLint configuration for consistent code style
- TypeScript strict mode enabled
- Component documentation with JSDoc
- Modular architecture for maintainability