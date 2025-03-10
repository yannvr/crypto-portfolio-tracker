import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { usePriceChart } from '../../../hooks/useAssetData';

export interface PriceChartCardProps {
  asset: { symbol: string };
  selectedDays: number;
  setSelectedDays: (days: number) => void;
}

export const PriceChartCard: React.FC<PriceChartCardProps> = ({
  asset,
  selectedDays,
  setSelectedDays
}) => {
  const symbol = asset?.symbol || '';
  const { chartData, loading: chartLoading } = usePriceChart(symbol, selectedDays);

  // Restrict the y-axis domain to the range of the chart data
  const calculateYAxisDomain = () => {
    if (!chartData.length) return [0, 0] as [number, number];
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.02;
    return [min - padding, max + padding] as [number, number];
  };

  const yAxisDomain = calculateYAxisDomain();

  return (
    <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Price History</h3>
        <div className="flex space-x-2">
          {[7, 14, 30, 90].map((days) => (
            <button
              key={days}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedDays === days
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedDays(days)}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow">
        {chartLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Loading chart data...
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                tick={false}
                axisLine={{ stroke: '#333' }}
                tickMargin={5}
              />
              <YAxis
                tick={{ fill: '#999', fontSize: 12 }}
                axisLine={{ stroke: '#333' }}
                domain={yAxisDomain}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No chart data available
          </div>
        )}
      </div>
    </div>
  );
};
