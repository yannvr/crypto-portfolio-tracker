import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/utils';
import { usePriceStore } from '../../../hooks/useAssetData';
import PriceBadge from './PriceBadge';
import Button from '@components/Button';

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
  const connectionStatus = usePriceStore(state => state.connectionStatus);

  const currentPrice = prices[asset.symbol] || 0;
  const priceChange = priceChanges[asset.symbol] || 0;
  const totalValue = currentPrice * asset.quantity;
  const isLoading = currentPrice === 0;
  const isConnected = connectionStatus[asset.symbol] === 'connected';

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 hover:bg-gray-800/80 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">{asset.symbol}</h3>
        <div className="flex gap-2">
          <Link to={`/edit/${asset.id}`}>
            <Button secondary>Edit</Button>
          </Link>
          <Link to={`/details/${asset.id}`}>
            <Button secondary>Details</Button>
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
        {isLoading ? (
          <span className="text-gray-400 text-sm">Loading price...</span>
        ) : (
          <PriceBadge
            price={currentPrice}
            priceChange={priceChange}
          />
        )}
      </div>
    </div>
  );
};

export default AssetCard;
