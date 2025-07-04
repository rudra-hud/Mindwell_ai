
import { Mood, Achievement } from './types';
import { Award, BrushIcon, CalendarDays, CheckCircle2, LightbulbIcon, Sparkle, TargetIcon } from './components/Icons';


export const MOOD_COLORS: Record<Mood, { light: string; dark: string }> = {
  Joyful: { light: '#34D399', dark: '#10B981' }, // Emerald-400, Emerald-500
  Calm: { light: '#60A5FA', dark: '#3B82F6' }, // Blue-400, Blue-500
  Sad: { light: '#A5B4FC', dark: '#818CF8' }, // Indigo-300, Indigo-400
  Anxious: { light: '#FBBF24', dark: '#F59E0B' }, // Amber-400, Amber-500
  Angry: { light: '#F87171', dark: '#EF4444' }, // Red-400, Red-500
  Neutral: { light: '#9CA3AF', dark: '#6B7280' }, // Gray-400, Gray-500
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  Joyful: '😊',
  Calm: '😌',
  Sad: '😔',
  Anxious: '😟',
  Angry: '😠',
  Neutral: '😐',
};

export const TRIGGER_PHRASES: string[] = [
    "i want to die",
    "kill myself",
    "i can't go on",
    "giving up",
    "end it all",
    "no reason to live",
    "suicidal",
    "feeling hopeless",
];

export const ACHIEVEMENTS_LIST: Omit<Achievement, 'unlockedAt'>[] = [
    {
        id: 'first-spark',
        title: 'First Spark',
        description: 'You\'ve started your journey by writing your first journal entry.',
        icon: Sparkle,
    },
    {
        id: 'mindful-week',
        title: 'Mindful Week',
        description: 'You\'ve journaled on 7 different days. Consistency is key!',
        icon: CalendarDays,
    },
    {
        id: 'goal-setter',
        title: 'Goal Setter',
        description: 'You set your very first goal. The journey of a thousand miles begins with a single step.',
        icon: TargetIcon,
    },
    {
        id: 'goal-crusher',
        title: 'Goal Crusher',
        description: 'You\'ve completed 5 goals! Look at you making positive changes.',
        icon: CheckCircle2,
    },
     {
        id: 'reframer',
        title: 'The Reframer',
        description: 'You received your first cognitive reframe, turning a negative thought into a learning moment.',
        icon: LightbulbIcon,
    },
    {
        id: 'deep-diver',
        title: 'Deep Diver',
        description: 'You generated your first weekly insights report. Knowledge is power!',
        icon: LightbulbIcon,
    },
    {
        id: 'creative-outlet',
        title: 'Creative Outlet',
        description: 'You tried the Mindful Doodling tool for the first time. Let your thoughts flow!',
        icon: BrushIcon,
    },
];

export const getAnalysisPrompt = (userInput: string): string => `
System Instruction: You are MindWell, an empathetic AI companion. Your role is to listen to the user's journal entries without judgment, provide a warm, supportive response, and identify the primary emotion. Never be overly positive or dismissive. Your tone should be calm and understanding.

User's entry: "${userInput}"

Your task:
1. Analyze the entry to understand the user's feelings.
2. Identify the dominant emotion from this list: 'Joyful', 'Calm', 'Sad', 'Anxious', 'Angry'. If none fit well, use 'Neutral'.
3. Write a short, empathetic response (2-3 sentences).
4. **Cognitive Reframe (Optional but important):** If you detect clear negative self-talk (e.g., "I'm a failure," "I'm worthless," "I always mess up"), provide a short, gentle, and constructive reframe.
5. Suggest 3 relevant self-care activities from this list: 'Meditation', 'Music', 'Affirmation', 'Breathing Exercise', 'Quick Story', '5-4-3-2-1 Grounding', 'Mindful Doodling'. Prioritize '5-4-3-2-1 Grounding' or 'Breathing Exercise' if anxiety is detected.
6. **Extract Keywords:** Identify up to 3 single-word keywords representing the main activities or topics in the entry (e.g., 'work', 'exercise', 'family', 'sleep').
7. Return a single, valid JSON object with no markdown formatting. The JSON object must have these exact keys: "emotion" (string), "response" (string), "suggestions" (an array of 3 strings), and "extractedKeywords" (an array of 0-3 strings). If you created a reframe, also include the key "reframe" (string).

Example output for "I'm such a failure, I messed up the presentation at work today":
{
  "emotion": "Sad",
  "response": "It sounds incredibly frustrating when things don't go as planned, especially after you've put in the effort. It's okay to feel disappointed with an outcome.",
  "reframe": "Making a mistake doesn't make you a failure; it makes you human and offers a chance to learn.",
  "suggestions": ["Affirmation", "Music", "Quick Story"],
  "extractedKeywords": ["work", "presentation"]
}

Example output for "I feel so overwhelmed with my project and family stuff":
{
  "emotion": "Anxious",
  "response": "It sounds like you're carrying a heavy weight right now. Feeling overwhelmed is completely understandable when there's so much on your plate. Remember to be kind to yourself.",
  "suggestions": ["Breathing Exercise", "5-4-3-2-1 Grounding", "Music"],
  "extractedKeywords": ["project", "family"]
}
`;

