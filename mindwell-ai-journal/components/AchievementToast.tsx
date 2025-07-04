
import React, { useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';
import { Achievement } from '../types';
import { TrophyIcon, XIcon } from './Icons';

interface AchievementToastProps {
  achievement: Achievement;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
    const { dismissToast } = useAchievements();

    useEffect(() => {
        const timer = setTimeout(() => {
            dismissToast();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [achievement, dismissToast]);

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-sm z-[200] px-4">
            <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-xl p-4 flex items-center gap-4 animate-slide-in-down border dark:border-slate-700">
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/50 text-amber-500">
                    <TrophyIcon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">ACHIEVEMENT UNLOCKED</p>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{achievement.title}</h3>
                </div>
                <button onClick={dismissToast} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AchievementToast;
