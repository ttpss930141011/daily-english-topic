# 翻譯服務策略建議

## 混合翻譯策略

### 快速翻譯 (Quick Translation)
**使用 Google Translate API**
- 用途：即時翻譯、快速查詢
- 優勢：速度快、準確度高
- 適用：單詞、短句翻譯

### 深度學習翻譯 (Educational Translation)  
**使用 Gemini AI**
- 用途：學習解釋、文化背景、替代翻譯
- 優勢：上下文理解、教育價值
- 適用：詳細解釋、學習資料

## 實作方案

```typescript
// 快速翻譯 - Google Translate
async function quickTranslate(text: string, target: string) {
  return await googleTranslateAPI(text, target)
}

// 學習翻譯 - Gemini
async function educationalTranslate(text: string, target: string) {
  return await geminiTranslateWithContext(text, target)
}
```

## 成本比較

| 服務 | 價格 | 用途 | 建議用量 |
|------|------|------|----------|
| Google Translate | $20/1M字符 | 快速翻譯 | 80% |
| Gemini | $0.125/1K tokens | 深度解釋 | 20% |

## 使用場景分配

- **快速查詢彈窗** → Google Translate
- **深度解釋面板** → Gemini  
- **批量內容翻譯** → Google Translate
- **學習材料生成** → Gemini