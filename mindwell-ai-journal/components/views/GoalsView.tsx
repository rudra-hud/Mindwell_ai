
import React, { useState } from 'react';
import { useGoals } from '../../context/GoalsContext';
import { getRefinedGoal } from '../../services/geminiService';
import { Goal } from '../../types';
import { TargetIcon, SparklesIcon, Trash2Icon, XIcon } from '../Icons';
import CircularProgress from '../CircularProgress';

const GoalsView: React.FC = () => {
    const { state, addGoal, toggleGoalCompletion, removeGoal } = useGoals();
    const [newGoalText, setNewGoalText] = useState('');
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [error, setError] = useState('');

    const activeGoals = state.goals.filter(g => !g.isCompleted);
    const completedGoals = state.goals.filter(g => g.isCompleted);
    
    const completedCount = completedGoals.length;
    const totalCount = state.goals.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;


    const handleRefineGoal = async () => {
        if (!newGoalText.trim()) {
            setError('Please enter a goal first.');
            return;
        }
        setIsLoadingAi(true);
        setError('');
        setAiSuggestion(null);

        const suggestion = await getRefinedGoal(newGoalText);
        if (suggestion) {
            setAiSuggestion(suggestion);
        } else {
            setError('Could not refine goal. Please try again.');
        }
        setIsLoadingAi(false);
    };
    
    const handleAddGoal = (text: string) => {
        if (!text.trim()) return;
        const newGoal: Goal = {
            id: new Date().toISOString(),
            text: text.trim(),
            isCompleted: false,
            createdAt: new Date().toISOString(),
        };
        addGoal(newGoal);
        setNewGoalText('');
        setAiSuggestion(null);
        setError('');
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Your Goals & Intentions</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Set intentions, track your progress, and build positive habits.</p>
            </div>

            {state.goals.length > 0 && (
                 <div className="max-w-2xl mx-auto flex items-center gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg animate-fade-in">
                    <CircularProgress percentage={progress} />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your Progress</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">You've completed {completedCount} of {totalCount} goals. Keep up the great work!</p>
                    </div>
                </div>
            )}

            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                <h3 className="text-lg font-semibold">Add a New Goal</h3>
                <textarea
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    placeholder="e.g., 'Be more mindful' or 'Exercise more'"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    rows={2}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => handleAddGoal(newGoalText)} className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400" disabled={!newGoalText.trim()}>
                        Add Goal
                    </button>
                    <button onClick={handleRefineGoal} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" disabled={isLoadingAi}>
                        {isLoadingAi ? <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
                        Refine with AI
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {aiSuggestion && (
                    <div className="p-4 bg-teal-50 dark:bg-slate-700 rounded-lg space-y-3 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-teal-800 dark:text-teal-200">AI Suggestion:</h4>
                            <button onClick={() => setAiSuggestion(null)} className="text-slate-500 hover:text-slate-800"><XIcon className="w-4 h-4" /></button>
                        </div>
                        <p className="italic text-slate-700 dark:text-slate-300">"{aiSuggestion}"</p>
                        <button onClick={() => handleAddGoal(aiSuggestion)} className="w-full px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                            Use This Goal
                        </button>
                    </div>
                )}
            </div>
            
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h3 className="text-xl font-semibold mb-4">Active Goals ({activeGoals.length})</h3>
                    {activeGoals.length > 0 ? (
                        <ul className="space-y-3">
                            {activeGoals.map(goal => (
                                <li key={goal.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm transition-all animate-fade-in">
                                    <input type="checkbox" checked={goal.isCompleted} onChange={() => toggleGoalCompletion(goal.id)} className="w-6 h-6 text-teal-600 bg-slate-100 border-slate-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <span className="flex-1 text-slate-700 dark:text-slate-300">{goal.text}</span>
                                    <button onClick={() => removeGoal(goal.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"><Trash2Icon className="w-5 h-5"/></button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-4">No active goals. Add one above to get started!</p>
                    )}
                </div>

                {completedGoals.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Completed Goals ({completedGoals.length})</h3>
                        <ul className="space-y-3">
                            {completedGoals.map(goal => (
                                <li key={goal.id} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm transition-all opacity-60">
                                    <input type="checkbox" checked={goal.isCompleted} onChange={() => toggleGoalCompletion(goal.id)} className="w-6 h-6 text-teal-600 bg-slate-100 border-slate-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <span className="flex-1 text-slate-700 dark:text-slate-300 line-through">{goal.text}</span>
                                    <button onClick={() => removeGoal(goal.id)} className="text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"><Trash2Icon className="w-5 h-5"/></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                 {state.goals.length === 0 && !aiSuggestion && (
                    <div className="text-center py-10">
                        <TargetIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-600 dark:text-slate-300">Set Your First Goal</h3>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">What is one small thing you'd like to achieve?</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalsView;