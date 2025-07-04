import React, { useState, useCallback, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useJournal } from '../../context/JournalContext';
import { getInsights } from '../../services/geminiService';
import { InsightsSummary } from '../../types';
import { SparklesIcon, DownloadIcon } from '../Icons';

const SummaryView: React.FC = () => {
    const { state } = useJournal();
    const [summary, setSummary] = useState<InsightsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const summaryCardRef = useRef<HTMLDivElement>(null);

    const recentEntries = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return state.entries.filter(entry => new Date(entry.timestamp) > oneWeekAgo);
    }, [state.entries]);

    const topEmotions = useMemo(() => {
        if (!summary) return [];
        const moods = summary.moodPatterns.map(p => p.mood);
        return [...new Set(moods)];
    }, [summary]);

    const handleGenerateSummary = useCallback(async () => {
        if (recentEntries.length < 3) {
            setError("You need at least 3 journal entries from the last 7 days to generate a summary.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSummary(null);

        const result = await getInsights(recentEntries);
        if (result) {
            setSummary(result);
        } else {
            setError("Could not generate summary. Please try again later.");
        }
        setIsLoading(false);
    }, [recentEntries]);

    const handleDownload = () => {
        if (summaryCardRef.current) {
            const isDarkMode = document.documentElement.classList.contains('dark');
            html2canvas(summaryCardRef.current, {
                useCORS: true,
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', // slate-800 or white
                scale: 2, // for better resolution
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `mindwell-summary-${new Date().toISOString().split('T')[0]}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(err => {
                console.error("Failed to download summary image", err);
                setError("Sorry, there was an error downloading the image.");
            });
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Your Weekly Reflection</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Generate an AI-powered summary of your emotional themes and patterns from the last 7 days.
                </p>
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleGenerateSummary}
                    disabled={isLoading || recentEntries.length < 3}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Generate {summary ? 'New' : ''} Summary</span>
                        </>
                    )}
                </button>
            </div>
             {recentEntries.length < 3 && !isLoading && (
                <p className="text-center text-sm text-slate-500">You need at least {3 - recentEntries.length} more journal entries in the last 7 days.</p>
            )}

            {error && <p className="text-center text-red-500">{error}</p>}

            {summary && (
                <div className="max-w-3xl mx-auto mt-6 animate-fade-in">
                    <div ref={summaryCardRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6 border-b pb-4 dark:border-slate-700">Your Reflection for the Week</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Top Emotions</h4>
                                <div className="flex flex-wrap gap-2">
                                    {topEmotions.map((emotion, index) => (
                                        <span key={index} className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">{emotion}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Key Themes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {summary.topTriggers.map((theme, index) => (
                                        <span key={index} className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 rounded-full">{theme}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">Quote of the Week</h4>
                                <p className="italic text-slate-700 dark:text-slate-200">"{summary.positiveHighlight}"</p>
                            </div>

                             <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-slate-600 dark:text-slate-300 mb-2">A Suggestion for Next Week</h4>
                                <p className="text-slate-700 dark:text-slate-200">{summary.actionableSuggestion}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-4">
                         <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
                            aria-label="Download Summary"
                        >
                            <DownloadIcon className="w-5 h-5" />
                            <span>Download as Image</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryView;
