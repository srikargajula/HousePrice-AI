import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ModelEvaluationDetail } from '../types';

interface ModelComparisonChartProps {
  models: Record<string, ModelEvaluationDetail>;
}

export const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ models }) => {
  const chartData = Object.entries(models).map(([name, detail]) => ({
    name: name.replace(' Regressor', ''),
    fullName: name,
    r2Score: Number((detail.test_metrics.r2_score * 100).toFixed(1)),
    mae: Number(detail.test_metrics.mae.toFixed(2)),
    rmse: Number(detail.test_metrics.rmse.toFixed(2)),
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} />
          <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            unit="%"
            tick={{ fontSize: 11, fill: '#2563eb' }}
          />
          <Tooltip
            formatter={(value: any, name: any) => {
              if (name === 'R² Score (%)') return [`${value}%`, name];
              return [`$${value}k`, name];
            }}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              border: 'none',
              color: '#f8fafc',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar yAxisId="right" dataKey="r2Score" name="R² Score (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="mae" name="MAE ($k)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="left" dataKey="rmse" name="RMSE ($k)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
