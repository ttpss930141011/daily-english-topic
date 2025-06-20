# 🔍 Interactive Word Lookup Feature Design Document

## 📋 Overview

**Feature Name**: Interactive Word Lookup & Deep Learning Assistant  
**Target Users**: English language learners using the Daily English Topics platform  
**Primary Goal**: Enhance learning experience with contextual, progressive vocabulary assistance

## 🎯 User Stories & Use Cases

### Primary User Stories

1. **As a language learner**, I want to quickly understand unknown words without leaving the slide, so I can maintain reading flow
2. **As a curious learner**, I want deep explanations of phrases/sentences to understand cultural context and usage patterns
3. **As a multi-tasking learner**, I want to compare multiple explanations in tabs, so I can cross-reference learning materials
4. **As a global user**, I want explanations in my preferred language, so I can learn more effectively

### Use Cases

#### UC1: Quick Word Lookup
- **Trigger**: User double-clicks on a single word
- **Action**: Small popup appears with basic definition + pronunciation
- **APIs**: Dictionary API + Text-to-Speech
- **Success Criteria**: Response time < 500ms, clear pronunciation

#### UC2: Phrase/Sentence Deep Analysis  
- **Trigger**: User drags to select text (1+ words)
- **Action**: Context menu appears with options
- **Options**: [Quick Translation | Deep Explanation]
- **Success Criteria**: Intelligent text selection, clear menu

#### UC3: Deep Learning Assistant
- **Trigger**: User selects "Deep Explanation" from context menu
- **Action**: Split-screen drawer opens with AI-powered analysis
- **Features**: Streaming response, tabbed interface, cultural context
- **Success Criteria**: Non-intrusive UI, rich educational content

## 🏗️ Technical Architecture

### Component Structure
```
SlideViewer/
├── WordLookupProvider (Context)
├── TextSelectionHandler (Hook)
├── QuickLookupPopup (Component)
├── ContextMenu (Component)
├── DeepLearningDrawer (Component)
│   ├── TabManager (Component)
│   ├── StreamingResponse (Component)
│   └── LanguageSettings (Component)
└── SettingsPanel (Component)
```

### State Management
```typescript
interface WordLookupState {
  selectedText: string
  selectionPosition: { x: number, y: number }
  lookupMode: 'quick' | 'deep' | null
  drawerTabs: DeepLearningTab[]
  userLanguage: string
  isLoading: boolean
}

interface DeepLearningTab {
  id: string
  title: string
  content: string
  isLoading: boolean
  timestamp: Date
}
```

### API Architecture

#### 1. Quick Dictionary API
- **Endpoint**: `/api/dictionary`
- **Provider**: Free Dictionary API / WordsAPI
- **Response Time**: Target < 300ms
- **Fallback**: Local word list for common words

#### 2. Translation API  
- **Endpoint**: `/api/translate`
- **Provider**: Google Gemini 1.5-flash
- **Features**: Quick translation with context

#### 3. Deep Learning API
- **Endpoint**: `/api/deep-explain`
- **Provider**: Google Gemini 1.5-flash with streaming
- **Features**: Cultural context, usage patterns, examples

## 🎨 UI/UX Design Specifications

### Design Principles
1. **Non-Intrusive**: Never block the original content
2. **Progressive**: Start simple, offer advanced features
3. **Responsive**: Work on all device sizes  
4. **Accessible**: Support keyboard navigation and screen readers
5. **Performant**: Fast responses, smooth animations

### Visual Design

#### Quick Lookup Popup
```
┌─────────────────────────┐
│ 🔊 [word] /prəˈnʌnsi/  │
│ ─────────────────────── │
│ (noun) 中文翻譯         │
│ ─────────────────────── │
│ "Example sentence..."   │
└─────────────────────────┘
```

#### Context Menu (Notion-style)
```
┌──────────────────┐
│ 🌐 Quick Translate │
│ 🧠 Deep Explain    │
│ 📖 Add to Notes    │
└──────────────────┘
```

#### Deep Learning Drawer (VSCode-style)
```
┌─── Main Content ────┐ │ ┌─── Learning Assistant ───┐
│                     │ │ │ Tab1│Tab2│Tab3│    [×]   │
│   [Slide Content]   │ │ │ ───────────────────────── │
│                     │ │ │                         │
│                     │ │ │ 🤖 Streaming Analysis... │
│                     │ │ │                         │
└─────────────────────┘ │ └─────────────────────────┘
```

