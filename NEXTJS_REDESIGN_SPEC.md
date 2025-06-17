# Daily English Topics - Next.js 重構規格書

## 📋 專案概述

### 當前狀況分析
- **現有系統**：靜態 HTML + GitHub Pages
- **主要問題**：
  - 缺乏互動功能
  - SEO 優化有限
  - 手機體驗一般
  - 無用戶系統
  - 無搜索和篩選功能
  - 無學習進度追蹤

### 重構目標
打造一個現代化的英語學習平台，提供更好的用戶體驗、互動功能和學習追蹤能力。

## 🏗️ 技術架構

### 前端技術棧
```
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (動畫)
- React Hook Form (表單)
- Zustand (狀態管理)
- React Query (數據獲取)
```

### 後端 & 數據
```
- Vercel (部署)
- Vercel Edge Functions (API)
- Supabase (數據庫 + 認證)
- Prisma (ORM)
- Redis (緩存)
```

### 第三方服務
```
- OpenAI API (GPT-4)
- Reddit API (內容獲取)
- Vercel Analytics
- Sentry (錯誤追蹤)
```

## 🎯 功能需求

### 核心功能

#### 1. 話題瀏覽系統
- [x] 話題列表展示
- [x] 分類篩選（Discussion, Language, Lifestyle, Ethics, Career）
- [x] 日期篩選
- [x] 搜索功能
- [x] 無限滾動加載
- [x] 響應式設計

#### 2. 學習內容展示
- [x] 投影片模式（類似 Marp）
- [x] 文章模式（完整內容）
- [x] 音頻朗讀功能
- [x] 翻譯功能
- [x] 收藏功能
- [x] 筆記功能

#### 3. 用戶系統
- [x] 註冊/登錄（Email + Google OAuth）
- [x] 用戶資料管理
- [x] 學習進度追蹤
- [x] 個人化設定

#### 4. 學習追蹤
- [x] 已讀話題標記
- [x] 學習時間統計
- [x] 詞彙本功能
- [x] 進度儀表板
- [x] 成就系統

#### 5. 互動功能
- [x] 話題評論
- [x] 問答互動
- [x] 社群討論
- [x] 學習小組

### 高級功能

#### 6. AI 輔助學習
- [x] 智能問答機器人
- [x] 個人化學習建議
- [x] 詞彙難度分析
- [x] 學習計劃生成

#### 7. 內容管理
- [x] 管理員後台
- [x] 話題生成監控
- [x] 用戶反饋管理
- [x] 內容審核

#### 8. 數據分析
- [x] 學習行為分析
- [x] 熱門話題統計
- [x] 用戶留存分析

## 🎨 UI/UX 設計

### 設計原則
1. **簡潔現代**：清晰的視覺層次，減少認知負擔
2. **沉浸式學習**：專注於內容，減少干擾
3. **響應式**：完美適配手機、平板、桌面
4. **無障礙**：支持鍵盤導航、螢幕閱讀器
5. **國際化**：支持多語言切換

### 色彩系統
```css
/* Primary Colors */
--primary-50: #eff6ff
--primary-500: #3b82f6
--primary-900: #1e3a8a

/* Semantic Colors */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #06b6d4

/* Neutral Colors */
--gray-50: #f9fafb
--gray-900: #111827
```

### 字體系統
```css
/* Headings */
font-family: 'Inter', sans-serif
font-weights: 400, 500, 600, 700, 800

/* Body Text */
font-family: 'Inter', sans-serif
font-weights: 400, 500

/* Code */
font-family: 'JetBrains Mono', monospace
```

## 📱 頁面結構

### 1. 首頁 (`/`)
```
┌─ Hero Section
│  ├─ 標題與描述
│  ├─ 統計數據
│  └─ CTA 按鈕
├─ 最新話題
├─ 熱門分類
├─ 學習進度（已登錄用戶）
└─ 功能介紹
```

### 2. 話題列表 (`/topics`)
```
┌─ 搜索與篩選欄
├─ 話題卡片網格
│  └─ 無限滾動
├─ 側邊欄篩選
└─ 排序選項
```

