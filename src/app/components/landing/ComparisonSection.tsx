import { useState, useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, Globe, FileText, ArrowRight, Mail, Clock, ShieldCheck, Upload, RefreshCw } from 'lucide-react';

export default function ComparisonSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-cycle on mobile or if user hasn't interacted
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
    if (index !== null) {
      setIsAutoPlaying(false);
      setActiveIndex(index);
    }
  };

  const steps = [
    {
      id: 0,
      old: "You email vendor asking for COI",
      new: "You send one \"Magic Link\"",
      oldIcon: Mail,
      newIcon: ArrowRight,
      oldHighlight: "text-red-500",
      newHighlight: "text-emerald-400"
    },
    {
      id: 1,
      old: "Vendor emails back a PDF (eventually)",
      new: "Vendor uploads COI, Contracts & W9",
      oldIcon: Clock,
      newIcon: Upload,
      oldHighlight: "text-red-500",
      newHighlight: "text-emerald-400"
    },
    {
      id: 2,
      old: "You open PDF, type dates into Excel",
      new: "AI verifies coverage & milestones",
      oldIcon: FileText,
      newIcon: ShieldCheck,
      oldHighlight: "text-red-500",
      newHighlight: "text-emerald-400"
    },
    {
      id: 3,
      old: "Repeat 100x per month",
      new: "Vendor updates their own expired docs",
      oldIcon: RefreshCw,
      newIcon: Globe,
      oldHighlight: "text-red-500",
      newHighlight: "text-emerald-400"
    }
  ];

  return (
    <section className="py-16 md:py-32 px-4 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3A4F6A] text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
             <TrendingUp className="w-3 h-3" />
             The Problem
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-6">
            The Old Way is <span className="text-[#3A4F6A]">Broken</span>
          </h2>
          <p className="text-lg text-slate-600">
            See the difference automation makes. 
            <span className="hidden md:inline"> Hover over the steps to compare.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
          
          {/* Connecting Lines (Desktop Only) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 hidden md:flex flex-col items-center justify-center gap-1 z-20">
             <div className="w-px h-full bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 absolute" />
             <div className="bg-white border border-slate-200 rounded-full p-2 relative z-10 shadow-sm">
                <ArrowRight className="w-4 h-4 text-slate-400" />
             </div>
          </div>

          {/* Old Way Card */}
          <div 
            className="p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-100 relative group transition-all duration-300"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            <div className="absolute top-6 right-6 md:top-8 md:right-8 text-slate-300">
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              Manual Admin
              <span className="text-sm font-normal text-slate-500">(Bottleneck)</span>
            </h3>

            <div className="space-y-2 mb-10">
              {steps.map((step, idx) => {
                const isActive = hoveredIndex !== null ? hoveredIndex === idx : activeIndex === idx;
                
                return (
                  <div
                    key={idx}
                    className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-white border-red-100 shadow-sm ring-1 ring-red-50' 
                        : 'bg-transparent border-transparent hover:bg-white/50'
                    } ${hoveredIndex !== null && !isActive ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}
                    onMouseEnter={() => handleHover(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full transition-colors duration-300 ${isActive ? 'bg-red-400' : 'bg-slate-300'}`} />
                      <span className={`text-sm md:text-base transition-colors duration-300 ${isActive ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                        {step.old}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual: Costly & Slow */}
            <div className="h-48 bg-slate-200/50 rounded-xl flex items-center justify-center border border-slate-200 border-dashed relative overflow-hidden group/visual">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="grid grid-cols-2 gap-4">
                   <div className="transform rotate-3 group-hover/visual:rotate-6 transition-transform duration-700">
                     <FileText className="w-16 h-16 text-slate-400" />
                   </div>
                   <div className="transform -rotate-6 group-hover/visual:-rotate-12 transition-transform duration-700 delay-75">
                     <FileText className="w-16 h-16 text-slate-400" />
                   </div>
                   <div className="transform rotate-6 group-hover/visual:rotate-12 transition-transform duration-700 delay-100">
                     <FileText className="w-16 h-16 text-slate-400" />
                   </div>
                   <div className="transform -rotate-3 group-hover/visual:-rotate-6 transition-transform duration-700 delay-150">
                     <FileText className="w-16 h-16 text-slate-400" />
                   </div>
                </div>
              </div>
              
              <div 
                className={`flex flex-col items-center gap-2 relative z-10 transition-all duration-300 ${hoveredIndex !== null ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-slate-500 rotate-90" />
                </div>
                <span className="text-slate-600 font-medium">Costly & Slow</span>
              </div>
            </div>
          </div>

          {/* New Way Card */}
          <div 
            className="p-6 md:p-8 rounded-3xl bg-[#3A4F6A] text-white relative shadow-2xl shadow-[#3A4F6A]/20 overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div 
              className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow"
            />

            <div className="absolute top-6 right-6 md:top-8 md:right-8 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-8 flex flex-wrap items-center gap-2 pr-12 relative z-10">
              The Network Effect
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium backdrop-blur-sm whitespace-nowrap border border-emerald-500/20">
                Automated
              </span>
            </h3>

            <div className="space-y-2 mb-10 relative z-10">
              {steps.map((step, idx) => {
                const isActive = hoveredIndex !== null ? hoveredIndex === idx : activeIndex === idx;
                
                return (
                  <div
                    key={idx}
                    className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-white/10 border-emerald-500/30 shadow-lg backdrop-blur-sm' 
                        : 'bg-transparent border-transparent hover:bg-white/5'
                    } ${hoveredIndex !== null && !isActive ? 'opacity-40 blur-[1px]' : 'opacity-100'}`}
                    onMouseEnter={() => handleHover(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-slate-400/50'}`} />
                      <span className={`text-sm md:text-base transition-colors duration-300 ${isActive ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {step.new}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual: Vendor Portal */}
            <div className="h-48 bg-white/5 rounded-xl backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A4F6A] via-transparent to-transparent opacity-50" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Vendor Portal</div>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs text-emerald-400/80 font-medium">Active now</span>
                  </div>
                </div>
              </div>

              {/* Animated Progress Bar matching the active step */}
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Processing uploads...</span>
                  <span>{hoveredIndex !== null ? 'Paused' : 'Auto-pilot'}</span>
                </div>
                
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                   <div 
                     className={`h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-in-out ${hoveredIndex === null ? 'animate-progress' : ''}`}
                     style={{ 
                       width: hoveredIndex !== null ? `${(hoveredIndex + 1) * 25}%` : undefined,
                       opacity: hoveredIndex !== null ? 1 : 0.8
                     }}
                   />
                </div>
                
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{ 
                        backgroundColor: (hoveredIndex !== null ? hoveredIndex >= i : activeIndex >= i) 
                          ? 'rgba(52, 211, 153, 0.6)' 
                          : 'rgba(255, 255, 255, 0.1)' 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}