
import React, { useEffect, useMemo } from 'react';
import { SelfCareSuggestion } from '../types';
import { XIcon } from './Icons';
import BreathingExercise from './BreathingExercise';
import GroundingExercise from './GroundingExercise';
import DoodleCanvas from './DoodleCanvas';

interface SelfCareModalProps {
  suggestion: SelfCareSuggestion;
  onClose: () => void;
}

const selfCareContent: Record<Exclude<SelfCareSuggestion, 'Breathing Exercise' | '5-4-3-2-1 Grounding' | 'Mindful Doodling'>, { title: string; description: string; content: React.ReactNode }> = {
    'Meditation': {
        title: "5-Minute Guided Meditation",
        description: "Find a quiet space, close your eyes, and follow these steps to calm your mind.",
        content: (
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
                <li>Settle into a comfortable position, either sitting or lying down.</li>
                <li>Gently close your eyes and take a deep breath in through your nose, and out through your mouth.</li>
                <li>Bring your attention to your breath. Notice the sensation of air filling your lungs and then leaving your body.</li>
                <li>If your mind wanders, gently guide it back to your breath without judgment. This is the practice.</li>
                <li>Continue for a few minutes. When you're ready, slowly open your eyes.</li>
            </ol>
        )
    },
    'Music': {
        title: "Calming Lo-fi Music",
        description: "Here is a playlist to help you relax and focus. Press play and let the music wash over you.",
        content: (
            <div className="aspect-video">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/jfKfPfyJRdk" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="rounded-lg"
                ></iframe>
            </div>
        )
    },
    'Affirmation': {
        title: "Positive Affirmation",
        description: "Repeat this affirmation to yourself, either out loud or in your mind. Believe in its power.",
        content: (
            <div className="p-6 bg-blue-100 dark:bg-slate-700 rounded-lg text-center">
                <p className="text-xl font-semibold text-blue-800 dark:text-blue-200">"I am capable and resilient. I can handle the challenges that come my way."</p>
            </div>
        )
    },
    'Quick Story': {
        title: "A Short, Calming Story",
        description: "Allow yourself a moment to escape into a brief tale of peace and perseverance.",
        content: (
            <p className="text-slate-600 dark:text-slate-300 italic">
                In a quiet forest, a tiny seed lay dormant through a long, cold winter. It didn't despair in the darkness. It simply rested, gathering strength. When spring arrived, it pushed through the soil, not with force, but with gentle persistence. It grew into a tall tree, not by worrying about the sky, but by focusing on its own roots and reaching for the light one day at a time.
            </p>
        )
    }
}

const SelfCareModal: React.FC<SelfCareModalProps> = ({ suggestion, onClose }) => {
    
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
    
        return () => {
           window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const isBreathingExercise = suggestion === 'Breathing Exercise';
    const isGroundingExercise = suggestion === '5-4-3-2-1 Grounding';
    const isDoodling = suggestion === 'Mindful Doodling';
    const content = useMemo(() => isBreathingExercise || isGroundingExercise || isDoodling ? null : selfCareContent[suggestion], [suggestion, isBreathingExercise, isGroundingExercise, isDoodling]);

    const renderContent = () => {
        if(isBreathingExercise) return <BreathingExercise />;
        if(isGroundingExercise) return <GroundingExercise />;
        if(isDoodling) return <DoodleCanvas />;
        if(content) {
            return (
                <>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 pr-10">{content.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">{content.description}</p>
                    <div>
                        {content.content}
                    </div>
                </>
            )
        }
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl m-4 p-6 relative animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors z-20"
                    aria-label="Close"
                >
                    <XIcon className="w-6 h-6"/>
                </button>
                
                {renderContent()}

                 <button
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default SelfCareModal;
