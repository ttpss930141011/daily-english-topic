# 🚀 Next.js Framework Architecture

## 📋 設計目標

將現有的 Markdown → Marp → HTML 流程遷移到 Next.js，同時：
- 保留完整的投影片式學習體驗
- 增強互動功能和可維護性
- 保持 GitHub Pages 靜態托管相容性
- 提供更好的開發者體驗

## 🏗️ 架構概覽

### 混合模式架構
```
現有: MD → Marp → HTML
新版: MD → Next.js → Static Site (投影片式)
```

### 目錄結構
```
daily-english-nextjs/
├── components/
│   ├── SlideViewer.tsx      # 投影片檢視器元件
│   ├── InteractiveWord.tsx  # 互動單字元件
│   ├── WordPopup.tsx        # 單字彈窗元件
│   └── TopicCard.tsx        # 主題卡片元件
├── pages/
│   ├── index.tsx            # 主頁 (主題列表)
│   ├── topic/
│   │   └── [date].tsx       # 動態路由投影片頁面
│   └── api/
│       └── dictionary/      # 字典 API 端點
├── data/
│   ├── topics/             # Markdown 檔案
│   └── processed/          # 處理後的 JSON 資料
├── styles/
│   └── slides.css          # 投影片樣式
├── lib/
│   ├── markdown.ts         # Markdown 處理工具
│   ├── slideParser.ts      # 投影片解析器
│   └── dictionary.ts       # 字典功能
└── public/
    └── slides/             # 靜態資源
```

## 🎯 核心元件設計

### SlideViewer Component
```typescript
interface SlideViewerProps {
  slides: Slide[]
  interactive?: boolean
  theme?: 'light' | 'dark'
  onWordClick?: (word: string) => void
}

const SlideViewer: React.FC<SlideViewerProps> = ({
  slides,
  interactive = true,
  theme = 'light',
  onWordClick
}) => {
  // 投影片導航邏輯
  // 全螢幕模式
  // 鍵盤快捷鍵
  // 進度指示器
}
```

### InteractiveWord Component
```typescript
interface InteractiveWordProps {
  word: string
  children: React.ReactNode
  definition?: WordDefinition
}

const InteractiveWord: React.FC<InteractiveWordProps> = ({
  word,
  children,
  definition
}) => {
  // 滑鼠懸停預覽
  // 點擊詳細資訊
  // 發音功能
  // 學習進度追蹤
}
```

## 📊 資料流程

### 1. 建置時資料處理
```typescript
// lib/buildData.ts
export async function processTopics() {
  const topics = await getMarkdownFiles()
  return topics.map(topic => ({
    date: extractDate(topic.filename),
    title: extractTitle(topic.content),
    slides: parseSlides(topic.content),
    metadata: extractMetadata(topic.frontmatter),
    interactiveWords: extractInteractiveWords(topic.content)
  }))
}
```

### 2. 執行時投影片渲染
```typescript
// pages/topic/[date].tsx
export async function getStaticProps({ params }) {
  const topicData = await getTopicByDate(params.date)
  return {
    props: { topic: topicData }
  }
}

export async function getStaticPaths() {
  const topics = await getAllTopics()
  return {
    paths: topics.map(topic => ({ params: { date: topic.date } })),
    fallback: false
  }
}
```

## 🎨 投影片體驗保留

### 全螢幕投影片模式
```typescript
const SlideShow: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // 鍵盤導航 (←/→ 箭頭鍵)
  // 觸控手勢支援
  // 投影片轉場動畫
  // 自動播放模式
}
```

### Marp 樣式相容性
```css
/* styles/marp-compat.css */
.slide {
  /* 保留 Marp 的投影片尺寸和樣式 */
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
```

## 🔧 開發工具整合

### 即時預覽
```typescript
// 開發模式下的即時 Markdown 重載
const useLiveMarkdown = (filePath: string) => {
  // 檔案變更監聽
  // 自動重新解析
  // 熱重載支援
}
```

### TypeScript 型別定義
```typescript
interface Topic {
  date: string
  title: string
  description: string
  slides: Slide[]
  tags: string[]
  redditUrl?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface Slide {
  id: string
  content: string
  type: 'title' | 'content' | 'exercise' | 'summary'
  interactiveWords: InteractiveWord[]
}
```

## 📈 漸進式遷移策略

### 階段 1: 基礎架構
- [x] 建立 Next.js 專案結構
- [ ] 實作基本投影片檢視器
- [ ] 整合現有 Markdown 內容

### 階段 2: 功能增強
- [ ] 實作互動單字功能
- [ ] 加入學習進度追蹤
- [ ] 優化行動裝置體驗

### 階段 3: 進階功能
- [ ] 個人化學習路徑
- [ ] 社群功能整合
- [ ] 學習分析儀表板

## 🚀 部署策略

### GitHub Pages 相容性
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/daily-english-topic' : ''
}
```

### 建置流程
```yaml
# .github/workflows/deploy-nextjs.yml
- name: Build Next.js app
  run: |
    cd daily-english-nextjs
    npm run build
    npm run export
    
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./daily-english-nextjs/out
```

## 💡 預期優勢

### 開發體驗
- ✅ TypeScript 型別安全
- ✅ 熱重載開發
- ✅ 元件化架構
- ✅ 更好的除錯工具

### 使用者體驗
- ✅ 更快的頁面載入
- ✅ 更流暢的互動
- ✅ 更好的 SEO
- ✅ 離線功能支援

### 維護性
- ✅ 模組化程式碼
- ✅ 更容易測試
- ✅ 更容易擴展功能
- ✅ 更好的程式碼重用

這個架構將讓我們保留現有的投影片學習體驗，同時享受現代框架帶來的所有優勢！