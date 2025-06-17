# Next.js 項目結構規劃

## 📂 目錄結構

```
daily-english-topics-nextjs/
├── 📁 app/                           # Next.js App Router
│   ├── 📁 (auth)/                    # 路由群組
│   │   ├── 📄 login/page.tsx
│   │   └── 📄 register/page.tsx
│   ├── 📁 topics/
│   │   ├── 📄 page.tsx               # 話題列表
│   │   └── 📁 [slug]/
│   │       └── 📄 page.tsx           # 話題詳情
│   ├── 📁 dashboard/
│   │   ├── 📄 page.tsx
│   │   ├── 📄 progress/page.tsx
│   │   └── 📄 vocabulary/page.tsx
│   ├── 📁 community/
│   │   ├── 📄 page.tsx
│   │   └── 📁 [id]/page.tsx
│   ├── 📁 api/                       # API Routes
│   │   ├── 📁 auth/
│   │   │   └── 📄 [...nextauth]/route.ts
│   │   ├── 📁 topics/
│   │   │   ├── 📄 route.ts
│   │   │   └── 📁 [id]/route.ts
│   │   ├── 📁 users/
│   │   │   └── 📁 me/
│   │   │       ├── 📄 route.ts
│   │   │       ├── 📄 progress/route.ts
│   │   │       └── 📄 vocabulary/route.ts
│   │   └── 📄 search/route.ts
│   ├── 📄 layout.tsx                 # 根布局
│   ├── 📄 page.tsx                   # 首頁
│   ├── 📄 loading.tsx                # 全局加載
│   ├── 📄 error.tsx                  # 全局錯誤
│   └── 📄 not-found.tsx              # 404 頁面
├── 📁 components/                     # React 組件
│   ├── 📁 ui/                        # 基礎 UI 組件
│   │   ├── 📄 button.tsx
│   │   ├── 📄 input.tsx
│   │   ├── 📄 modal.tsx
│   │   ├── 📄 badge.tsx
│   │   └── 📄 card.tsx
│   ├── 📁 layout/                    # 布局組件
│   │   ├── 📄 header.tsx
│   │   ├── 📄 navigation.tsx
│   │   ├── 📄 sidebar.tsx
│   │   └── 📄 footer.tsx
│   ├── 📁 topic/                     # 話題相關組件
│   │   ├── 📄 topic-card.tsx
│   │   ├── 📄 topic-grid.tsx
│   │   ├── 📄 topic-filter.tsx
│   │   ├── 📄 learning-slides.tsx
│   │   └── 📄 slide-navigation.tsx
│   ├── 📁 dashboard/                 # 儀表板組件
│   │   ├── 📄 stats-cards.tsx
│   │   ├── 📄 progress-chart.tsx
│   │   ├── 📄 recent-topics.tsx
│   │   └── 📄 achievement-badges.tsx
│   ├── 📁 vocabulary/                # 詞彙本組件
│   │   ├── 📄 vocabulary-card.tsx
│   │   ├── 📄 vocabulary-list.tsx
│   │   └── 📄 study-mode.tsx
│   └── 📁 forms/                     # 表單組件
│       ├── 📄 login-form.tsx
│       ├── 📄 register-form.tsx
│       └── 📄 profile-form.tsx
├── 📁 lib/                           # 工具庫
│   ├── 📄 auth.ts                    # NextAuth 配置
│   ├── 📄 db.ts                      # Prisma 客戶端
│   ├── 📄 redis.ts                   # Redis 配置
│   ├── 📄 openai.ts                  # OpenAI 客戶端
│   ├── 📄 reddit.ts                  # Reddit API
│   ├── 📄 utils.ts                   # 通用工具函數
│   ├── 📄 validations.ts             # Zod 驗證模式
│   └── 📄 constants.ts               # 常數定義
├── 📁 stores/                        # Zustand 狀態管理
│   ├── 📄 user-store.ts
│   ├── 📄 learning-store.ts
│   ├── 📄 ui-store.ts
│   └── 📄 vocabulary-store.ts
├── 📁 hooks/                         # 自定義 Hooks
│   ├── 📄 use-topics.ts
│   ├── 📄 use-progress.ts
│   ├── 📄 use-vocabulary.ts
│   ├── 📄 use-auth.ts
│   └── 📄 use-local-storage.ts
├── 📁 types/                         # TypeScript 類型定義
│   ├── 📄 auth.ts
│   ├── 📄 topic.ts
│   ├── 📄 user.ts
│   ├── 📄 api.ts
│   └── 📄 database.ts
├── 📁 styles/                        # 樣式文件
│   └── 📄 globals.css                # Tailwind + 全局樣式
├── 📁 prisma/                        # Prisma 數據庫
│   ├── 📄 schema.prisma
│   ├── 📁 migrations/
│   └── 📄 seed.ts
├── 📁 public/                        # 靜態資源
│   ├── 📁 images/
│   ├── 📁 icons/
│   └── 📄 favicon.ico
├── 📁 docs/                          # 文檔
│   ├── 📄 api.md
│   ├── 📄 deployment.md
│   └── 📄 contributing.md
├── 📁 __tests__/                     # 測試文件
│   ├── 📁 components/
│   ├── 📁 pages/
│   ├── 📁 api/
│   └── 📁 utils/
├── 📄 package.json
├── 📄 next.config.js
├── 📄 tailwind.config.js
├── 📄 tsconfig.json
├── 📄 .env.local
├── 📄 .env.example
├── 📄 .gitignore
├── 📄 README.md
└── 📄 vercel.json
```

