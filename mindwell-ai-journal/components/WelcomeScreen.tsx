
import React from 'react';
import { MindfulSparkIcon, BookTextIcon, LightbulbIcon, BarChart3Icon, TargetIcon } from './Icons';

interface WelcomeScreenProps {
    onComplete: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/50 text-teal-500">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{children}</p>
        </div>
    </div>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center p-6 md:p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl animate-fade-in-up space-y-8">
                <header className="space-y-4">
                    <MindfulSparkIcon className="w-16 h-16 mx-auto text-teal-500" />
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Welcome to MindWell
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">
                        Your private, AI-powered space for reflection and growth.
                    </p>
                </header>
                
                <section className="text-left space-y-6">
                     <FeatureCard icon={<BookTextIcon className="w-6 h-6"/>} title="Private Journaling">
                        Speak or type your thoughts freely. Your entries are secure and for your eyes only.
                    </FeatureCard>
                     <FeatureCard icon={<LightbulbIcon className="w-6 h-6"/>} title="AI-Powered Insights">
                        Receive empathetic responses and discover patterns in your emotional landscape.
                    </FeatureCard>
                     <FeatureCard icon={<BarChart3Icon className="w-6 h-6"/>} title="Mood & Activity Tracking">
                        Visualize your journey with a mood calendar and see how activities impact your well-being.
                    </FeatureCard>
                     <FeatureCard icon={<TargetIcon className="w-6 h-6"/>} title="Goal Setting">
                        Set meaningful intentions and celebrate your progress with unlockable achievements.
                    </FeatureCard>
                </section>
                
                <button
                    onClick={onComplete}
                    className="w-full max-w-xs px-8 py-4 bg-teal-600 text-white font-bold rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 transform hover:scale-105"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
