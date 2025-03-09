import React from 'react';
import { useCoinData } from '../../../hooks/useCoinData';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

interface NetworkStatsProps {
  symbol: string;
}

const NetworkStats: React.FC<NetworkStatsProps> = ({ symbol }) => {
  const { coinStats, isLoading } = useCoinData(symbol);

  if (isLoading || !coinStats) {
    return (
      <div className="bg-black rounded-lg p-4 md:p-6 h-full">
        <h3 className="text-lg md:text-xl font-bold mb-4">{symbol} Network Statistics</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="bg-gray-800 h-5 w-24 rounded"></div>
              <div className="bg-gray-800 h-5 w-20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg p-4 md:p-6 h-full">
      <h3 className="text-lg md:text-xl font-bold mb-4">{symbol} Network Statistics</h3>

      <div className="space-y-4">
        <StatItem
          label="Market Cap"
          value={formatCurrency(coinStats.marketCap)}
          hasInfoIcon={true}
        />

        <StatItem
          label="Fully Diluted Valuation"
          value={formatCurrency(coinStats.fullyDilutedValuation)}
          hasInfoIcon={true}
        />

        <StatItem
          label="24 Hour Trading Vol"
          value={formatCurrency(coinStats.tradingVolume24h)}
        />

        <StatItem
          label="Circulating Supply"
          value={formatNumber(coinStats.circulatingSupply)}
          hasInfoIcon={true}
        />

        <StatItem
          label="Total Supply"
          value={formatNumber(coinStats.totalSupply)}
        />

        <StatItem
          label="Max Supply"
          value={coinStats.maxSupply !== null ? formatNumber(coinStats.maxSupply) : 'Unlimited'}
        />
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  hasInfoIcon?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, hasInfoIcon = false }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
      <div className="flex items-center">
        <span className="text-gray-400 text-sm">{label}</span>
        {hasInfoIcon && (
          <span className="ml-1 text-gray-500 cursor-help">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
      </div>
      <div className="text-white font-medium text-sm">
        {value}
      </div>
    </div>
  );
};

export default NetworkStats;
