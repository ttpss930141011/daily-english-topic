export interface Dictionary {
  common: {
    loading: string
    error: string
    retry: string
    cancel: string
    confirm: string
    close: string
    save: string
    delete: string
    edit: string
    search: string
    clear: string
    back: string
    next: string
    previous: string
    submit: string
    success: string
    warning: string
    info: string
    language: string
    changeLanguage: string
    selectLanguage: string
    settings: string
    profile: string
    signIn: string
    signOut: string
    comingSoon: string
    darkMode: string
    notifications: string
    learningPreferences: string
  }
  homepage: {
    hero: {
      title: string
      subtitle: string
      description: string
    }
    stats: {
      realConversations: string
      freshContent: string
      interactiveLearning: string
    }
    filters: {
      all: string
      difficulty: string
      category: string
      tags: string
    }
    search: {
      placeholder: string
      noResults: string
      tryDifferent: string
    }
    topicCard: {
      slides: string
      readMore: string
    }
  }
  wordLookup: {
    loading: string
    notFound: string
    checkSpelling: string
    viewMore: string
    close: string
    playAudio: string
    deepExplanation: string
    examples: string
    synonyms: string
    antonyms: string
    etymology: string
    relatedWords: string
  }
}