import React, { useState, useMemo } from 'react';
import { useJournal } from '../../context/JournalContext';
import { MOOD_EMOJIS } from '../../constants';
import { JournalEntry } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon, BarChart3Icon } from '../Icons';

const CalendarDay: React.FC<{ day: Date | null; entry?: JournalEntry }> = ({ day, entry }) => {
    if (!day) {
        return <div className="aspect-square"></div>;
    }

    const isToday = new Date().toDateString() === day.toDateString();
    const moodEmoji = entry ? MOOD_EMOJIS[entry.mood] : null;

    return (
        <div className="relative aspect-square flex items-center justify-center p-1 group border border-transparent rounded-lg">
            <span className={`absolute top-1.5 right-1.5 text-xs z-0 ${isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {day.getDate()}
            </span>
            {moodEmoji && (
                <div className="text-3xl md:text-4xl transition-transform duration-200 group-hover:scale-125 z-10">
                    {moodEmoji}
                </div>
            )}
             {entry && (
                <div className="absolute bottom-full mb-2 w-max max-w-xs p-3 bg-slate-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <p className="font-bold">{entry.mood}</p>
                    <p className="italic">"{entry.userContent.substring(0, 50)}..."</p>
                    <time className="text-xs text-slate-400 mt-1 block">{new Date(entry.timestamp).toLocaleDateString()}</time>
                </div>
            )}
        </div>
    );
};


const TrackerView: React.FC = () => {
    const { state } = useJournal();
    const [currentDate, setCurrentDate] = useState(new Date());

    const entriesByDate = useMemo(() => {
        const map = new Map<string, JournalEntry>();
        // Iterate backwards to get the most recent entry of the day
        for (let i = state.entries.length - 1; i >= 0; i--) {
            const entry = state.entries[i];
            const dateKey = new Date(entry.timestamp).toDateString();
            if (!map.has(dateKey)) {
                map.set(dateKey, entry);
            }
        }
        return map;
    }, [state.entries]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Set to first of month to avoid day-of-month issues
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid: (Date | null)[] = [];
        // Pad start with nulls
        for (let i = 0; i < firstDayOfMonth; i++) {
            grid.push(null);
        }
        // Fill with days
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(new Date(year, month, i));
        }
        return grid;
    }, [currentDate]);

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-8">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Your Mood Calendar</h2>
                <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    See your emotional landscape at a glance. Hover over an emoji for details.
                </p>
            </div>

            {state.entries.length > 0 ? (
                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Previous month">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 text-center">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Next month">
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7">
                        {weekdays.map(day => (
                            <div key={day} className="text-center font-semibold text-xs text-slate-500 dark:text-slate-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-700">
                        {calendarGrid.map((day, index) => (
                           <div key={index} className="border-b border-r border-slate-200 dark:border-slate-700">
                                <CalendarDay day={day} entry={day ? entriesByDate.get(day.toDateString()) : undefined} />
                           </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <BarChart3Icon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
                    <h3 className="mt-4 text-xl font-semibold text-slate-600 dark:text-slate-300">No Data Yet</h3>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Start writing in your journal to see your mood calendar here.</p>
                </div>
            )}
        </div>
    );
};

export default TrackerView;
