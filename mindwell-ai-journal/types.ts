
export type Mood = 'Joyful' | 'Calm' | 'Sad' | 'Anxious' | 'Angry' | 'Neutral';

export type SelfCareSuggestion = 'Meditation' | 'Music' | 'Affirmation' | 'Breathing Exercise' | 'Quick Story' | '5-4-3-2-1 Grounding' | 'Mindful Doodling';

export interface JournalEntry {
  id: string;
  userContent: string;
  aiResponse: string;
  suggestions: SelfCareSuggestion[];
  mood: Mood;
  timestamp: string;
  reframe?: string;
  activityTags: string[];
}

export interface GeminiAnalysis {
    emotion: Mood;
    response: string;
    suggestions: SelfCareSuggestion[];
    reframe?: string;
    extractedKeywords?: string[];
}

export interface InsightsSummary {
    topTriggers: string[];
    moodPatterns: {
        mood: Mood;
        pattern: string;
    }[];
    positiveHighlight: string;
    actionableSuggestion: string;
}

export interface Goal {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface DailyQuote {
  quote: string;
  author: string;
}

export type AchievementId = 
  | 'first-spark'
  | 'mindful-week'
  | 'goal-setter'
  | 'goal-crusher'
  | 'deep-diver'
  | 'reframer'
  | 'creative-outlet';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  unlockedAt: string | null;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}