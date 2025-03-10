import { useCoinData } from '../hooks/useAssetData';
import { formatCurrency, formatPercent } from '../utils/utils';

interface MarketStatsProps {
  symbol: string;
}

// Extended interface for additional properties we need
interface ExtendedCoinData {
  id?: string;
  name?: string;
  symbol?: string;
  market_data?: {
    current_price?: { usd: number };
    market_cap?: { usd: number };
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    total_volume?: { usd: number };
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
    fully_diluted_valuation?: { usd: number };
  };
}

const MarketStats: React.FC<MarketStatsProps> = ({ symbol }) => {
  const { data, loading } = useCoinData(symbol);
  // Cast to extended interface to handle additional properties
  const coinData = data as unknown as ExtendedCoinData;

  if (loading) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 h-full">
        <h3 className="text-xl font-bold mb-4">Market Stats</h3>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="bg-gray-800 h-4 w-24 rounded mb-2"></div>
                <div className="bg-gray-800 h-6 w-32 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!coinData) {
    return (
      <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 h-full">
        <h3 className="text-xl font-bold mb-4">Market Stats</h3>
        <p className="text-gray-400">No market data available for this asset.</p>
      </div>
    );
  }

  const marketData = coinData.market_data;

  // Define the stats to display
  const stats = [
    {
      label: 'Market Cap',
      value: formatCurrency(marketData?.market_cap?.usd || 0),
    },
    {
      label: 'Trading Volume (24h)',
      value: formatCurrency(marketData?.total_volume?.usd || 0),
    },
    {
      label: 'Circulating Supply',
      value: marketData?.circulating_supply
        ? `${marketData.circulating_supply.toLocaleString()} ${symbol.toUpperCase()}`
        : 'N/A',
    },
    {
      label: 'Total Supply',
      value: marketData?.total_supply
        ? `${marketData.total_supply.toLocaleString()} ${symbol.toUpperCase()}`
        : 'N/A',
    },
    {
      label: 'Max Supply',
      value: marketData?.max_supply
        ? `${marketData.max_supply.toLocaleString()} ${symbol.toUpperCase()}`
        : 'N/A',
    },
    {
      label: 'Fully Diluted Valuation',
      value: formatCurrency(marketData?.fully_diluted_valuation?.usd || 0),
    },
  ];

  // Define the price changes to display
  const priceChanges = [
    {
      label: '24h Change',
      value: marketData?.price_change_percentage_24h || 0,
    },
    {
      label: '7d Change',
      value: marketData?.price_change_percentage_7d || 0,
    },
    {
      label: '30d Change',
      value: marketData?.price_change_percentage_30d || 0,
    },
  ];

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4">Market Stats</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Market stats */}
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-gray-400">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}

        {/* Price changes */}
        {priceChanges.map((change) => (
          <div key={change.label}>
            <p className="text-gray-400">{change.label}</p>
            <p className={`text-xl font-bold ${change.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercent(change.value)}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MarketStats;
