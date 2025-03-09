import React from 'react';
import { formatCurrency } from '../../../utils/utils';

interface PriceBadgeProps {
  price: number;
  priceChange?: number;
  showChange?: boolean;
}

const PriceBadge: React.FC<PriceBadgeProps> = ({
  price,
  priceChange = 0,
  showChange = true
}) => {
  // Determine color based on price change
  const getColorClass = () => {
    if (priceChange > 0) return 'text-green-500';
    if (priceChange < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  // Format the price change with a + or - sign
  const formattedChange = () => {
    const sign = priceChange > 0 ? '+' : '';
    return `${sign}${priceChange.toFixed(2)}%`;
  };

  return (
    <div className="flex flex-col items-end">
      <span className="font-medium">{formatCurrency(price)}</span>
      {showChange && priceChange !== undefined && (
        <span className={`text-xs ${getColorClass()}`}>
          {formattedChange()}
        </span>
      )}
    </div>
  );
};

export default PriceBadge;
