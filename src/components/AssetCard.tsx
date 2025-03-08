import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PriceBadge from './PriceBadge';
import usePortfolioStore from '../hooks/usePortfolioStore';
import { usePriceStream } from '../hooks/usePriceStreamStore';

interface AssetCardProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
  };
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const navigate = useNavigate();
  const { removeAsset } = usePortfolioStore();
  const currentPrice = usePriceStream(asset.symbol);

  const handleEdit = () => {
    navigate(`/edit/${asset.id}`);
  };

  const handleDelete = () => {
    removeAsset(asset.id);
  };

  return (
    <div className="border p-4 bg-card rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-primary">{asset.symbol}</h3>
        <PriceBadge currentPrice={currentPrice} />
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={handleEdit}
            aria-label={`Edit ${asset.symbol}`}
          >
            ✏️
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={handleDelete}
            aria-label={`Delete ${asset.symbol}`}
          >
            🗑️
          </button>
        </div>
      </div>
      <Link to={`/details/${asset.id}`} className="block mt-2">
        <p className="text-gray-600">Quantity: {asset.quantity}</p>
        <p className="text-gray-600">Current Price: ${currentPrice?.toLocaleString() || 'N/A'}</p>
        <p className="font-semibold">Total: ${(currentPrice ? currentPrice * asset.quantity : 0).toLocaleString()}</p>
      </Link>
    </div>
  );
};

export default AssetCard;
