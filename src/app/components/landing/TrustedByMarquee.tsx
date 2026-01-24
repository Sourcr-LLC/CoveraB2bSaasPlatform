import { motion } from 'motion/react';

const COMPANIES = [
  'Roadr', 
  'Summit Properties', 
  'BuildRight', 
  'MedCore Health', 
  'FranchiseCo', 
  'Apex Group'
];

export default function TrustedByMarquee() {
  return (
    <div className="w-full overflow-hidden relative">
      {/* Gradient masks for smooth fade in/out */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#fafaf9] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#fafaf9] to-transparent z-10" />

      <motion.div 
        className="flex items-center gap-16 md:gap-24 whitespace-nowrap min-w-full"
        animate={{ 
          x: ["0%", "-50%"] 
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 15,
            ease: "linear",
          },
        }}
      >
        {/* 
           We need enough duplicates to fill the screen width + one full cycle.
           Using 8 copies ensures coverage even on very wide screens (Ultrawide/4K).
           Animating to -50% means we slide half the total width (4 sets), 
           which brings the second half (starting at set 5) to the start position.
        */}
        {[...COMPANIES, ...COMPANIES, ...COMPANIES, ...COMPANIES, ...COMPANIES, ...COMPANIES, ...COMPANIES, ...COMPANIES].map((name, index) => (
          <div 
            key={`${name}-${index}`} 
            className="text-xl md:text-2xl font-bold font-display text-slate-400 flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity cursor-default shrink-0"
          >
            {name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
