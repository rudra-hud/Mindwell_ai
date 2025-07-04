
import React, { useState } from 'react';

const steps = [
    {
        title: "5 Things You See",
        prompt: "Look around you and notice five distinct objects. Acknowledge them silently to yourself.",
        color: "blue"
    },
    {
        title: "4 Things You Can Feel",
        prompt: "Bring your awareness to four things you can feel. The texture of your clothes, the surface you're sitting on, the air on your skin.",
        color: "emerald"
    },
    {
        title: "3 Things You Can Hear",
        prompt: "Listen carefully and identify three distinct sounds. The hum of a fan, distant traffic, your own breathing.",
        color: "amber"
    },
    {
        title: "2 Things You Can Smell",
        prompt: "Take a moment to notice two different smells. The scent of your coffee, a book, or the air from an open window.",
        color: "rose"
    },
    {
        title: "1 Thing You Can Taste",
        prompt: "Focus on one thing you can taste. The lingering taste of your last meal, or simply the natural taste of your own mouth.",
        color: "indigo"
    },
    {
        title: "You are Present",
        prompt: "You have connected with your senses and grounded yourself in the present moment. Take a final, deep breath.",
        color: "slate"
    }
];

const GroundingExercise: React.FC = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };
    
    const currentStep = steps[currentStepIndex];

    const colorClasses = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-300', ring: 'ring-blue-500' },
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-300', ring: 'ring-emerald-500' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-300', ring: 'ring-amber-500' },
        rose: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-600 dark:text-rose-300', ring: 'ring-rose-500' },
        indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-600 dark:text-indigo-300', ring: 'ring-indigo-500' },
        slate: { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-600 dark:text-slate-300', ring: 'ring-slate-500' },
    }

    const currentTheme = colorClasses[currentStep.color as keyof typeof colorClasses];

    return (
        <div className="flex flex-col items-center justify-between p-4 h-96">
            <div className="w-full">
                <div className="flex justify-between mb-1">
                    {steps.slice(0,-1).map((step, index) => (
                         <span key={index} className={`text-xs font-semibold ${index <= currentStepIndex ? currentTheme.text : 'text-slate-400 dark:text-slate-600'}`}>
                            {step.title.split(' ')[0]}
                         </span>
                    ))}
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${currentTheme.bg.replace('bg-','').replace('/50','').replace('100', '500').replace('900', '400')}`}
                        style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className={`w-full text-center flex-1 flex flex-col items-center justify-center`}>
                <h2 className={`text-3xl font-bold ${currentTheme.text} mb-4 transition-colors duration-500`}>
                    {currentStep.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 max-w-sm transition-colors duration-500">
                    {currentStep.prompt}
                </p>
            </div>
            
            {currentStepIndex < steps.length - 1 && (
                <button
                    onClick={handleNext}
                    className={`px-8 py-2 font-semibold text-white rounded-lg transition-all duration-500 shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${currentTheme.ring} ${currentTheme.bg.replace('bg-','').replace('/50','').replace('100', '600').replace('900', '500')}`}
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default GroundingExercise;