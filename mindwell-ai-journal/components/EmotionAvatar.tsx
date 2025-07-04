import React from 'react';
import { Mood } from '../types';

interface AvatarProps {
  className?: string;
}

const joyfulKeyframes = `
  @keyframes joyful-sparkle {
    0%, 100% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1); opacity: 1; }
  }
  @keyframes joyful-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
const JoyfulAvatar: React.FC<AvatarProps> = ({ className }) => (
  <div className={className}>
    <style>{joyfulKeyframes}</style>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="20" cy="20" r="14" fill="#FBBF24" />
      <g style={{ animation: 'joyful-rotate 40s linear infinite' }}>
        <path d="M20 5V3" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 37V35" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M30.6 9.4l-1.4 1.4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M9.4 30.6l-1.4 1.4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M35 20h-2" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 20H3" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M30.6 30.6l-1.4-1.4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <path d="M9.4 9.4l-1.4-1.4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path d="M14 18C14 17.3333 15.5 16 17 16C18.5 16 20 17.3333 20 18" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M26 18C26 17.3333 24.5 16 23 16C21.5 16 20 17.3333 20 18" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 25C15 25 17 29 20 29C23 29 25 25 25 25" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 15 L33 13 L34 15 L36 16 L34 17 L33 19 L32 17 L30 16 Z" fill="#F59E0B" style={{ animation: 'joyful-sparkle 2s ease-in-out infinite', animationDelay: '0s' }} />
      <path d="M8 28 L9 26 L10 28 L12 29 L10 30 L9 32 L8 30 L6 29 Z" fill="#F59E0B" style={{ animation: 'joyful-sparkle 2s ease-in-out infinite', animationDelay: '1s' }} />
    </svg>
  </div>
);

const sadKeyframes = `
  @keyframes sad-drip {
    0%, 20% { transform: translateY(0) scaleY(1); opacity: 1; }
    80% { transform: translateY(10px) scaleY(1.2); opacity: 1; }
    100% { transform: translateY(20px); opacity: 0; }
  }
`;
const SadAvatar: React.FC<AvatarProps> = ({ className }) => (
  <div className={className}>
    <style>{sadKeyframes}</style>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M29.5 28C32.1667 28 34.5 25.5 34.5 22C34.5 18.5 31.5 16 28 16C27.5 13.5 25.5 11 22.5 11C19.5 11 17 13 16.5 16H16C12.5 16 10 18.5 10 22C10 25.5 12.5 28 16 28H29.5Z" fill="#A5B4FC"/>
      <path d="M15 22C15 22 16 20 17.5 20C19 20 20 22 20 22" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M25 22C25 22 24 20 22.5 20C21 20 20 22 20 22" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 26H23" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 30 C 18 32, 22 32, 22 30" fill="#3B82F6" style={{ animation: 'sad-drip 4s ease-out infinite', animationDelay: '1s' }}/>
    </svg>
  </div>
);

const anxiousKeyframes = `
  @keyframes anxious-shake {
    0%, 100% { transform: translate(0, 0) rotate(0); }
    10%, 30%, 50%, 70%, 90% { transform: translate(-1px, 0) rotate(-1deg); }
    20%, 40%, 60%, 80% { transform: translate(1px, 0) rotate(1deg); }
  }
`;
const AnxiousAvatar: React.FC<AvatarProps> = ({ className }) => (
  <div className={className}>
    <style>{anxiousKeyframes}</style>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g style={{ animation: 'anxious-shake 0.5s linear infinite' }}>
        <path d="M30 32C33.3137 32 36 29.3137 36 26C36 22.6863 33.3137 20 30 20C26.6863 20 24 22.6863 24 26C24 29.3137 26.6863 32 30 32Z" fill="#FBBF24"/>
        <path d="M10 32C13.3137 32 16 29.3137 16 26C16 22.6863 13.3137 20 10 20C6.68629 20 4 22.6863 4 26C4 29.3137 6.68629 32 10 32Z" fill="#FBBF24"/>
        <rect x="8" y="8" width="24" height="24" rx="12" fill="#FBBF24"/>
        <circle cx="15" cy="17" r="1.5" fill="#4A5568"/>
        <circle cx="25" cy="17" r="1.5" fill="#4A5568"/>
        <path d="M16 24L18 22L20 24L22 22L24 24" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  </div>
);

const calmKeyframes = `
  @keyframes calm-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-2px); }
  }
`;
const CalmAvatar: React.FC<AvatarProps> = ({ className }) => (
  <div className={className}>
    <style>{calmKeyframes}</style>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g style={{ animation: 'calm-float 5s ease-in-out infinite' }}>
        <circle cx="20" cy="20" r="14" fill="#60A5FA"/>
        <path d="M15 18H25" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 24H25" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 21C16 21 17 19 20 19C23 19 24 21 26 21" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </g>
    </svg>
  </div>
);

const angryKeyframes = `
  @keyframes angry-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;
const AngryAvatar: React.FC<AvatarProps> = ({ className }) => (
  <div className={className}>
    <style>{angryKeyframes}</style>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g style={{ animation: 'angry-pulse 1s ease-in-out infinite' }}>
        <circle cx="20" cy="20" r="14" fill="#F87171"/>
        <path d="M13 16L17 20" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
        <path d="M17 16L13 20" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
        <path d="M23 16L27 20" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
        <path d="M27 16L23 20" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 26C15 26 17 24 20 24C23 24 25 26 25 26" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  </div>
);

const neutralKeyframes = `
  @keyframes neutral-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
`;
const NeutralAvatar: React.FC<AvatarProps> = ({ className }) => (
  <div className={className}>
    <style>{neutralKeyframes}</style>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="20" cy="20" r="14" fill="#9CA3AF"/>
      <g style={{ animation: 'neutral-blink 4s infinite' }}>
        <line x1="14" y1="18" x2="18" y2="18" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="18" x2="26" y2="18" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
      </g>
      <line x1="15" y1="26" x2="25" y2="26" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
);

const EmotionAvatar: React.FC<{ mood: Mood; className?: string }> = ({ mood, className }) => {
  switch (mood) {
    case 'Joyful':
      return <JoyfulAvatar className={className} />;
    case 'Sad':
      return <SadAvatar className={className} />;
    case 'Anxious':
      return <AnxiousAvatar className={className} />;
    case 'Calm':
      return <CalmAvatar className={className} />;
    case 'Angry':
      return <AngryAvatar className={className} />;
    case 'Neutral':
      return <NeutralAvatar className={className} />;
    default:
      return <NeutralAvatar className={className} />;
  }
};

export default EmotionAvatar;