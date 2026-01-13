import { motion } from 'motion/react';

interface PremiumLoaderProps {
  fullScreen?: boolean;
}

export default function PremiumLoader({ fullScreen = false }: PremiumLoaderProps) {
  return (
    <div 
      className={`flex items-center justify-center ${fullScreen ? 'h-screen w-screen' : 'min-h-[400px] w-full'}`}
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ 
            borderColor: 'var(--border)',
            borderTopColor: 'var(--primary)',
          }}
        />
      </div>
    </div>
  );
}