### Responsive Breakpoints
- **Mobile (< 768px)**: Drawer becomes full-screen modal
- **Tablet (768px - 1024px)**: Drawer takes 40% width
- **Desktop (> 1024px)**: Drawer takes 30% width, side-by-side

### Animation & Micro-interactions
- **Popup**: Fade-in with scale (200ms)
- **Context Menu**: Slide-up animation (150ms)  
- **Drawer**: Slide-in from right (300ms)
- **Streaming Text**: Typewriter effect
- **Tab Switching**: Smooth transition (200ms)

## 🔌 API Design

### 1. Dictionary API

#### Endpoint: `POST /api/dictionary`
```typescript
interface DictionaryRequest {
  word: string
  userLanguage: string
}

interface DictionaryResponse {
  word: string
  phonetic: string
  audioUrl?: string
  definitions: Array<{
    partOfSpeech: string
    definition: string
    translation: string
    example?: string
  }>
}
```

### 2. Translation API

#### Endpoint: `POST /api/translate`  
```typescript
interface TranslateRequest {
  text: string
  sourceLanguage: 'en'
  targetLanguage: string
  context?: string // surrounding sentence for better translation
}

interface TranslateResponse {
  originalText: string
  translation: string
  confidence: number
  alternatives?: string[]
}
```

### 3. Deep Explanation API (Streaming)

#### Endpoint: `POST /api/deep-explain`
```typescript
interface DeepExplainRequest {
  text: string
  userLanguage: string
  context: string // surrounding paragraph
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// Streaming Response
interface DeepExplainChunk {
  type: 'title' | 'explanation' | 'example' | 'cultural' | 'complete'
  content: string
  metadata?: Record<string, any>
}
```

### Gemini Prompt Design

#### For Quick Translation:
```
As an English teacher, provide a quick translation for: "${text}"

User's language: ${userLanguage}
Context: "${context}"

Respond in ${userLanguage} with:
1. Direct translation
2. Brief context note if needed

Keep it concise (max 2 sentences).
```

#### For Deep Explanation:
```
As an experienced English teacher, provide a comprehensive explanation for: "${text}"

User's language: ${userLanguage}
User's level: ${difficulty}
Context: "${context}"

Please provide (in ${userLanguage}):
1. **Literal Translation**: Direct meaning
2. **Usage Explanation**: When and how to use this
3. **Examples**: 2-3 natural examples in different contexts
4. **Cultural Context**: Any cultural background needed
5. **Grammar Notes**: Relevant grammar patterns
6. **Related Expressions**: Similar phrases/synonyms

Make it educational but engaging, like a friendly teacher explaining to a curious student.
```

## 🌍 Internationalization Strategy

### Supported Languages (Phase 1)
- **English** (en): For advanced learners
- **Traditional Chinese** (zh-TW): Primary target market
- **Simplified Chinese** (zh-CN): Mainland China users
- **Japanese** (ja): Secondary market
- **Korean** (ko): Secondary market

### Language Settings
- **Global Setting**: User can set preferred explanation language
- **Per-Request Override**: Advanced users can request specific language
- **Auto-Detection**: Detect user's browser language as default
- **Fallback**: English if requested language not supported

### Implementation
```typescript
interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  rtl: boolean
  enabled: boolean
}

const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, enabled: true },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', rtl: false, enabled: true },
  { code: 'zh-CN', name: 'Simplified Chinese', nativeName: '简体中文', rtl: false, enabled: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, enabled: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, enabled: true }
]
```

## ⚡ Performance Considerations

### API Response Optimization
- **Dictionary Cache**: Cache common words locally (IndexedDB)
- **Request Debouncing**: 300ms delay for text selection
- **Streaming**: Use streaming for deep explanations
- **Fallback Strategy**: Local definitions for network issues

### Bundle Size Management
- **Lazy Loading**: Load word lookup components only when needed
- **Code Splitting**: Separate chunks for different languages
- **Tree Shaking**: Import only used dictionary functions

### User Experience
- **Skeleton Loading**: Show loading states immediately
- **Error Boundaries**: Graceful error handling
- **Offline Support**: Basic word definitions work offline

