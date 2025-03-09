import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/utils';
import { usePriceStore } from '../../../hooks/useAssetData';
import PriceBadge from './PriceBadge';

interface AssetCardProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
  };
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  // Get price and price change directly from the store
  const prices = usePriceStore(state => state.prices);
  const priceChanges = usePriceStore(state => state.priceChanges);

  const currentPrice = prices[asset.symbol] || 0;
  const priceChange = priceChanges[asset.symbol] || 0;
  const totalValue = currentPrice * asset.quantity;

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:bg-gray-800/80 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">{asset.symbol}</h3>
        <div className="flex gap-2">
          <Link to={`/edit/${asset.id}`}>
            <button className="text-gray-400 hover:text-white">Edit</button>
          </Link>
          <Link to={`/details/${asset.id}`}>
            <button className="text-gray-400 hover:text-white">Details</button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-400">Quantity: {asset.quantity}</p>
        <p className="text-lg font-medium">
          {formatCurrency(totalValue)}
        </p>
      </div>

      <div className="flex justify-between items-center mt-1">
        <p className="text-sm text-gray-400">Price:</p>
        <PriceBadge price={currentPrice} priceChange={priceChange} />
      </div>
    </div>
  );
};

export default AssetCard;
