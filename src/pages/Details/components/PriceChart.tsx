import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePriceChart, TimeInterval } from '../../../hooks/usePriceChart';
import { useCoinData } from '../../../hooks/useCoinData';

interface PriceChartProps {
  symbol: string;
}

const timeIntervals: { label: string; value: TimeInterval }[] = [
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
];

export default function PriceChart({ symbol }: PriceChartProps) {
  const [selectedInterval, setSelectedInterval] = useState<TimeInterval>('1d');
  const { chartData, isLoading, isError } = usePriceChart(symbol, selectedInterval);
  const { coinStats } = useCoinData(symbol);

  // Map of intervals to their corresponding price change percentage properties
  const intervalToPriceChangeMap: Record<TimeInterval, (stats: typeof coinStats) => number> = {
    '1h': () => 0, // CoinGecko doesn't provide hourly change
    '4h': () => 0, // CoinGecko doesn't provide 4h change
    '1d': (stats) => stats?.priceChangePercentage24h || 0,
    '1w': (stats) => stats?.priceChangePercentage7d || 0,
    '1M': (stats) => stats?.priceChangePercentage30d || 0,
  };

  // Get the price change percentage based on the selected interval
  const getPriceChangePercentage = () => {
    if (!coinStats) return 0;

    // Get the appropriate function from the map and call it with coinStats
    const getChangeForInterval = intervalToPriceChangeMap[selectedInterval] ||
      intervalToPriceChangeMap['1d']; // Default to 1d if interval not found

    return getChangeForInterval(coinStats);
  };

  const priceChangePercentage = getPriceChangePercentage();
  const isPriceUp = priceChangePercentage >= 0;

  // Format the price change percentage like in the screenshot
  const formattedPriceChange = isPriceUp ?
    `${priceChangePercentage.toFixed(2)}%` :
    `-${Math.abs(priceChangePercentage).toFixed(2)}%`;

  // Calculates the value using the min and max values of the chart data
  const yAxisDomain = useMemo(() => {
    if (!chartData.length) return [0, 0];

    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    // Add 2% padding to min and max
    const padding = (max - min) * 0.02;
    return [min - padding, max + padding];
  }, [chartData]);

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-black rounded-lg">
        <div className="animate-pulse text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (isError || chartData.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center bg-black rounded-lg">
        <div className="text-gray-400">
          {isError ? 'Error loading chart data' : 'No chart data available'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg p-4">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-4">
        <div className="flex items-center mb-2 xs:mb-0">
          <h3 className="text-lg font-semibold text-white mr-2">Price Chart</h3>
          <span className={`text-sm ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
            {formattedPriceChange}
          </span>
        </div>
        <div className="flex space-x-1 bg-gray-900 rounded-lg p-1 self-start xs:self-auto">
          {timeIntervals.map((interval) => (
            <button
              key={interval.value}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedInterval === interval.value
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedInterval(interval.value)}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} className="bg-black">
          <XAxis
            dataKey="date"
            tick={{ fill: '#bbb', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={yAxisDomain}
            tick={{ fill: '#bbb', fontSize: 10 }}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
            width={60}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', color: 'white', borderRadius: '4px' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Line
            dataKey="price"
            stroke={isPriceUp ? "#66ff66" : "#ff6666"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: isPriceUp ? "#66ff66" : "#ff6666" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
