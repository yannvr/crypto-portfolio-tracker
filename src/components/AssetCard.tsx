import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePriceStream } from '@store/usePriceStreamStore';
import PriceBadge from '@components/PriceBadge';
import { formatCurrency } from '../utils/formatters';

interface AssetCardProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
  };
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const navigate = useNavigate();
  const currentPrice = usePriceStream(asset.symbol);
  const totalValue = currentPrice ? currentPrice * asset.quantity : 0;

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/edit/${asset.id}`);
  };

  return (
    <Link to={`/details/${asset.id}`} className="block">
      <div className="relative bg-gray-900 text-white rounded-lg p-6 shadow-md
      hover:bg-gray-800 hover:shadow-lg hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300">

        <button
          onClick={handleEdit}
          aria-label={`Edit ${asset.symbol}`}
          className="cursor-pointer absolute top-2 right-2 text-gray-400 hover:text-gray-300"
        >
          {EditIcon}
        </button>

        <h3 className="font-bold text-2xl">{asset.symbol}</h3>

        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-2xl font-semibold">{formatCurrency(totalValue)}</p>
          </div>
          <PriceBadge currentPrice={currentPrice} />
        </div>

        <div className="text-gray-400 mt-2 text-sm">
          <p>Quantity: {asset.quantity}</p>
          <p>Current Price: ${currentPrice?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>
    </Link>
  );
};

// Custom SVG icon for the edit button to fit the design
const EditIcon = <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-5 h-5 text-gray-400 hover:text-gray-300"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M12 20h9" />
  <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
</svg>;


export default AssetCard;
