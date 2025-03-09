import React from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { useCoinData } from '../hooks/useCoinData';

interface AssetStatsProps {
  symbol: string;
}

interface StatItemProps {
  label: string;
  value: string | number | null;
  tooltip?: string;
  hasDropdown?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, tooltip, hasDropdown = false }) => {
  return (
    <div className="border-b border-gray-700 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-gray-400 text-sm md:text-base">{label}</span>
        {tooltip && (
          <div className="ml-1 text-gray-500 cursor-help relative group">
            <span className="inline-block w-4 h-4 rounded-full border border-gray-500 text-xs text-center">i</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-xs text-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <div className="text-white font-medium text-sm md:text-base">
          {value !== null ? value : 'N/A'}
        </div>
        {hasDropdown && (
          <div className="ml-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

const AssetStats: React.FC<AssetStatsProps> = ({ symbol }) => {
  // Directly use the useCoinData hook
  const { coinStats: stats, isLoading, coinId, isError } = useCoinData(symbol);

  if (isLoading) {
    return (
      <div className="mt-8 bg-black rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h3 className="text-lg md:text-xl font-bold">{symbol} Network Statistics</h3>
          <div className="text-xs text-gray-400 mt-1 md:mt-0">
            Loading data from CoinGecko...
          </div>
        </div>
        <div className="animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-b border-gray-700 py-3 flex justify-between">
              <div className="bg-gray-800 h-4 w-16 md:w-24 rounded"></div>
              <div className="bg-gray-800 h-4 w-24 md:w-32 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="mt-8 bg-black rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h3 className="text-lg md:text-xl font-bold">{symbol} Network Statistics</h3>
          <div className="text-xs text-gray-400 mt-1 md:mt-0">
            Unable to load data
          </div>
        </div>
        <div className="text-gray-400 py-4 text-center">
          No data available for this asset. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-black rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h3 className="text-lg md:text-xl font-bold">{symbol} Network Statistics</h3>
        {coinId && (
          <div className="text-xs text-gray-400 mt-1 md:mt-0">
            Data from CoinGecko: {coinId}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
        <div>
          <StatItem
            label="Market Cap"
            value={formatCurrency(stats.marketCap)}
            tooltip="Total value of all coins in circulation"
            hasDropdown={true}
          />

          <StatItem
            label="Fully Diluted Valuation"
            value={formatCurrency(stats.fullyDilutedValuation)}
            tooltip="Market cap if the max supply was in circulation"
          />

          <StatItem
            label="24 Hour Trading Vol"
            value={formatCurrency(stats.tradingVolume24h)}
            tooltip="Total trading volume in the last 24 hours"
          />
        </div>

        <div>
          <StatItem
            label="Circulating Supply"
            value={formatNumber(stats.circulatingSupply)}
            tooltip="Number of coins currently in circulation"
            hasDropdown={true}
          />

          <StatItem
            label="Total Supply"
            value={formatNumber(stats.totalSupply)}
            tooltip="Total amount of coins created (minus any that have been verifiably burned)"
          />

          <StatItem
            label="Max Supply"
            value={stats.maxSupply !== null ? formatNumber(stats.maxSupply) : 'Unlimited'}
            tooltip="Maximum number of coins that will ever exist"
          />
        </div>
      </div>
    </div>
  );
};

export default AssetStats;
