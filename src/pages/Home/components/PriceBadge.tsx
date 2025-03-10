import { formatCurrency } from '../../../utils/utils';

interface PriceBadgeProps {
  price: number;
  priceChange?: number;
}

const PriceBadge: React.FC<PriceBadgeProps> = ({
  price,
  priceChange = 0,
}) => {
  // Determine color based on price change
  const getColorClass = () => {
    if (!priceChange || isNaN(priceChange)) return 'text-gray-400';
    if (priceChange > 0) return 'text-green-500';
    if (priceChange < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  // Format the price change with a + or - sign
  const formattedChange = () => {
    if (!priceChange || isNaN(priceChange)) return '0.00%';
    const sign = priceChange > 0 ? '+' : '';
    return `${sign}${priceChange.toFixed(2)}%`;
  };

  return (
    <div className="flex flex-col items-end">
      <span className="font-medium">{formatCurrency(price || 0)}</span>
      <span className={`text-xs ${getColorClass()}`}>
        {formattedChange()}
      </span>
    </div>
  );
};

export default PriceBadge;
