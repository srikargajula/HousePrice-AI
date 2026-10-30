import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from 'recharts';
import { ActualVsPredictedPoint } from '../types';

interface ActualVsPredictedChartProps {
  data: ActualVsPredictedPoint[];
}

export const ActualVsPredictedChart: React.FC<ActualVsPredictedChartProps> = ({ data }) => {
  // Sort data or compute max bound for reference line
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.actual, d.predicted)),
    50
  );

  const referenceLineData = [
    { actual: 0, predicted: 0, ref: 0 },
    { actual: maxVal + 5, predicted: maxVal + 5, ref: maxVal + 5 },
  ];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="actual"
            name="Actual Price"
            unit="k"
            domain={[0, 55]}
            label={{ value: 'Actual Test Price ($1000s)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            type="number"
            dataKey="predicted"
            name="Predicted Price"
            unit="k"
            domain={[0, 55]}
            label={{ value: 'Predicted Price ($1000s)', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: '#64748b' }}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const p = payload[0].payload as ActualVsPredictedPoint;
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                    <p className="font-bold text-slate-200">Sample #{p.id}</p>
                    <p className="text-emerald-400">Actual: ${p.actual}k (${p.actual_dollars?.toLocaleString()})</p>
                    <p className="text-blue-400">Predicted: ${p.predicted}k (${p.predicted_dollars?.toLocaleString()})</p>
                    <p className="text-amber-400">Error: ${p.residual}k (Abs: ${p.abs_error}k)</p>
                  </div>
                );
              }
              return null;
            }}
          />
          {/* Reference y = x diagonal line */}
          <Line
            data={referenceLineData}
            dataKey="ref"
            stroke="#94a3b8"
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
            legendType="none"
          />
          {/* Actual scatter points */}
          <Scatter
            name="Held-out Test Samples"
            data={data}
            fill="#2563eb"
            fillOpacity={0.65}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
