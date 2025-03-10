import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercent } from '../utils/utils';
import Button from '../components/Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useCoinData, usePriceChart } from '../hooks/useAssetData';

// Types
export interface PriceChangeProps {
  value: number;
  label: string;
}

export interface StatItemProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

// Reusable components
export const PriceChange: React.FC<PriceChangeProps> = ({ value, label }) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className={`text-xl font-bold ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
      {formatPercent(value)}
    </p>
  </div>
);

export const StatItem: React.FC<StatItemProps> = ({ label, value, valueClassName = '' }) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className={`text-xl font-bold ${valueClassName}`}>
      {value}
    </p>
  </div>
);

// Card components
export const AssetInfoCard: React.FC<{
  asset: { symbol: string; quantity: number };
}> = ({ asset }) => {
  const symbol = asset?.symbol || '';
  const { data: coinData, loading: coinLoading } = useCoinData(symbol);

  const isLoading = !coinData || coinLoading;
  const currentPrice = coinData?.market_data?.current_price?.usd || 0;
  const totalValue = currentPrice * asset.quantity;

  return (
    <div className="lg:col-span-1 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        {coinData?.image?.small ? (
          <img
            src={coinData.image.small}
            alt={coinData.name}
            className="w-10 h-10"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            {asset.symbol.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{coinData?.name || asset.symbol}</h2>
          <p className="text-gray-400">{asset.symbol}</p>
        </div>
      </div>

      <div className="space-y-4">
        <StatItem label="Your Holdings" value={`${asset.quantity} ${asset.symbol}`} />
        {isLoading ? (
          <div className="py-2">
            <p className="text-gray-400">Current Price</p>
            <p className="text-xl font-bold text-gray-300">Loading...</p>
          </div>
        ) : (
          <StatItem label="Current Price" value={formatCurrency(currentPrice)} />
        )}
        {isLoading ? (
          <div className="py-2">
            <p className="text-gray-400">Total Value</p>
            <p className="text-xl font-bold text-gray-300">Loading...</p>
          </div>
        ) : (
          <StatItem label="Total Value" value={formatCurrency(totalValue)} />
        )}
        {isLoading ? (
          <div className="py-2">
            <p className="text-gray-400">24h Change</p>
            <p className="text-xl font-bold text-gray-300">Loading...</p>
          </div>
        ) : (
          <PriceChange
            label="24h Change"
            value={coinData?.market_data?.price_change_percentage_24h || 0}
          />
        )}
      </div>
    </div>
  );
};

export const PriceChartCard: React.FC<{
  asset: { symbol: string };
  selectedDays: number;
  setSelectedDays: (days: number) => void;
}> = ({ asset, selectedDays, setSelectedDays }) => {
  const symbol = asset?.symbol || '';
  const { chartData, loading: chartLoading } = usePriceChart(symbol, selectedDays);

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
    <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
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

      <div className="h-80">
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

export const MarketStatsCard: React.FC<{
  asset: { symbol: string }
}> = ({ asset }) => {
  const symbol = asset?.symbol || '';
  const { data: coinData, loading: coinLoading } = useCoinData(symbol);

  return (
    <div className="lg:col-span-3 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Market Stats</h3>
      {coinLoading ? (
        <div className="text-center py-4 text-gray-400">Loading market stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatItem
            label="Market Cap"
            value={formatCurrency(coinData?.market_data?.market_cap?.usd || 0)}
          />
          <PriceChange
            label="7d Change"
            value={coinData?.market_data?.price_change_percentage_7d || 0}
          />
          <PriceChange
            label="30d Change"
            value={coinData?.market_data?.price_change_percentage_30d || 0}
          />
        </div>
      )}
    </div>
  );
};

export const LoadingState: React.FC = () => (
  <div className="text-center py-12">
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-700 rounded mx-auto mb-4"></div>
      <div className="h-4 w-64 bg-gray-700 rounded mx-auto"></div>
    </div>
    <p className="mt-4 text-gray-400">Loading asset data...</p>
  </div>
);

export const ErrorState: React.FC<{ message?: string }> = ({ message = "Error loading data. Please try again later." }) => (
  <div className="text-center py-12 text-red-500">
    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p>{message}</p>
  </div>
);

export const AssetNotFound: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex justify-center items-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Asset not found</h2>
      <Link to="/">
        <Button>Back to Portfolio</Button>
      </Link>
    </div>
  </div>
);