### 3. 話題詳情 (`/topics/[slug]`)
```
┌─ 話題標題與元數據
├─ 學習內容
│  ├─ 投影片模式
│  ├─ 文章模式
│  └─ 音頻播放
├─ 互動功能
│  ├─ 收藏/筆記
│  ├─ 詞彙本
│  └─ 評論區
└─ 相關話題推薦
```

### 4. 用戶儀表板 (`/dashboard`)
```
┌─ 學習統計
├─ 最近學習
├─ 學習計劃
├─ 成就展示
└─ 個人化推薦
```

### 5. 詞彙本 (`/vocabulary`)
```
┌─ 搜索與分類
├─ 詞彙卡片
├─ 複習模式
└─ 匯出功能
```

### 6. 社群 (`/community`)
```
┌─ 討論區列表
├─ 熱門話題
├─ 學習小組
└─ 用戶排行榜
```

### 7. 設定 (`/settings`)
```
┌─ 個人資料
├─ 學習偏好
├─ 通知設定
└─ 隱私設定
```

## 🧩 組件設計

### 原子組件 (Atoms)
```typescript
// Button 組件
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode
  children: ReactNode
}

// Input 組件
interface InputProps {
  type: 'text' | 'email' | 'password' | 'search'
  placeholder?: string
  label?: string
  error?: string
  required?: boolean
}

// Badge 組件
interface BadgeProps {
  variant: 'primary' | 'secondary' | 'success' | 'warning'
  size: 'sm' | 'md'
  children: ReactNode
}
```

### 分子組件 (Molecules)
```typescript
// SearchBox 組件
interface SearchBoxProps {
  placeholder?: string
  onSearch: (query: string) => void
  suggestions?: string[]
}

// TopicCard 組件
interface TopicCardProps {
  topic: Topic
  onFavorite?: (id: string) => void
  showProgress?: boolean
}

// FilterPanel 組件
interface FilterPanelProps {
  categories: Category[]
  selectedCategory?: string
  onCategoryChange: (category: string) => void
}
```

### 有機體組件 (Organisms)
```typescript
// TopicGrid 組件
interface TopicGridProps {
  topics: Topic[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
}

// LearningSlides 組件
interface LearningSlidesProps {
  content: LearningContent
  currentSlide: number
  onSlideChange: (index: number) => void
  onComplete?: () => void
}

// UserDashboard 組件
interface UserDashboardProps {
  user: User
  stats: LearningStats
  recentTopics: Topic[]
}
```

## 📊 數據模型

### 數據庫設計 (Prisma Schema)
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  avatar      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  progress    Progress[]
  favorites   Favorite[]
  notes       Note[]
  comments    Comment[]
  vocabulary  VocabularyEntry[]
}

model Topic {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  category    Category
  redditUrl   String
  content     Json
  publishedAt DateTime
  
  // Relations
  progress    Progress[]
  favorites   Favorite[]
  notes       Note[]
  comments    Comment[]
}

model Progress {
  id          String   @id @default(cuid())
  userId      String
  topicId     String
  completed   Boolean  @default(false)
  timeSpent   Int      @default(0)
  lastSlide   Int      @default(0)
  createdAt   DateTime @default(now())
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
  topic       Topic    @relation(fields: [topicId], references: [id])
  
  @@unique([userId, topicId])
}

