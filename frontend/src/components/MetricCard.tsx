import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'blue' | 'emerald' | 'amber' | 'purple';
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'blue',
  tooltip,
}) => {
  const badgeStyles = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  }[badgeColor];

  return (
    <div
      title={tooltip}
      className="card-hover bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-extrabold text-navy-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </div>

      {badge && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border ${badgeStyles}`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
};
