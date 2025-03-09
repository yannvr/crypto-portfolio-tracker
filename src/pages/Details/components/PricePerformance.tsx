import React from 'react';

interface PricePerformanceProps {
  coinStats: any;
}

const PricePerformance: React.FC<PricePerformanceProps> = ({ coinStats }) => {
  if (!coinStats || !coinStats.market_data) {
    return (
      <div className="grid grid-cols-4 gap-1">
        {['24h', '7d', '30d', '1y'].map((period) => (
          <div key={period} className="bg-gray-900 rounded-md py-1 px-2 text-center">
            <div className="text-xs text-gray-400">{period}</div>
            <div className="text-xs font-bold text-gray-500">--.--%</div>
          </div>
        ))}
      </div>
    );
  }

  // Get the price change percentages from the transformed market_data
  const marketData = coinStats.market_data;
  const priceChange24h = marketData.price_change_percentage_24h || 0;
  const priceChange7d = marketData.price_change_percentage_7d || 0;
  const priceChange30d = marketData.price_change_percentage_30d || 0;
  const priceChange1y = marketData.price_change_percentage_1y || 0;

  return (
    <div className="grid grid-cols-4 gap-1">
      <PricePerformanceItem label="24h" value={priceChange24h} />
      <PricePerformanceItem label="7d" value={priceChange7d} />
      <PricePerformanceItem label="30d" value={priceChange30d} />
      <PricePerformanceItem label="1y" value={priceChange1y} />
    </div>
  );
};

interface PricePerformanceItemProps {
  label: string;
  value: number;
}

const PricePerformanceItem: React.FC<PricePerformanceItemProps> = ({ label, value }) => {
  const isPositive = value >= 0;
  const formattedValue = isPositive ?
    `+${value.toFixed(2)}%` :
    `${value.toFixed(2)}%`;

  return (
    <div className="bg-gray-900 rounded-md py-1 px-2 text-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {formattedValue}
      </div>
    </div>
  );
};

export default PricePerformance;
