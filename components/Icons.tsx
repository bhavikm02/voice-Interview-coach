import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5.4-3a5.4 5.4 0 0 1-10.8 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-1.6z"/>
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 6h12v12H6z" />
    </svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
);


export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
);

export const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.27-.15A5.953 5.953 0 0021 8.25l-3.27-.15m3.27.15L21 3M2.25 18h19.5" />
    </svg>
);

export const RetryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.315 7.584C10.866 6.33 12.834 5.25 15 5.25a.75.75 0 01.75.75c0 1.5-1.125 2.719-2.585 3.5-1.46 1.011-3.415 2.092-3.415 4.5a.75.75 0 01-1.5 0c0-1.5 1.125-2.719 2.585-3.5 1.46-1.011 3.415-2.092 3.415-4.5a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25.75.75 0 01-1.5 0 1.5 1.5 0 00-1.5-1.5.75.75 0 01-.75-.75c0-1.15-.844-2.235-2.185-3.003-1.341-.767-3.023-1.5-4.815-1.5-2.22 0-4.14.936-5.515 2.443a.75.75 0 01-1.06-1.06C6.13 3.96 8.435 3 11.25 3c2.815 0 5.12.96 6.495 2.443a.75.75 0 01-1.06 1.06C15.314 5.436 13.595 4.5 11.25 4.5c-1.792 0-3.473.767-4.815 1.5C5.094 6.765 4.25 7.85 4.25 9a.75.75 0 01-1.5 0c0-1.5 1.125-2.719 2.585-3.5C6.795 4.71 8.75 3.63 11.25 2.25a.75.75 0 01.75.75c0 1.5-1.125 2.719-2.585 3.5C7.955 7.51 6 8.59 6 11.25a.75.75 0 01-1.5 0c0-2.815.96-5.12 2.443-6.495a.75.75 0 011.06 1.06C7.036 6.87 6 8.595 6 11.25c0 1.792.767 3.473 1.5 4.815 1.036 1.341 2.235 2.185 3.003 2.185a.75.75 0 01.75.75c0 .414-.336.75-.75.75-1.15 0-2.235-.844-3.003-2.185-.767-1.342-1.5-3.023-1.5-4.815a.75.75 0 01.75-.75c1.5 0 2.719 1.125 3.5 2.585 1.011 1.46 2.092 3.415 4.5 3.415a.75.75 0 010 1.5c-1.5 0-2.719-1.125-3.5-2.585-.781-1.46-1.852-3.415-4.5-3.415a.75.75 0 01-.75-.75c0-1.5 1.125-2.719 2.585-3.5z" clipRule="evenodd" />
      <path d="M12.13 8.83a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06zM15.28 12.28a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 111.06-1.06l1.06 1.06zM18.43 15.73a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 111.06-1.06l1.06 1.06z" />
    </svg>
);
