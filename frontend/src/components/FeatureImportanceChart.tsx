import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FeatureImportanceItem } from '../types';

interface FeatureImportanceChartProps {
  data: FeatureImportanceItem[];
  maxItems?: number;
}

export const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data, maxItems = 10 }) => {
  const chartData = data
    .slice(0, maxItems)
    .map((item) => ({
      feature: item.label,
      code: item.feature.toUpperCase(),
      importancePct: item.importance_pct,
      importance: item.importance,
    }))
    .reverse();

  // Subtle gradient colors for top features
  const getBarColor = (index: number, total: number) => {
    // Reverse because array was reversed for bottom-to-top display
    const rank = total - 1 - index;
    if (rank === 0) return '#2563eb'; // Deep Blue for #1
    if (rank === 1) return '#0284c7'; // Sky for #2
    if (rank === 2) return '#0ea5e9'; // Teal for #3
    return '#94a3b8'; // Slate for others
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            domain={[0, 'auto']}
            unit="%"
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            type="category"
            dataKey="code"
            tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
            width={75}
          />
          <Tooltip
            formatter={(value: any) => [`${value}% relative importance`, 'Attribution Weight']}
            labelFormatter={(label: any, payload: any) => {
              if (payload && payload.length > 0) {
                return `${payload[0].payload.feature} (${label})`;
              }
              return label;
            }}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="importancePct" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index, chartData.length)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
