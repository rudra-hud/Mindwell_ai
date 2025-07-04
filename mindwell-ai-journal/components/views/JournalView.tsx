
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useJournal } from '../../context/JournalContext';
import { useGoals } from '../../context/GoalsContext';
import { getEmotionalAnalysis, getDailyQuote } from '../../services/geminiService.ts';
import { JournalEntry, SelfCareSuggestion, DailyQuote } from '../../types';
import { SendHorizonalIcon, BotIcon, UserIcon, MicrophoneIcon, SearchIcon, XIcon, LightbulbIcon, TagIcon, TargetIcon, QuoteIcon } from '../Icons';
import SelfCareModal from '../SelfCareModal';
import { TRIGGER_PHRASES } from '../../constants';
import EmotionAvatar from '../EmotionAvatar';

// Minimal interface for the Web Speech API's SpeechRecognition
// to fix TypeScript error in environments where it's not predefined.
interface CustomSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
}

interface JournalViewProps {
  activateDistractionMode: () => void;
}

const JournalView: React.FC<JournalViewProps> = ({ activateDistractionMode }) => {
  const { state, addEntry } = useJournal();
  const { state: goalsState } = useGoals();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<SelfCareSuggestion | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(true);
  const recognitionRef = useRef<CustomSpeechRecognition | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const todaysFocus = useMemo(() => {
    return goalsState.goals.find(g => !g.isCompleted) || null;
  }, [goalsState.goals]);
  
  // Effect for fetching the daily quote
  useEffect(() => {
    const fetchQuote = async () => {
      const today = new Date().toDateString();
      try {
        const storedQuoteData = localStorage.getItem('mindwell-daily-quote');
        if (storedQuoteData) {
          const { date, quote } = JSON.parse(storedQuoteData);
          if (date === today) {
            setDailyQuote(quote);
            setIsQuoteLoading(false);
            return;
          }
        }

        const quote = await getDailyQuote();
        if (quote) {
          setDailyQuote(quote);
          localStorage.setItem('mindwell-daily-quote', JSON.stringify({ date: today, quote }));
        }
      } catch (err) {
        console.error("Could not fetch or parse daily quote", err);
      } finally {
        setIsQuoteLoading(false);
      }
    };
    fetchQuote();
  }, []);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return state.entries;
    return state.entries.filter(entry =>
      entry.userContent.toLowerCase().includes(query) ||
      entry.aiResponse.toLowerCase().includes(query) ||
      entry.activityTags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [state.entries, searchQuery]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setMicSupported(true);
      const recognition: CustomSpeechRecognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserInput(prev => prev.trim() ? `${prev.trim()} ${finalTranscript}` : finalTranscript);
        }
      };

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;

      return () => {
        recognitionRef.current?.stop();
      };
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) { // Only scroll to bottom for new messages, not when filtering
        scrollToBottom();
    }
  }, [filteredEntries, searchQuery, isLoading]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;
    
    // Check for trigger phrases
    const hasTrigger = TRIGGER_PHRASES.some(phrase => trimmedInput.toLowerCase().includes(phrase));
    if (hasTrigger) {
        activateDistractionMode();
        // Don't clear input or proceed, let the user decide after the distraction.
        return; 
    }

    setIsLoading(true);
    setError(null);
    if (isRecording) {
      recognitionRef.current?.stop();
    }
    setSearchQuery(''); // Clear search on new entry

    const analysis = await getEmotionalAnalysis(trimmedInput);

    if (analysis) {
      const allTags = [...new Set([...currentTags, ...(analysis.extractedKeywords || [])])].map(t => t.toLowerCase());
      const newEntry: JournalEntry = {
        id: new Date().toISOString(),
        userContent: trimmedInput,
        aiResponse: analysis.response,
        mood: analysis.emotion,
        suggestions: analysis.suggestions,
        timestamp: new Date().toISOString(),
        reframe: analysis.reframe,
        activityTags: allTags,
      };
      addEntry(newEntry);
    } else {
      setError("I'm having trouble reflecting right now. Please try again later.");
    }

    setUserInput('');
    setCurrentTags([]);
    setTagInput('');
    setIsLoading(false);
  },[userInput, isLoading, addEntry, isRecording, activateDistractionMode, currentTags]);

  const handleSuggestionClick = (suggestion: SelfCareSuggestion) => {
      setModalContent(suggestion);
  };

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const newTag = tagInput.trim().toLowerCase();
          if (newTag && !currentTags.includes(newTag)) {
              setCurrentTags([...currentTags, newTag]);
          }
          setTagInput('');
      }
  };

  const removeTag = (tagToRemove: string) => {
      setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
       {!searchQuery && (
        <div className="space-y-3">
          {isQuoteLoading ? (
             <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-lg flex items-center gap-3 animate-pulse">
                <div className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-3/4 bg-slate-300 dark:bg-slate-700 rounded"></div>
                  <div className="h-2 w-1/4 bg-slate-300 dark:bg-slate-700 rounded"></div>
                </div>
             </div>
          ) : dailyQuote && (
              <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/60 p-3 rounded-lg flex items-start gap-3 animate-fade-in">
                  <QuoteIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                      <blockquote className="text-sm italic text-slate-700 dark:text-slate-300">"{dailyQuote.quote}"</blockquote>
                      <cite className="text-xs text-slate-500 dark:text-slate-400 block mt-1 not-italic text-right">- {dailyQuote.author}</cite>
                  </div>
              </div>
          )}
          {todaysFocus && (
              <div className="bg-teal-50 dark:bg-teal-900/40 border border-teal-200/50 dark:border-teal-800/60 p-3 rounded-lg flex items-center gap-3 animate-fade-in">
                  <TargetIcon className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <div>
                      <h4 className="font-semibold text-sm text-teal-800 dark:text-teal-200">Today's Focus:</h4>
                      <p className="text-sm text-teal-700 dark:text-teal-300">{todaysFocus.text}</p>
                  </div>
              </div>
          )}
        </div>
      )}
      {state.entries.length > 0 && (
        <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search journal entries..."
                className="w-full pl-10 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                    <XIcon className="w-5 h-5" />
                </button>
            )}
        </div>
      )}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {filteredEntries.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
             {searchQuery ? (
                 <>
                    <SearchIcon className="w-16 h-16 mb-4 text-slate-400 dark:text-slate-500"/>
                    <h2 className="text-xl font-semibold">No Results Found</h2>
                    <p className="max-w-md mt-2">Your search for "{searchQuery}" did not match any entries.</p>
                 </>
             ) : (
                <>
                  <BotIcon className="w-16 h-16 mb-4 text-slate-400 dark:text-slate-500"/>
                  <h2 className="text-xl font-semibold">Welcome to your Journal</h2>
                  <p className="max-w-md mt-2">How are you feeling today? Write it down, or use the mic to speak your mind.</p>
                </>
             )}
          </div>
        )}
        {filteredEntries.map((entry) => (
          <React.Fragment key={entry.id}>
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-teal-600 text-white p-3 rounded-xl rounded-br-none max-w-lg">
                <p>{entry.userContent}</p>
                 {entry.activityTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 border-t border-teal-500/50 pt-2">
                        {entry.activityTags.map(tag => (
                            <span key={tag} className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                    </div>
                 )}
                <time className="text-xs text-teal-200 mt-1 block text-right">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <EmotionAvatar mood={entry.mood} className="w-10 h-10 flex-shrink-0" />
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl rounded-bl-none max-w-lg shadow-sm">
                <p className="text-slate-700 dark:text-slate-300">{entry.aiResponse}</p>
                
                {entry.reframe && (
                    <div className="mt-4 p-3 bg-amber-100 dark:bg-slate-700/60 rounded-lg border border-amber-200 dark:border-slate-700">
                        <div className="flex items-start gap-3">
                            <LightbulbIcon className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm text-amber-800 dark:text-slate-200">A kinder perspective:</h4>
                                <p className="text-sm text-amber-700 dark:text-slate-300 italic">"{entry.reframe}"</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                    {entry.suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-1 text-xs font-medium text-teal-700 bg-teal-100 rounded-full hover:bg-teal-200 dark:bg-slate-700 dark:text-teal-300 dark:hover:bg-slate-600 transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
              <EmotionAvatar mood={'Neutral'} className="w-10 h-10 flex-shrink-0" />
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl max-w-lg shadow-sm">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                 </div>
              </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-auto pt-2 space-y-2">
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <div className="relative">
            <div className="flex items-center flex-wrap gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-t-xl">
                 <TagIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                 {currentTags.map(tag => (
                     <div key={tag} className="flex items-center gap-1 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-sm px-2 py-0.5 rounded-full">
                         {tag}
                         <button onClick={() => removeTag(tag)}><XIcon className="w-3 h-3" /></button>
                     </div>
                 ))}
                <input 
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add tags..."
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                    disabled={isLoading}
                />
            </div>
             <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        handleSubmit(e);
                    }
                    }}
                    placeholder="How are you feeling right now?"
                    className="flex-1 p-3 bg-white dark:bg-slate-800 border-x border-b border-slate-300 dark:border-slate-700 rounded-b-xl resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    rows={1}
                    disabled={isLoading}
                />
                {micSupported && (
                    <button
                    type="button"
                    onClick={handleMicClick}
                    disabled={isLoading}
                    className={`w-12 h-12 flex-shrink-0 flex items-center justify-center border dark:border-slate-700 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                        isRecording
                        ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 ring-transparent'
                    }`}
                    aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                    <MicrophoneIcon className="w-6 h-6" />
                    </button>
                )}
                <button
                    type="submit"
                    disabled={!userInput.trim() || isLoading}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-teal-600 text-white rounded-full disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-teal-700 transition-all duration-200 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                    <SendHorizonalIcon className="w-6 h-6" />
                </button>
             </form>
        </div>
      </div>
      {modalContent && <SelfCareModal suggestion={modalContent} onClose={() => setModalContent(null)} />}
    </div>
  );
};

export default JournalView;