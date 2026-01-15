import React from 'react';

export const PremiumCheck = ({ className }: { className?: string }) => (
  <div className={`w-5 h-5 mt-0.5 rounded-full flex items-center justify-center bg-emerald-100/50 flex-shrink-0 ${className || ''}`}>
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className="w-3.5 h-3.5 text-emerald-600"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);
