export interface Topic {
  slug: string;
  title: string;
  date: string;
  category: string;
  redditUrl: string;
  content: string;
  frontmatter: {
    [key: string]: unknown;
  };
}

export interface LearningPoint {
  title: string;
  items: string[];
}

export interface TopicContent {
  summary: string;
  learningPoints: LearningPoint[];
  vocabulary: VocabularyEntry[];
  practiceQuestions: string[];
}

export interface VocabularyEntry {
  word: string;
  definition: string;
  example?: string;
}

export type Category = 
  | 'DISCUSSION'
  | 'LANGUAGE' 
  | 'LIFESTYLE'
  | 'ETHICS'
  | 'CAREER'
  | 'GENERAL';