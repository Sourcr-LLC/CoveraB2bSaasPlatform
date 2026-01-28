import { Star } from 'lucide-react';

interface TrustScoreProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export function TrustScore({ className = '', theme = 'light' }: TrustScoreProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#1a1a1a]';
  const mutedColor = isDark ? 'text-slate-400' : 'text-slate-500';
  
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-full shadow-sm ${className}`}>
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 bg-[#00b67a] rounded-sm flex items-center justify-center">
            <Star className="w-3.5 h-3.5 text-white fill-current" />
        </div>
        <span className={`font-bold text-sm ${textColor} ml-1`}>Trustpilot</span>
      </div>
      
      <div className="w-px h-4 bg-slate-200" />
      
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-4 h-4 bg-[#00b67a] flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-white fill-current" />
            </div>
          ))}
          <div className="w-4 h-4 bg-[#dcdce6] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 w-[10%] bg-[#00b67a]" />
             <Star className="w-2.5 h-2.5 text-white fill-current relative z-10" />
          </div>
        </div>
        <span className={`text-sm font-medium ${textColor}`}>
          4.1
        </span>
      </div>
    </div>
  );
}

export function TrustScoreMinimal({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="font-semibold text-[#1a1a1a]">Excellent</span>
        <div className="flex gap-0.5 mx-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center">
              <Star className="w-3 h-3 text-white fill-current" />
            </div>
          ))}
          <div className="w-5 h-5 bg-[#dcdce6] flex items-center justify-center relative">
             <div className="absolute left-0 top-0 bottom-0 w-[10%] bg-[#00b67a]" />
             <Star className="w-3 h-3 text-white fill-current relative z-10" />
          </div>
        </div>
        <span className="text-slate-500 text-sm">4.1 out of 5</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <Star className="w-3 h-3 text-[#00b67a] fill-current" />
        <span>Trustpilot</span>
      </div>
    </div>
  );
}
