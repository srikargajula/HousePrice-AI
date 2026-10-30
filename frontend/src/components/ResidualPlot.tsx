import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ActualVsPredictedPoint } from '../types';

interface ResidualPlotProps {
  data: ActualVsPredictedPoint[];
}

export const ResidualPlot: React.FC<ResidualPlotProps> = ({ data }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="predicted"
            name="Predicted Price"
            unit="k"
            domain={[0, 55]}
            label={{ value: 'Fitted / Predicted Price ($1000s)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <YAxis
            type="number"
            dataKey="residual"
            name="Residual Error"
            unit="k"
            label={{ value: 'Residual (Actual - Predicted) $k', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: '#64748b' }}
            tick={{ fontSize: 11, fill: '#64748b' }}
          />
          <ReferenceLine y={0} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const p = payload[0].payload as ActualVsPredictedPoint;
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                    <p className="font-bold text-slate-200">Test Observation #{p.id}</p>
                    <p className="text-blue-400">Predicted: ${p.predicted}k</p>
                    <p className={p.residual >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      Residual: {p.residual > 0 ? `+${p.residual}` : p.residual}k
                    </p>
                    <p className="text-slate-400">Actual Value: ${p.actual}k</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter
            name="Residuals"
            data={data}
            fill="#0284c7"
            fillOpacity={0.7}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
