
import React, { useState, useCallback, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useJournal } from '../../context/JournalContext';
import { getInsights } from '../../services/geminiService.ts';
import { InsightsSummary, Mood } from '../../types';
import { SparklesIcon, LightbulbIcon, DownloadIcon } from '../Icons';
import { MOOD_EMOJIS } from '../../constants';
import CorrelationChart from '../CorrelationChart';

const InsightsView: React.FC = () => {
    const { state } = useJournal();
    const [insights, setInsights] = useState<InsightsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const insightsContainerRef = useRef<HTMLDivElement>(null);

    const recentEntries = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return state.entries.filter(entry => new Date(entry.timestamp) > oneWeekAgo);
    }, [state.entries]);

    const correlationData = useMemo(() => {
        const tagMoodMap: { [tag: string]: { [mood in Mood]?: number } } = {};
        
        state.entries.forEach(entry => {
            entry.activityTags.forEach(tag => {
                if (!tagMoodMap[tag]) {
                    tagMoodMap[tag] = {};
                }
                tagMoodMap[tag][entry.mood] = (tagMoodMap[tag][entry.mood] || 0) + 1;
            });
        });

        return Object.entries(tagMoodMap).map(([activity, moods]) => ({
            activity,
            ...moods
        })).slice(0, 10); // Limit to top 10 tags for readability
    }, [state.entries]);

    const handleGenerateInsights = useCallback(async () => {
        if (recentEntries.length < 3) {
            setError("You need at least 3 journal entries from the last 7 days to generate insights.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setInsights(null);

        const result = await getInsights(recentEntries);
        if (result) {
            setInsights(result);
        } else {
            setError("Could not generate insights. Please try again later.");
        }
        setIsLoading(false);
    }, [recentEntries]);

    const handleDownload = useCallback(() => {
        if (insightsContainerRef.current) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            html2canvas(insightsContainerRef.current, {
                useCORS: true,
                backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc', // slate-900 or slate-50
                scale: 2,
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `mindwell-insights-${new Date().toISOString().split('T')[0]}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                console.error("Failed to download insights image", err);
                setError("Sorry, there was an error downloading the image.");
            });
        }
    }, []);

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Your Weekly Insights</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Let's reflect on your week. Discover patterns, triggers, and highlights from your journal entries.
                </p>
            </div>

            <div className="flex justify-center">
                <button
                    id="generate-insights-button"
                    onClick={handleGenerateInsights}
                    disabled={isLoading || recentEntries.length < 3}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-all duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Generate {insights ? 'New' : ''} Insights</span>
                        </>
                    )}
                </button>
            </div>
             {recentEntries.length < 3 && !isLoading && (
                <p className="text-center text-sm text-slate-500">You need at least {3 - recentEntries.length} more journal entries in the last 7 days.</p>
            )}

            {error && <p className="text-center text-red-500">{error}</p>}

            {(insights || correlationData.length > 0) && (
                <div ref={insightsContainerRef} className="max-w-3xl mx-auto mt-6 animate-fade-in space-y-6">
                    {insights && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                                    <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-3">Top Triggers</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {insights.topTriggers.map((trigger, index) => (
                                            <span key={index} className="px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 rounded-full">{trigger}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                                    <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-3">Positive Highlight</h4>
                                    <p className="italic text-slate-700 dark:text-slate-200">"{insights.positiveHighlight}"</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                                <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-4">Recurring Patterns</h4>
                                <ul className="space-y-4">
                                    {insights.moodPatterns.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4">
                                            <span className="text-2xl mt-1">{MOOD_EMOJIS[item.mood]}</span>
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{item.mood}</p>
                                                <p className="text-slate-600 dark:text-slate-400">{item.pattern}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-start gap-4">
                                    <LightbulbIcon className="w-8 h-8 flex-shrink-0 text-cyan-200" />
                                    <div>
                                        <h4 className="font-semibold text-cyan-100 mb-2">Actionable Suggestion</h4>
                                        <p className="font-medium text-lg">{insights.actionableSuggestion}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                     <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                        <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-4">Emotion-Activity Correlations</h4>
                        {correlationData.length > 0 ? (
                            <div className="h-72">
                                <CorrelationChart data={correlationData} />
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-4">Add tags to your entries to see correlations here.</p>
                        )}
                    </div>


                    {insights && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
                                aria-label="Download Insights"
                            >
                                <DownloadIcon className="w-5 h-5" />
                                <span>Download as Image</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InsightsView;
