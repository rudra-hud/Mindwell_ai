import React from 'react';
import { XIcon } from './Icons';

interface DistractionScreenProps {
  onClose: () => void;
}

const DistractionScreen: React.FC<DistractionScreenProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-[100] p-4 text-white animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-300 hover:text-white transition-colors z-20"
        aria-label="Close"
      >
        <XIcon className="w-8 h-8" />
      </button>

      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold">A Moment of Calm</h1>
        <p className="text-lg text-slate-300">
          It's okay to feel overwhelmed. Let's take a break together. Just breathe.
        </p>
      </div>

      <div className="w-full max-w-2xl aspect-video my-8 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/4oStw0r33so?autoplay=1&controls=0&loop=1&playlist=4oStw0r33so"
          title="Calm Music"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="text-center text-slate-400">
        <p className="text-xl font-semibold">You are safe. This feeling will pass.</p>
        <p className="mt-2">When you're ready, you can close this screen.</p>
      </div>
    </div>
  );
};

export default DistractionScreen;
