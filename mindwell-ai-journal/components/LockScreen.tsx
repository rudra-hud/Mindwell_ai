
import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { BrainCircuitIcon } from './Icons';

const LockScreen: React.FC = () => {
    const { checkPin } = useSettings();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (pin.length === 4) {
            const isCorrect = checkPin(pin);
            if (!isCorrect) {
                setError('Incorrect PIN. Please try again.');
                setTimeout(() => {
                    setPin('');
                    setError('');
                }, 1000);
            }
        }
    }, [pin, checkPin]);

    const handlePinInput = (digit: string) => {
        if (pin.length < 4) {
            setPin(p => p + digit);
            setError('');
        }
    };

    const handleDelete = () => setPin(p => p.slice(0, -1));

    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 z-50">
            <div className="text-center max-w-xs w-full">
                <div className="flex flex-col items-center gap-2 mb-6">
                    <BrainCircuitIcon className="w-12 h-12 text-blue-600" />
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Enter Your PIN</h1>
                </div>

                <div className="flex justify-center items-center space-x-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                                error ? 'bg-red-500 animate-shake' : (pin.length > i ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600')
                            }`}
                            style={{ animationDelay: `${i * 50}ms` }}
                        />
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {[...Array(9)].map((_, i) => (
                        <button key={i+1} onClick={() => handlePinInput((i + 1).toString())} className="p-4 rounded-full bg-white dark:bg-slate-800/80 shadow-md hover:bg-slate-200 dark:hover:bg-slate-700 text-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 active:scale-95">
                            {i+1}
                        </button>
                    ))}
                     <button onClick={handleDelete} className="p-4 rounded-full bg-white dark:bg-slate-800/80 shadow-md hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 active:scale-95">
                        DEL
                    </button>
                    <button onClick={() => handlePinInput('0')} className="p-4 rounded-full bg-white dark:bg-slate-800/80 shadow-md hover:bg-slate-200 dark:hover:bg-slate-700 text-2xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 active:scale-95">
                        0
                    </button>
                     <div />
                </div>
                 {error && <p className="text-red-500 text-sm mt-4 h-5">{error}</p>}
            </div>
        </div>
    );
};

export default LockScreen;