model VocabularyEntry {
  id          String   @id @default(cuid())
  userId      String
  word        String
  definition  String
  example     String?
  topicId     String?
  createdAt   DateTime @default(now())
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
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

## 🔄 數據流設計

### 狀態管理 (Zustand)
```typescript
// 用戶狀態
interface UserStore {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

// 學習狀態
interface LearningStore {
  currentTopic: Topic | null
  currentSlide: number
  progress: Progress[]
  setCurrentTopic: (topic: Topic) => void
  updateProgress: (topicId: string, data: Partial<Progress>) => void
  markCompleted: (topicId: string) => void
}

// UI 狀態
interface UIStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  language: 'en' | 'zh-TW'
  toggleTheme: () => void
  toggleSidebar: () => void
  setLanguage: (lang: string) => void
}
```

### API 層設計
```typescript
// API Routes
/api/topics              GET, POST
/api/topics/[id]         GET, PUT, DELETE
/api/users/me            GET, PUT
/api/users/me/progress   GET, POST
/api/users/me/favorites  GET, POST, DELETE
/api/users/me/vocabulary GET, POST, DELETE
/api/auth/login          POST
/api/auth/logout         POST
/api/search              GET
```

## 🚀 部署策略

### 環境配置
```
Development  -> Vercel Preview
Staging      -> Vercel Preview (staging branch)
Production   -> Vercel Production (main branch)
```

### CI/CD 流程
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 環境變數
```env
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# External APIs
OPENAI_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=

# Analytics
VERCEL_ANALYTICS_ID=
SENTRY_DSN=
```

## 📈 效能優化

### Core Web Vitals 目標
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 優化策略
1. **圖片優化**：Next.js Image 組件 + WebP
2. **代碼分割**：動態導入重型組件
3. **緩存策略**：ISR + SWR
4. **字體優化**：字體預加載 + 字體顯示交換
5. **Bundle 分析**：定期分析和優化包大小

## 🧪 測試策略

### 測試金字塔
```
E2E Tests (Playwright)     10%
Integration Tests (Jest)   20%
Unit Tests (Jest)          70%
```

### 測試範圍
- **單元測試**：組件、工具函數、API 路由
- **集成測試**：頁面渲染、API 整合
- **E2E 測試**：用戶關鍵流程
- **視覺回歸**：Chromatic

## 📊 分析與監控

### 用戶行為分析
- **Vercel Analytics**：頁面瀏覽、用戶流
- **自定義事件**：學習進度、功能使用
- **轉換追蹤**：註冊、話題完成

### 效能監控
- **Real User Monitoring**：Core Web Vitals
- **Sentry**：錯誤追蹤和效能監控
- **Uptime Monitoring**：服務可用性

## 🗓️ 開發計劃

### Phase 1: 基礎架構 (2-3 週)
- [x] Next.js 專案設置
- [x] 設計系統建立
- [x] 數據庫設計
- [x] 認證系統
- [x] 基礎 UI 組件

### Phase 2: 核心功能 (3-4 週)
- [x] 話題瀏覽系統
- [x] 學習內容展示
- [x] 搜索和篩選
- [x] 用戶儀表板
- [x] 基礎學習追蹤

### Phase 3: 高級功能 (2-3 週)
- [x] 詞彙本功能
- [x] 社群功能
- [x] AI 輔助功能
- [x] 音頻播放
- [x] 響應式優化

### Phase 4: 優化與發布 (1-2 週)
- [x] 效能優化
- [x] SEO 優化
- [x] 測試完善
- [x] 部署配置
- [x] 監控設置

## 💡 創新功能想法

### 1. AI 學習助手
- 個人化學習路徑推薦
- 實時問答支援
- 學習難度自動調整

### 2. 語音學習
- 發音練習與評分
- 語音筆記功能
- 聽力理解測試

### 3. 社交學習
- 學習夥伴配對
- 小組挑戰活動
- 知識分享社群

### 4. 離線功能
- Progressive Web App
- 離線內容下載
- 同步學習進度

### 5. 遊戲化元素
- 成就徽章系統
- 學習排行榜
- 每日挑戰任務

## 🎯 成功指標

### 技術指標
- **頁面載入速度**: < 2 秒
- **可用性**: 99.9% uptime
- **SEO 評分**: > 90
- **無障礙評分**: AAA 級別

### 業務指標
- **用戶留存率**: 週留存 > 40%
- **學習完成率**: > 60%
- **用戶滿意度**: NPS > 50
- **月活躍用戶**: 成長 20%

---

這個規格書涵蓋了從技術架構到用戶體驗的各個方面，為 Next.js 重構提供了全面的指導。接下來可以根據優先級逐步實現這些功能。