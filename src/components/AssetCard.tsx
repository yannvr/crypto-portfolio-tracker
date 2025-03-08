import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PriceBadge from './PriceBadge';
import usePortfolioStore from '../hooks/usePortfolioStore';

interface AssetCardProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
    previousPrice: number;
  };
  currentPrice: number | null;
  previousPrice: number;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, currentPrice: price, previousPrice }) => {
  console.log("🚀 ~ currentPrice:", price)
  const navigate = useNavigate();
  const { removeAsset } = usePortfolioStore();

  const handleEdit = () => {
    navigate(`/edit/${asset.id}`);
  };

  const handleDelete = () => {
    removeAsset(asset.id);
  };

  return (
    <div className="border p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{asset.symbol}</h3>
        <PriceBadge currentPrice={price} previousPrice={previousPrice} />
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
        <p className="text-gray-600">Current Price: ${price?.toLocaleString() || 'N/A'}</p>
        <p className="font-semibold">Total: ${(price ? price * asset.quantity : previousPrice * asset.quantity).toLocaleString()}</p>
      </Link>
    </div>
  );
};

export default AssetCard;
