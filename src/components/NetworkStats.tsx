import React from 'react';
import { CoinStats } from '../services/coinGeckoService';

interface NetworkStatsProps {
  stats: CoinStats | null;
  isLoading: boolean;
  symbol?: string;
}

interface StatItemProps {
  label: string;
  value: string | number | null;
  tooltip?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, tooltip }) => {
  return (
    <div className="border-b border-gray-700 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-gray-400">{label}</span>
        {tooltip && (
          <div className="ml-1 text-gray-500 cursor-help relative group">
            <span className="inline-block w-4 h-4 rounded-full border border-gray-500 text-xs text-center">i</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-xs text-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="text-white font-medium">
        {value !== null ? value : 'N/A'}
      </div>
    </div>
  );
};

const NetworkStats: React.FC<NetworkStatsProps> = ({ stats, isLoading, symbol }) => {
  if (isLoading) {
    return (
      <div className="mt-8 bg-black rounded-lg p-4">
        <h3 className="text-xl font-bold mb-4">Network Statistics</h3>
        <div className="animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-b border-gray-700 py-3 flex justify-between">
              <div className="bg-gray-800 h-4 w-24 rounded"></div>
              <div className="bg-gray-800 h-4 w-32 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return `$${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(2)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  const formatSupply = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="mt-8 bg-black rounded-lg p-4">
      <h3 className="text-xl font-bold mb-4">Network Statistics</h3>

      <StatItem
        label="Market Cap"
        value={formatNumber(stats.marketCap)}
        tooltip="Total value of all coins in circulation"
      />

      <StatItem
        label="Fully Diluted Valuation"
        value={formatNumber(stats.fullyDilutedValuation)}
        tooltip="Market cap if the max supply was in circulation"
      />

      <StatItem
        label="24 Hour Trading Vol"
        value={formatNumber(stats.tradingVolume24h)}
        tooltip="Total trading volume in the last 24 hours"
      />

      <StatItem
        label="Circulating Supply"
        value={formatSupply(stats.circulatingSupply)}
        tooltip="Number of coins currently in circulation"
      />

      <StatItem
        label="Total Supply"
        value={formatSupply(stats.totalSupply)}
        tooltip="Total amount of coins created (minus any that have been verifiably burned)"
      />

      <StatItem
        label="Max Supply"
        value={stats.maxSupply !== null ? formatSupply(stats.maxSupply) : 'Unlimited'}
        tooltip="Maximum number of coins that will ever exist"
      />
    </div>
  );
};

export default NetworkStats;
