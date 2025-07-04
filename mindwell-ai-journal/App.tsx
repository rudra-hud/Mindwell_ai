
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { JournalProvider, useJournal } from './context/JournalContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { GoalsProvider, useGoals } from './context/GoalsContext';
import { AchievementsProvider, useAchievements } from './context/AchievementsContext';
import JournalView from './components/views/JournalView';
import TrackerView from './components/views/TrackerView';
import InsightsView from './components/views/InsightsView';
import SettingsView from './components/views/SettingsView';
import GoalsView from './components/views/GoalsView';
import ProgressView from './components/views/ProgressView';
import LockScreen from './components/LockScreen';
import DistractionScreen from './components/DistractionScreen';
import AchievementToast from './components/AchievementToast';
import WelcomeScreen from './components/WelcomeScreen';
import { MindfulSparkIcon, BarChart3Icon, BookTextIcon, SunIcon, MoonIcon, CogIcon, TargetIcon, LightbulbIcon, TrophyIcon } from './components/Icons';

// This component handles the initial navigation logic on app startup.
const StartupNavigator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sessionStarted = sessionStorage.getItem('mindwell-session-started');
    if (!sessionStarted) {
      sessionStorage.setItem('mindwell-session-started', 'true');
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, location]);

  return null; // This component does not render anything.
};

// This component checks for unlockable achievements based on user activity.
const AchievementOrchestrator: React.FC = () => {
    const { state: journalState } = useJournal();
    const { state: goalsState } = useGoals();
    const { state: achievementsState, unlockAchievement } = useAchievements();

    // Listener for achievements triggered by simple events
    useEffect(() => {
        if (!achievementsState.hydrated) return;

        const handleInsightsClick = () => {
            if (!achievementsState.unlocked['deep-diver']) {
                unlockAchievement('deep-diver');
            }
        };
        const handleDoodleUsed = () => {
            if (!achievementsState.unlocked['creative-outlet']) {
                unlockAchievement('creative-outlet');
            }
        };

        const insightsButton = document.getElementById('generate-insights-button');
        insightsButton?.addEventListener('click', handleInsightsClick);
        document.addEventListener('doodleToolUsed', handleDoodleUsed);

        return () => {
            insightsButton?.removeEventListener('click', handleInsightsClick);
            document.removeEventListener('doodleToolUsed', handleDoodleUsed);
        };
    }, [achievementsState.hydrated, achievementsState.unlocked, unlockAchievement]);


    // Listener for achievements based on state changes
    useEffect(() => {
        if (!achievementsState.hydrated) return;

        // First Spark: First journal entry
        if (journalState.entries.length >= 1 && !achievementsState.unlocked['first-spark']) {
            unlockAchievement('first-spark');
        }

        // Mindful Week: Journaled on 7 different days
        const uniqueDays = new Set(journalState.entries.map(e => new Date(e.timestamp).toDateString())).size;
        if (uniqueDays >= 7 && !achievementsState.unlocked['mindful-week']) {
            unlockAchievement('mindful-week');
        }

        // Goal Setter: Created the first goal
        if (goalsState.goals.length >= 1 && !achievementsState.unlocked['goal-setter']) {
            unlockAchievement('goal-setter');
        }

        // Goal Crusher: Completed 5 goals
        const completedGoals = goalsState.goals.filter(g => g.isCompleted).length;
        if (completedGoals >= 5 && !achievementsState.unlocked['goal-crusher']) {
            unlockAchievement('goal-crusher');
        }

        // Reframer: First entry with a cognitive reframe
        const hasReframe = journalState.entries.some(e => e.reframe);
        if (hasReframe && !achievementsState.unlocked['reframer']) {
            unlockAchievement('reframer');
        }

    }, [journalState.entries, goalsState.goals, achievementsState.unlocked, achievementsState.hydrated, unlockAchievement]);

    return null;
}


const AppContent: React.FC = () => {
  const commonLinkClass = "flex flex-col items-center gap-1 px-2 py-2 text-sm font-medium transition-colors duration-200 rounded-md";
  const activeLinkClass = "bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-300";
  const inactiveLinkClass = "text-slate-500 hover:bg-teal-50 dark:text-slate-400 dark:hover:bg-slate-800";
  
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('mindwell-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const { state: settingsState } = useSettings();
  const { state: achievementsState } = useAchievements();
  const [showDistraction, setShowDistraction] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mindwell-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const activateDistractionMode = () => {
    setShowDistraction(true);
  };

  if (settingsState.isLocked) {
    return <LockScreen />;
  }

  return (
    <>
      {achievementsState.toastQueue.length > 0 && <AchievementToast achievement={achievementsState.toastQueue[0]} />}
      {showDistraction && <DistractionScreen onClose={() => setShowDistraction(false)} />}
      <div className="flex flex-col h-screen antialiased text-slate-700 dark:text-slate-300">
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
                <MindfulSparkIcon className="w-8 h-8 text-teal-500" />
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">MindWell</h1>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
            <Routes>
                <Route path="/" element={<JournalView activateDistractionMode={activateDistractionMode} />} />
                <Route path="/tracker" element={<TrackerView />} />
                <Route path="/insights" element={<InsightsView />} />
                <Route path="/goals" element={<GoalsView />} />
                <Route path="/progress" element={<ProgressView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/summary" element={<Navigate to="/insights" replace />} />
            </Routes>
        </main>
        
        <nav className="flex justify-around p-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0">
             <NavLink to="/" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                <BookTextIcon className="w-6 h-6" />
                <span>Journal</span>
            </NavLink>
            <NavLink to="/tracker" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                <BarChart3Icon className="w-6 h-6" />
                <span>Calendar</span>
            </NavLink>
             <NavLink to="/insights" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                <LightbulbIcon className="w-6 h-6" />
                <span>Insights</span>
            </NavLink>
            <NavLink to="/goals" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                <TargetIcon className="w-6 h-6" />
                <span>Goals</span>
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                <TrophyIcon className="w-6 h-6" />
                <span>Progress</span>
            </NavLink>
             <NavLink to="/settings" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                <CogIcon className="w-6 h-6" />
                <span>Settings</span>
            </NavLink>
        </nav>
      </div>
    </>
  );
};

const App: React.FC = () => {
    const [showWelcome, setShowWelcome] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        try {
            const hasVisited = localStorage.getItem('mindwell-has-visited');
            if (!hasVisited) {
                setShowWelcome(true);
            }
        } catch (e) {
            console.error("Could not read from local storage", e);
        } finally {
            setIsInitialLoad(false);
        }
    }, []);

    const handleWelcomeComplete = () => {
        try {
            localStorage.setItem('mindwell-has-visited', 'true');
        } catch (e) {
            console.error("Could not write to local storage", e);
        }
        setShowWelcome(false);
    };

    if (isInitialLoad) {
        return null; // Or a loading spinner
    }

    if (showWelcome) {
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }

    return (
        <HashRouter>
            <JournalProvider>
                <SettingsProvider>
                    <GoalsProvider>
                        <AchievementsProvider>
                            <StartupNavigator />
                            <AchievementOrchestrator />
                            <AppContent />
                        </AchievementsProvider>
                    </GoalsProvider>
                </SettingsProvider>
            </JournalProvider>
        </HashRouter>
    );
};

export default App;