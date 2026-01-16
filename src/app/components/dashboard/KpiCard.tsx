import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  percentageColor?: string;
  bgTint: string;
  borderColor: string;
  icon?: LucideIcon;
  isAtRisk?: boolean;
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
  isAtRisk = false
}) => {
  return (
    <div
      className={`rounded-xl border p-4 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-[130px]`}
      style={{
        backgroundColor: bgTint,
        borderColor: borderColor,
        backdropFilter: 'blur(12px)',
        boxShadow: 'var(--shadow-card, var(--shadow-md))'
      }}
    >
      {/* Header: Label + Trend/Icon */}
      <div className="flex justify-between items-center h-5">
        <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: 'var(--foreground-muted)', opacity: 0.8, letterSpacing: '0.05em' }}>
          {label}
        </div>
        {(change || Icon) && (
          <div 
            className="text-[11px] flex items-center gap-1 px-1.5 h-5 rounded-full bg-opacity-10"
            style={{ 
              color: percentageColor,
              fontWeight: 700,
              backgroundColor: percentageColor ? `${percentageColor}15` : 'transparent'
            }}
          >
            {Icon ? (
              <Icon className="w-3 h-3" />
            ) : (
              <>
                {trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {trend === 'neutral' && <Minus className="w-3 h-3" />}
              </>
            )}
            {change && <span>{change}</span>}
          </div>
        )}
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-3">
        <div className="tracking-tighter" style={{ color: 'var(--foreground)', fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
          {value}
        </div>
      </div>

      {/* Subtext */}
      <div className="text-[11px] font-medium" style={{ color: 'var(--foreground-subtle)' }}>
        {subtext}
      </div>
    </div>
  );
};
