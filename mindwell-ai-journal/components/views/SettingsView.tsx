
import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { FingerprintIcon } from '../Icons';

type PinInputState = 'set' | 'confirm' | 'change_current' | 'change_new' | 'change_confirm' | 'remove_current';

const SettingsView: React.FC = () => {
    const { state, setPin, checkPin, removePin } = useSettings();
    const [pin, setPinInput] = useState('');
    const [newPin, setNewPin] = useState('');
    const [inputState, setInputState] = useState<PinInputState | null>(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handlePinInput = (digit: string) => {
        if (pin.length < 4) {
            setPinInput(p => p + digit);
        }
    };

    const handleDelete = () => setPinInput(p => p.slice(0, -1));

    const handlePinAction = () => {
        setError('');
        setMessage('');

        if (inputState === 'set') {
            setNewPin(pin);
            setPinInput('');
            setInputState('confirm');
        } else if (inputState === 'confirm') {
            if (pin === newPin) {
                setPin(pin);
                setMessage('PIN has been set successfully!');
                setInputState(null);
                setPinInput('');
                setNewPin('');
            } else {
                setError('PINs do not match. Please try again.');
                setPinInput('');
                setNewPin('');
                setInputState('set');
            }
        } else if (inputState === 'remove_current' || inputState === 'change_current') {
            if (checkPin(pin)) {
                if(inputState === 'remove_current') {
                    removePin();
                    setMessage('PIN has been removed.');
                    setInputState(null);
                } else {
                    setInputState('change_new');
                }
                setPinInput('');
            } else {
                setError('Incorrect PIN. Please try again.');
                setPinInput('');
            }
        } else if (inputState === 'change_new') {
            setNewPin(pin);
            setPinInput('');
            setInputState('change_confirm');
        } else if (inputState === 'change_confirm') {
             if (pin === newPin) {
                setPin(pin);
                setMessage('PIN has been changed successfully!');
                setInputState(null);
                setPinInput('');
                setNewPin('');
            } else {
                setError('New PINs do not match. Please try again.');
                setPinInput('');
                setNewPin('');
                setInputState('change_new');
            }
        }
    };
    
    const getTitle = () => {
        switch(inputState) {
            case 'set': return 'Set a New 4-Digit PIN';
            case 'confirm': return 'Confirm Your New PIN';
            case 'remove_current': return 'Enter Your Current PIN to Remove';
            case 'change_current': return 'Enter Your Current PIN';
            case 'change_new': return 'Enter Your New 4-Digit PIN';
            case 'change_confirm': return 'Confirm Your New PIN';
            default: return 'Security Settings';
        }
    }

    const reset = () => {
        setInputState(null);
        setPinInput('');
        setNewPin('');
        setError('');
        setMessage('');
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">Settings</h2>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">Manage your application preferences.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                        <FingerprintIcon className="w-6 h-6"/>
                        App Lock
                    </h3>

                    {inputState ? (
                        <div className="text-center">
                            <h4 className="font-semibold mb-4 text-slate-600 dark:text-slate-300">{getTitle()}</h4>
                             <div className="flex justify-center items-center space-x-3 my-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-4 h-4 rounded-full transition-all ${pin.length > i ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}/>
                                ))}
                            </div>
                            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                            <div className="grid grid-cols-3 gap-3 my-6 max-w-xs mx-auto">
                                {[...Array(9)].map((_, i) => (
                                    <button key={i+1} onClick={() => handlePinInput((i + 1).toString())} className="p-4 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xl font-bold transition-colors">{i+1}</button>
                                ))}
                                 <button onClick={handleDelete} className="p-4 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold transition-colors">DEL</button>
                                <button onClick={() => handlePinInput('0')} className="p-4 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xl font-bold transition-colors">0</button>
                                <button onClick={handlePinAction} className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 font-bold transition-colors">OK</button>
                            </div>
                            <button onClick={reset} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
                        </div>
                    ) : (
                         <>
                            {message && <p className="text-green-600 dark:text-green-400 text-center text-sm mb-4 p-3 bg-green-50 dark:bg-green-900/50 rounded-lg">{message}</p>}
                            <div className="space-y-3">
                                {state.pinHash ? (
                                    <>
                                        <button onClick={() => setInputState('change_current')} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Change PIN</button>
                                        <button onClick={() => setInputState('remove_current')} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-red-600 dark:text-red-500 transition-colors">Remove PIN</button>
                                    </>
                                ) : (
                                    <button onClick={() => setInputState('set')} className="w-full text-left p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Set a PIN to lock the app</button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
