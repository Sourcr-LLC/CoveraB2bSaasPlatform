import React from 'react';
import { Check } from 'lucide-react';

export const PremiumCheck = ({ className }: { className?: string }) => (
  <div className={`w-5 h-5 mt-0.5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm ${className || ''}`}>
    <Check className="w-3 h-3 text-white" strokeWidth={3} />
  </div>
);
