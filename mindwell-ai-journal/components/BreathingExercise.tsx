
import React, { useState, useEffect } from 'react';

const BreathingExercise: React.FC = () => {
    const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
    const [text, setText] = useState('Breathe in...');

    useEffect(() => {
        const sequence = [
            { p: 'inhale', t: 'Breathe in...' },
            { p: 'hold1', t: 'Hold' },
            { p: 'exhale', t: 'Breathe out...' },
            { p: 'hold2', t: 'Hold' },
        ] as const;
        
        const currentIndex = sequence.findIndex(item => item.p === phase);
        const nextIndex = (currentIndex + 1) % sequence.length;

        const timer = setTimeout(() => {
            setPhase(sequence[nextIndex].p);
            setText(sequence[nextIndex].t);
        }, 4000); // 4 seconds for each phase

        return () => clearTimeout(timer);
    }, [phase]);
    
    const getCircleClass = () => {
        switch(phase) {
            case 'inhale':
                return 'scale-100 opacity-100';
            case 'hold1':
                return 'scale-100 opacity-100';
            case 'exhale':
                return 'scale-50 opacity-70';
            case 'hold2':
                return 'scale-50 opacity-70';
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 h-80">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Box Breathing</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-8">Follow the guide to calm your mind.</p>
            <div className="relative w-48 h-48 flex items-center justify-center">
                <div
                    className={`absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full transition-all duration-[3500ms] ease-in-out ${getCircleClass()}`}
                />
                <div
                    className={`absolute inset-0 m-auto w-1/2 h-1/2 bg-blue-500/50 dark:bg-blue-400/50 rounded-full transition-all duration-[3500ms] ease-in-out ${getCircleClass()}`}
                />
                <span className="relative text-xl font-semibold text-slate-700 dark:text-slate-200 z-10">
                    {text}
                </span>
            </div>
        </div>
    );
};

export default BreathingExercise;
