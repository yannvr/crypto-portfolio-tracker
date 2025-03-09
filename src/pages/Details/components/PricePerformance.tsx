import React from 'react';
import { useCoinData } from '../../../hooks/useCoinData';

interface PricePerformanceProps {
  symbol: string;
}

const PricePerformance: React.FC<PricePerformanceProps> = ({ symbol }) => {
  const { coinStats, isLoading } = useCoinData(symbol);

  if (isLoading || !coinStats) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Price Performance</h4>
        <div className="grid grid-cols-4 gap-1">
          {['24h', '7d', '30d', '1y'].map((period) => (
            <div key={period} className="bg-gray-900 rounded-md py-1 px-2 text-center">
              <div className="text-xs text-gray-400">{period}</div>
              <div className="text-xs font-bold text-gray-500">--.--%</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const performanceData = [
    { label: '24h', value: coinStats.priceChangePercentage24h },
    { label: '7d', value: coinStats.priceChangePercentage7d },
    { label: '30d', value: coinStats.priceChangePercentage30d },
    { label: '1y', value: coinStats.priceChangePercentage1y },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-400 mb-2">Price Performance</h4>
      <div className="grid grid-cols-4 gap-1">
        {performanceData.map((item) => (
          <PricePerformanceItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
};

interface PricePerformanceItemProps {
  label: string;
  value: number;
}

const PricePerformanceItem: React.FC<PricePerformanceItemProps> = ({ label, value }) => {
  const isPositive = value >= 0;
  // Format exactly like the screenshot: -3.89% (no plus sign for positive values)
  const formattedValue = isPositive ?
    `${value.toFixed(2)}%` :
    `-${Math.abs(value).toFixed(2)}%`;

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
