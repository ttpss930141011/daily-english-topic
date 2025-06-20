import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  'zh-TW': {
    common: {
      "loading": "正在載入...",
      "error": "發生錯誤",
      "retry": "重試",
      "cancel": "取消",
      "confirm": "確認",
      "close": "關閉",
      "save": "儲存",
      "delete": "刪除",
      "edit": "編輯",
      "search": "搜尋",
      "clear": "清除",
      "back": "返回",
      "next": "下一步",
      "previous": "上一步",
      "submit": "提交",
      "success": "成功",
      "warning": "警告",
      "info": "資訊"
    },
    'word-lookup': {
      "dragToMove": "拖拽移動",
      "loading": "正在查詢...",
      "notFound": "找不到定義",
      "checkSpelling": "請檢查拼寫或嘗試其他單字",
      "viewMore": "查看更多定義",
      "quickTranslation": "快速翻譯",
      "detailedExplanation": "詳細解釋",
      "pronunciation": "發音",
      "playAudio": "播放音頻"
    }
  },
  'en': {
    common: {
      "loading": "Loading...",
      "error": "Error occurred",
      "retry": "Retry",
      "cancel": "Cancel",
      "confirm": "Confirm",
      "close": "Close",
      "save": "Save",
      "delete": "Delete",
      "edit": "Edit",
      "search": "Search",
      "clear": "Clear",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "submit": "Submit",
      "success": "Success",
      "warning": "Warning",
      "info": "Information"
    },
    'word-lookup': {
      "dragToMove": "Drag to move",
      "loading": "Looking up...",
      "notFound": "Definition not found",
      "checkSpelling": "Please check spelling or try another word",
      "viewMore": "View more definitions",
      "quickTranslation": "Quick Translation",
      "detailedExplanation": "Detailed Explanation",
      "pronunciation": "Pronunciation",
      "playAudio": "Play Audio"
    }
  }
}

// 初始化 i18n
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'zh-TW',
      defaultNS: 'common',
      ns: ['common', 'word-lookup'],
      
      debug: false, // 關閉 debug 避免控制台噪音
      
      interpolation: {
        escapeValue: false,
      },
      
      react: {
        useSuspense: false,
      },
    })
}

export default i18n