// Simple i18n system for word lookup features
export const languages = {
  'zh-TW': '繁體中文',
  'zh-CN': '简体中文',
  'ja': '日本語',
  'ko': '한국어',
  'en': 'English'
} as const

export type SupportedLanguage = keyof typeof languages

export const translations = {
  'zh-TW': {
    // UI labels
    dragToMove: '拖拽移動',
    loading: '正在查詢...',
    notFound: '找不到定義',
    checkSpelling: '請檢查拼寫或嘗試其他單字',
    viewMore: '查看更多定義',
    quickTranslate: '快速翻譯',
    deepExplain: '深度解釋',
    addToNotes: '加入筆記',
    close: '關閉',
    
    // Status messages
    translating: '正在翻譯...',
    explaining: '正在生成深度解釋...',
    error: '發生錯誤，請稍後再試',
    
    // Deep learning drawer
    deepLearningAssistant: '深度學習助手',
    retry: '重新生成解釋',
    openInNewWindow: '在新視窗開啟',
    noContent: '沒有內容可顯示',
    failedToLoad: '載入失敗，請重試',
    
    // Shortcuts
    shortcuts: '快捷鍵',
    escToClose: 'ESC 關閉',
    tabToSwitch: '⌘Tab 切換分頁'
  },
  'zh-CN': {
    dragToMove: '拖拽移动',
    loading: '正在查询...',
    notFound: '找不到定义',
    checkSpelling: '请检查拼写或尝试其他单词',
    viewMore: '查看更多定义',
    quickTranslate: '快速翻译',
    deepExplain: '深度解释',
    addToNotes: '加入笔记',
    close: '关闭',
    translating: '正在翻译...',
    explaining: '正在生成深度解释...',
    error: '发生错误，请稍后再试',
    deepLearningAssistant: '深度学习助手',
    retry: '重新生成解释',
    openInNewWindow: '在新窗口打开',
    noContent: '没有内容可显示',
    failedToLoad: '加载失败，请重试',
    shortcuts: '快捷键',
    escToClose: 'ESC 关闭',
    tabToSwitch: '⌘Tab 切换标签'
  },
  'ja': {
    dragToMove: 'ドラッグして移動',
    loading: '検索中...',
    notFound: '定義が見つかりません',
    checkSpelling: 'スペルを確認するか、他の単語を試してください',
    viewMore: '他の定義を見る',
    quickTranslate: 'クイック翻訳',
    deepExplain: '詳細説明',
    addToNotes: 'ノートに追加',
    close: '閉じる',
    translating: '翻訳中...',
    explaining: '詳細説明を生成中...',
    error: 'エラーが発生しました。後でもう一度お試しください',
    deepLearningAssistant: 'ディープラーニングアシスタント',
    retry: '説明を再生成',
    openInNewWindow: '新しいウィンドウで開く',
    noContent: '表示するコンテンツがありません',
    failedToLoad: '読み込みに失敗しました。再試行してください',
    shortcuts: 'ショートカット',
    escToClose: 'ESC 閉じる',
    tabToSwitch: '⌘Tab タブ切替'
  },
  'ko': {
    dragToMove: '드래그하여 이동',
    loading: '검색 중...',
    notFound: '정의를 찾을 수 없습니다',
    checkSpelling: '철자를 확인하거나 다른 단어를 시도하세요',
    viewMore: '더 많은 정의 보기',
    quickTranslate: '빠른 번역',
    deepExplain: '심층 설명',
    addToNotes: '노트에 추가',
    close: '닫기',
    translating: '번역 중...',
    explaining: '심층 설명 생성 중...',
    error: '오류가 발생했습니다. 나중에 다시 시도하세요',
    deepLearningAssistant: '딥러닝 어시스턴트',
    retry: '설명 재생성',
    openInNewWindow: '새 창에서 열기',
    noContent: '표시할 콘텐츠가 없습니다',
    failedToLoad: '로드 실패, 다시 시도하세요',
    shortcuts: '단축키',
    escToClose: 'ESC 닫기',
    tabToSwitch: '⌘Tab 탭 전환'
  },
  'en': {
    dragToMove: 'Drag to move',
    loading: 'Loading...',
    notFound: 'Definition not found',
    checkSpelling: 'Check spelling or try another word',
    viewMore: 'View more definitions',
    quickTranslate: 'Quick Translate',
    deepExplain: 'Deep Explain',
    addToNotes: 'Add to Notes',
    close: 'Close',
    translating: 'Translating...',
    explaining: 'Generating deep explanation...',
    error: 'An error occurred. Please try again later',
    deepLearningAssistant: 'Deep Learning Assistant',
    retry: 'Regenerate explanation',
    openInNewWindow: 'Open in new window',
    noContent: 'No content to display',
    failedToLoad: 'Failed to load. Please retry',
    shortcuts: 'Shortcuts',
    escToClose: 'ESC to close',
    tabToSwitch: '⌘Tab to switch tabs'
  }
}

export function getTranslation(
  language: SupportedLanguage,
  key: keyof typeof translations['zh-TW']
): string {
  return translations[language]?.[key] || translations['zh-TW'][key] || key
}

// Hook for components
import { useWordLookup } from '@/contexts/WordLookupContext'

export function useTranslation() {
  const { userLanguage } = useWordLookup()
  const lang = userLanguage as SupportedLanguage
  
  return {
    t: (key: keyof typeof translations['zh-TW']) => getTranslation(lang, key),
    language: lang,
    languageName: languages[lang]
  }
}