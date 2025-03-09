import React from 'react';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

interface NetworkStatsProps {
  symbol: string;
  coinData?: {
    coinStats: any;
    coinId: string | null;
    isLoading: boolean;
    isError: any;
  } | null;
}

const NetworkStats: React.FC<NetworkStatsProps> = ({ symbol, coinData }) => {
  const coinStats = coinData?.coinStats;
  const isLoading = coinData?.isLoading || !coinData;

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

  // Access market_data from the transformed structure
  const marketData = coinStats.market_data;

  // Check if we have the necessary data
  if (!marketData || Object.keys(marketData).length === 0) {
    return (
      <div className="bg-black rounded-lg p-4 md:p-6 h-full">
        <h3 className="text-lg md:text-xl font-bold mb-4">{symbol} Network Statistics</h3>
        <p className="text-gray-400">Market data not available for this asset.</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg p-4 md:p-6 h-full">
      <h3 className="text-lg md:text-xl font-bold mb-4">{symbol} Network Statistics</h3>

      <div className="space-y-3">
        {marketData.market_cap?.usd > 0 && (
          <StatItem
            label="Market Cap"
            value={formatCurrency(marketData.market_cap.usd)}
            hasInfoIcon
          />
        )}

        {marketData.fully_diluted_valuation?.usd > 0 && (
          <StatItem
            label="Fully Diluted Valuation"
            value={formatCurrency(marketData.fully_diluted_valuation.usd)}
            hasInfoIcon
          />
        )}

        {marketData.total_volume?.usd > 0 && (
          <StatItem
            label="24h Trading Volume"
            value={formatCurrency(marketData.total_volume.usd)}
          />
        )}

        {marketData.circulating_supply > 0 && (
          <StatItem
            label="Circulating Supply"
            value={`${formatNumber(marketData.circulating_supply)} ${symbol.toUpperCase()}`}
            hasInfoIcon
          />
        )}

        {marketData.total_supply > 0 && (
          <StatItem
            label="Total Supply"
            value={`${formatNumber(marketData.total_supply)} ${symbol.toUpperCase()}`}
          />
        )}

        {marketData.max_supply && (
          <StatItem
            label="Max Supply"
            value={`${formatNumber(marketData.max_supply)} ${symbol.toUpperCase()}`}
          />
        )}

        {Object.keys(marketData).length === 0 && (
          <div className="text-gray-400">No market data available</div>
        )}
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
    <div className="flex justify-between items-center py-2 border-b border-gray-800">
      <div className="flex items-center">
        <span className="text-gray-400">{label}</span>
        {hasInfoIcon && (
          <span className="ml-1 text-gray-500 cursor-help" title="More information">
            ⓘ
          </span>
        )}
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default NetworkStats;
