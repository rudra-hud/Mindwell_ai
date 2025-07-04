
import React from 'react';
import { useAchievements } from '../../context/AchievementsContext';
import { ACHIEVEMENTS_LIST } from '../../constants';
import { TrophyIcon } from '../Icons';

const ProgressView: React.FC = () => {
    const { state } = useAchievements();

    const allAchievements = ACHIEVEMENTS_LIST.map(ach => ({
        ...ach,
        unlockedAt: state.unlocked[ach.id],
    }));

    const unlockedCount = allAchievements.filter(a => a.unlockedAt).length;
    const totalCount = allAchievements.length;
    const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Your Progress</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Celebrate your milestones and see how far you've come on your wellness journey.
                </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Achievements Unlocked</h3>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{unlockedCount} / {totalCount}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                        className="bg-teal-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allAchievements.map(ach => (
                        <li 
                            key={ach.id} 
                            className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                                ach.unlockedAt 
                                ? 'bg-white dark:bg-slate-800 shadow-md' 
                                : 'bg-slate-100 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700'
                            }`}
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                ach.unlockedAt ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-slate-200 dark:bg-slate-700'
                            }`}>
                                <ach.icon className={`w-6 h-6 ${ach.unlockedAt ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'}`} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-semibold ${ach.unlockedAt ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {ach.title}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{ach.description}</p>
                                {ach.unlockedAt && (
                                    <time className="text-xs text-teal-600 dark:text-teal-500 mt-1 block">
                                        Unlocked on {new Date(ach.unlockedAt).toLocaleDateString()}
                                    </time>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProgressView;
