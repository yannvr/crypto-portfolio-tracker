import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePriceChart } from '../hooks/usePriceChart';

interface PriceChartProps {
  symbol: string;
}

export default function PriceChart({ symbol }: PriceChartProps) {
  const { chartData, isLoading, isError } = usePriceChart(symbol);

  if (isLoading) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center bg-black">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (isError || chartData.length === 0) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center bg-black">
        <div className="text-gray-400">
          {isError ? 'Error loading chart data' : 'No chart data available'}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData} className="bg-black">
        <XAxis dataKey="date" tick={{ fill: '#bbb' }} />
        <YAxis tick={{ fill: '#bbb' }} tickFormatter={(value) => `$${value.toFixed(2)}`} />
        <Tooltip
          contentStyle={{ backgroundColor: 'black', border: 'none', color: 'white' }}
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        <Line type="monotone" dataKey="price" stroke="#66ff66" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
