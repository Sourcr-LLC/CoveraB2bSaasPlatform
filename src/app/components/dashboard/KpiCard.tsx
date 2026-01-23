import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  percentageColor?: string;
  bgTint: string;
  borderColor: string;
  icon?: LucideIcon;
  isAtRisk?: boolean;
  compact?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  change,
  trend,
  percentageColor,
  bgTint,
  borderColor,
  icon: Icon,
  isAtRisk = false,
  compact = false
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 flex flex-col justify-between ${compact ? 'h-auto min-h-[100px] p-4' : 'min-h-[140px] p-4 md:p-5'}`}
    >
      {/* Background Glow Effect */}
      <div 
        className="absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: percentageColor || '#cbd5e1' }}
      />
      
      <div className="flex justify-between items-start z-10 gap-3">
        <div className={`${compact ? 'text-[10px]' : 'text-[10px] md:text-xs'} font-bold uppercase tracking-wide text-slate-500 mt-1`}>
          {label}
        </div>
        
        {Icon && (
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-transform group-hover:scale-110 duration-300"
            style={{ 
              backgroundColor: bgTint === 'var(--card)' ? '#f8fafc' : bgTint,
              color: percentageColor || '#64748b'
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="z-10 mt-auto pt-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl md:text-3xl font-bold text-slate-900">
            {value}
          </span>
          {change && (
            <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${
              trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
              trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
            }`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
              {change}
            </div>
          )}
        </div>
        
        {subtext && (
          <p className="text-xs md:text-sm font-medium text-slate-500 leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