## 🏗️ 組件架構

### 組件層次結構 (Atomic Design)

```
📦 原子組件 (Atoms)
├── Button
├── Input
├── Badge
├── Avatar
├── Icon
├── Loading
└── Tooltip

📦 分子組件 (Molecules)
├── SearchBox (Input + Icon + Button)
├── UserDropdown (Avatar + Menu)
├── ProgressBar (Progress + Text)
├── VocabularyCard (Card + Badge + Actions)
├── TopicMeta (Date + Category + ReadTime)
└── SlideCounter (Text + Navigation)

📦 有機體組件 (Organisms)
├── Header (Logo + Navigation + UserDropdown)
├── TopicGrid (Filter + SearchBox + TopicCards)
├── LearningSlides (Slides + Navigation + Progress)
├── Dashboard (StatsCards + Charts + RecentActivity)
├── VocabularyList (SearchBox + Filters + Cards)
└── CommentSection (Form + CommentList)

📦 模板組件 (Templates)
├── AppLayout (Header + Sidebar + Content + Footer)
├── AuthLayout (Form + Background + Links)
├── DashboardLayout (Navigation + Content)
└── LearningLayout (Fullscreen + Controls)

📦 頁面組件 (Pages)
├── HomePage
├── TopicsPage
├── TopicDetailPage
├── DashboardPage
├── VocabularyPage
├── CommunityPage
├── LoginPage
└── RegisterPage
```

## 🔧 技術配置文件

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/stores/*": ["./stores/*"],
      "@/hooks/*": ["./hooks/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📱 響應式設計斷點

```css
/* Tailwind 斷點 */
sm: 640px   /* 手機橫屏 */
md: 768px   /* 平板直屏 */
lg: 1024px  /* 平板橫屏 / 小筆電 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大桌面 */
```

### 響應式組件示例
```tsx
// TopicCard 響應式設計
<div className="
  w-full 
  sm:w-1/2 
  lg:w-1/3 
  xl:w-1/4 
  p-4
">
  <Card className="
    h-full
    transition-transform
    hover:scale-105
    hover:shadow-lg
  ">
    {/* 卡片內容 */}
  </Card>
</div>
```

## 🎨 設計 Token 系統

### 間距系統
```css
/* Tailwind 間距 */
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
6: 24px
8: 32px
12: 48px
16: 64px
20: 80px
24: 96px
```

### 字體大小
```css
/* 字體階層 */
xs: 12px    /* 輔助文字 */
sm: 14px    /* 小文字 */
base: 16px  /* 正文 */
lg: 18px    /* 大文字 */
xl: 20px    /* 小標題 */
2xl: 24px   /* 中標題 */
3xl: 30px   /* 大標題 */
4xl: 36px   /* 主標題 */
```

### 圓角系統
```css
/* 圓角大小 */
none: 0px
sm: 2px     /* 按鈕 */
DEFAULT: 4px /* 卡片 */
md: 6px     /* 輸入框 */
lg: 8px     /* 模態框 */
xl: 12px    /* 容器 */
full: 9999px /* 圓形 */
```

## 🔄 狀態管理架構

### Store 結構
```typescript
// stores/index.ts
export { useUserStore } from './user-store'
export { useLearningStore } from './learning-store'
export { useUIStore } from './ui-store'
export { useVocabularyStore } from './vocabulary-store'

// 組合 Store
export const useAppStore = () => ({
  user: useUserStore(),
  learning: useLearningStore(),
  ui: useUIStore(),
  vocabulary: useVocabularyStore(),
})
```

### 數據流向
```
API ← → Stores ← → Components
 ↓         ↓         ↓
Cache    Persist   Local State
```

這個項目結構提供了清晰的組織方式，讓開發團隊能夠有效協作並維護代碼品質。