## 🧪 Testing Strategy

### Unit Tests
- Text selection detection
- API request/response handling
- Language switching logic
- Component rendering

### Integration Tests  
- End-to-end word lookup flow
- Multiple tab management
- API error handling
- Language preference persistence

### User Testing
- **Usability Testing**: Can users discover and use features intuitively?
- **Performance Testing**: Response times under various network conditions
- **Accessibility Testing**: Screen reader compatibility, keyboard navigation
- **Cross-browser Testing**: Ensure consistent experience

## 📱 Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Text selection detection system
- [ ] Basic popup component
- [ ] Dictionary API integration
- [ ] Simple language settings

### Phase 2: Context Menu (Week 2)  
- [ ] Drag selection detection
- [ ] Context menu component
- [ ] Quick translation feature
- [ ] Settings panel UI

### Phase 3: Deep Learning Assistant (Week 3)
- [ ] Split-screen drawer component
- [ ] Gemini API integration
- [ ] Streaming response handling
- [ ] Tab management system

### Phase 4: Polish & Performance (Week 4)
- [ ] Responsive design refinement
- [ ] Performance optimization
- [ ] Error handling & edge cases
- [ ] Accessibility improvements

### Phase 5: Advanced Features (Week 5)
- [ ] Advanced language options
- [ ] User preferences persistence
- [ ] Analytics integration
- [ ] User feedback system

## 🎯 Success Metrics

### Quantitative Metrics
- **Adoption Rate**: % of users who try the feature
- **Engagement**: Average lookups per session
- **Performance**: API response time < 500ms for 95% of requests
- **Error Rate**: < 2% API failure rate

### Qualitative Metrics
- **User Satisfaction**: Positive feedback about learning enhancement
- **Learning Effectiveness**: Users report better vocabulary retention
- **UI Intuitiveness**: Users can discover features without instruction

## 🔒 Privacy & Security

### Data Handling
- **No Storage**: Don't store user's looked-up words without consent
- **Anonymization**: Remove personal identifiers from API requests
- **Rate Limiting**: Prevent API abuse
- **Error Logging**: Log errors without exposing user data

### API Security
- **Environment Variables**: Store API keys securely
- **Request Validation**: Validate all inputs
- **CORS Configuration**: Restrict API access to domain
- **Error Messages**: Don't expose internal system details

## 🚀 Future Enhancements

### Advanced Learning Features
- **Personal Vocabulary**: Save and review looked-up words
- **Spaced Repetition**: Intelligent review scheduling
- **Learning Analytics**: Track learning progress
- **Social Learning**: Share interesting findings

### AI Enhancements
- **Personalized Explanations**: Adapt to user's learning level
- **Contextual Recommendations**: Suggest related words/phrases
- **Grammar Analysis**: Deep grammar pattern recognition
- **Pronunciation Coaching**: AI-powered pronunciation feedback

## 📚 Technical Dependencies

### New Dependencies
```json
{
  "@google/generative-ai": "^0.1.3",
  "react-split-pane": "^0.1.92", 
  "use-debounce": "^9.0.4",
  "react-intersection-observer": "^9.5.3"
}
```

### API Requirements
- **Google Gemini API**: For deep explanations
- **Free Dictionary API**: For quick lookups  
- **Web Speech API**: For pronunciation (browser built-in)

---

## 🎨 Design System Integration

### Colors (matching existing theme)
```scss
--lookup-popup-bg: rgba(255, 255, 255, 0.95);
--lookup-border: rgba(147, 51, 234, 0.3);
--lookup-accent: #8b5cf6;
--lookup-text: #1f2937;
--lookup-shadow: rgba(0, 0, 0, 0.1);
```

### Typography
- **Popup Text**: `text-sm` (14px)
- **Drawer Content**: `text-base` (16px)  
- **Phonetic**: `font-mono text-xs`

### Spacing
- **Popup Padding**: `p-3`
- **Drawer Padding**: `p-6`
- **Element Spacing**: `space-y-3`

---

**Next Steps**: 
1. Review and approve this design document
2. Create initial component structure
3. Implement Phase 1 features
4. Test with MCP for UI/UX validation
5. Iterate based on feedback

This feature will transform the learning experience from passive reading to active, intelligent vocabulary acquisition! 🚀