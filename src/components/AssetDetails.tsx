import React from 'react';
import { useNavigate } from 'react-router-dom';
import PriceChart from './PriceChart';
import { usePriceStream } from '../hooks/usePriceStreamStore';

interface AssetDetailsProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
  };
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const navigate = useNavigate();
  const currentPrice = usePriceStream(asset.symbol);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 w-[90%] max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-primary">{asset.symbol} Details</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Quantity:</span>
          <span>{asset.quantity}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Current Price:</span>
          <span>{currentPrice ? `$${currentPrice.toFixed(2)}` : 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total Value:</span>
          <span>{currentPrice ? `$${(currentPrice * asset.quantity).toFixed(2)}` : 'N/A'}</span>
        </div>
      </div>

      <div className="h-[300px]">
        <PriceChart symbol={asset.symbol} />
      </div>

      <button
        className="mt-6 w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-600"
        onClick={handleBack}
      >
        Back to Home
      </button>
    </div>
  );
}