export const getInsightsPrompt = (entriesString: string): string => `
System Instruction: You are MindWell, an insightful and empathetic AI companion. Your task is to analyze a week of journal entries and create a gentle, encouraging, and insightful dashboard summary. Focus on identifying patterns and providing constructive feedback.

User's weekly entries:
${entriesString}

Your task:
1.  **Analyze Triggers:** Read all entries and identify the top 2-3 recurring keywords or themes that seem to trigger specific emotions (e.g., "work," "exams," "sleep," "relationships"). These should be concise.
2.  **Identify Patterns:** Find 2-3 deeper behavioral or emotional patterns. This is more than just a keyword; it's an observation. For each pattern, associate it with the relevant mood from this list: 'Joyful', 'Calm', 'Sad', 'Anxious', 'Angry', 'Neutral'.
3.  **Find a Positive Highlight:** Pick one specific positive moment or accomplishment mentioned by the user this week and quote or paraphrase it.
4.  **Create an Actionable Suggestion:** Based on the patterns, provide one simple, concrete, and actionable suggestion for the user for the upcoming week. It should be encouraging and easy to implement.
5.  **Return a single, valid JSON object** with no markdown formatting. The JSON object must adhere to this exact structure:
    {
      "topTriggers": ["string", ...],
      "moodPatterns": [
        { "mood": "Anxious", "pattern": "You seem to feel more anxious on days you mention upcoming deadlines." },
        { "mood": "Calm", "pattern": "Writing about your walks in the park often brings a sense of peace." }
      ],
      "positiveHighlight": "string",
      "actionableSuggestion": "string"
    }

Example Input (abbreviated):
"Mon: Stressed about work deadline. Felt anxious. Tue: Had a nice walk in the park, felt calm. Thu: The work project is still overwhelming. Anxious again."

Example Output:
{
  "topTriggers": ["work", "deadlines", "park"],
  "moodPatterns": [
    { "mood": "Anxious", "pattern": "There's a clear connection between discussions of work deadlines and feelings of anxiety." },
    { "mood": "Calm", "pattern": "Taking time for a walk appears to be an effective way for you to find calmness." }
  ],
  "positiveHighlight": "That moment of peace you found during your walk in the park on Tuesday sounds truly restorative.",
  "actionableSuggestion": "Could you try scheduling a short, 10-minute walk during your lunch break on challenging work days? It might help create a small buffer against stress."
}
`;

export const getGoalRefinementPrompt = (userInput: string): string => `
System Instruction: You are an encouraging coach. Your task is to take a user's vague goal and refine it into a single, actionable, and specific S.M.A.R.T. (Specific, Measurable, Achievable, Relevant, Time-bound) goal. The refined goal should be a positive, concrete action.

User's goal: "${userInput}"

Your task:
1. Analyze the user's intention.
2. Rewrite it as a clear, single-sentence SMART goal.
3. Keep it concise and encouraging.
4. Return a single, valid JSON object with no markdown formatting. The JSON object must have this exact key: "refinedGoal" (string).

Example 1:
User's goal: "I want to be less stressed"
Your output:
{
  "refinedGoal": "Practice a 5-minute guided meditation three times this week to manage stress."
}

Example 2:
User's goal: "be happier"
Your output:
{
  "refinedGoal": "Write down one thing I'm grateful for each day before bed."
}
`;

export const getDailyQuotePrompt = (): string => `
System Instruction: You are a curator of wisdom. Your task is to provide a single, short, and inspiring quote related to mindfulness, self-reflection, or mental well-being.

Your task:
1.  Select or generate a quote that is encouraging and not cliché.
2.  Identify the author. If the author is unknown, use "Anonymous".
3.  Return a single, valid JSON object with no markdown formatting. The JSON object must have these exact keys: "quote" (string) and "author" (string).

Example output:
{
  "quote": "The best way out is always through.",
  "author": "Robert Frost"
}
`;