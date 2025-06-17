# 開發環境設置指南

## 🚀 快速開始

### 環境要求
- Node.js 18.17+ 
- npm 或 yarn 或 pnpm
- Git

### 初始化 Next.js 項目

```bash
# 創建新的 Next.js 項目
npx create-next-app@latest daily-english-topics-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd daily-english-topics-nextjs

# 安裝額外依賴
npm install @prisma/client prisma next-auth @auth/prisma-adapter
npm install zustand @tanstack/react-query framer-motion
npm install react-hook-form @hookform/resolvers zod
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install lucide-react @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install date-fns clsx tailwind-merge

# 開發依賴
npm install -D @types/node eslint-config-next prettier prettier-plugin-tailwindcss
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test
```

## 📦 package.json 配置

```json
{
  "name": "daily-english-topics-nextjs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "prepare": "husky install"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^1.0.9",
    "@hookform/resolvers": "^3.3.2",
    "@prisma/client": "^5.7.1",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "@supabase/supabase-js": "^2.38.5",
    "@tanstack/react-query": "^5.8.4",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "next": "14.0.4",
    "next-auth": "^4.24.5",
    "react": "^18",
    "react-dom": "^18",
    "react-hook-form": "^7.48.2",
    "tailwind-merge": "^2.1.0",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.1",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "husky": "^8.0.3",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.7",
    "prisma": "^5.7.1",
    "tailwindcss": "^3.3.0",
    "tsx": "^4.6.2",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=18.17.0"
  }
}
```

## 🗄️ 數據庫設置 (Prisma + Supabase)

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  progress      Progress[]
  favorites     Favorite[]
  notes         Note[]
  comments      Comment[]
  vocabulary    VocabularyEntry[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Topic {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  category    Category @default(GENERAL)
  redditUrl   String
  content     Json
  publishedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  progress    Progress[]
  favorites   Favorite[]
  notes       Note[]
  comments    Comment[]

  @@index([category])
  @@index([publishedAt])
}

model Progress {
  id        String   @id @default(cuid())
  userId    String
  topicId   String
  completed Boolean  @default(false)
  timeSpent Int      @default(0) // in seconds
  lastSlide Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topic     Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)

  @@unique([userId, topicId])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  topicId   String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topic     Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)

  @@unique([userId, topicId])
}

model Note {
  id        String   @id @default(cuid())
  userId    String
  topicId   String
  content   String   @db.Text
  slideIndex Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topic     Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
}

model Comment {
  id        String   @id @default(cuid())
  userId    String
  topicId   String
  content   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topic     Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
}

model VocabularyEntry {
  id         String   @id @default(cuid())
  userId     String
  word       String
  definition String   @db.Text
  example    String?  @db.Text
  topicId    String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

enum Category {
  DISCUSSION
  LANGUAGE
  LIFESTYLE
  ETHICS
  CAREER
  GENERAL
}
```

## 🔐 環境變數設置

### .env.example
```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# External APIs
OPENAI_API_KEY="your-openai-api-key"
REDDIT_CLIENT_ID="your-reddit-client-id"
REDDIT_CLIENT_SECRET="your-reddit-client-secret"

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Redis (if using)
REDIS_URL="redis://localhost:6379"

# Analytics
VERCEL_ANALYTICS_ID="your-vercel-analytics-id"
NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# Error Tracking
SENTRY_DSN="your-sentry-dsn"
```

## 🧪 測試設置

### jest.config.js
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 🎨 UI 組件庫設置

### lib/utils.ts
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) return '剛剛'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} 分鐘前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} 小時前`
  return `${Math.floor(diffInSeconds / 86400)} 天前`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### components/ui/button.tsx
```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

## 🚀 開發流程

### 1. 每日開發流程
```bash
# 拉取最新代碼
git pull origin main

# 創建功能分支
git checkout -b feature/new-feature

# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 運行測試
npm run test:watch

# 代碼格式化
npm run format

# 類型檢查
npm run type-check

# 提交代碼
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### 2. 代碼品質檢查
```bash
# Lint 檢查
npm run lint

# 類型檢查
npm run type-check

# 格式檢查
npm run format:check

# 單元測試
npm run test

# E2E 測試
npm run test:e2e
```

### 3. 數據庫操作
```bash
# 生成 Prisma 客戶端
npm run db:generate

# 應用數據庫更改
npm run db:push

# 創建並應用遷移
npm run db:migrate

# 填充種子數據
npm run db:seed

# 打開數據庫管理界面
npm run db:studio
```

## 📝 Git 工作流

### Commit 規範
```
feat: 新功能
fix: 修復 bug
docs: 文檔更新
style: 格式化代碼
refactor: 重構
test: 測試相關
chore: 構建工具或輔助工具的變動
```

### 分支策略
```
main        生產分支
develop     開發分支
feature/*   功能分支
hotfix/*    緊急修復分支
release/*   發布分支
```

這個設置提供了完整的開發環境配置，讓你能夠快速開始 Next.js 項目的開發。