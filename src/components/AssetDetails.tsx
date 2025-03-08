import React from 'react';
import { useNavigate } from 'react-router-dom';
import PriceChart from './PriceChart';
import usePriceStream from '../hooks/usePriceStream';

interface AssetDetailsProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
    previousPrice: number;
  };
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">{asset.symbol} Details</h3>
      <p>Quantity: {asset.quantity}</p>
      <p>Current Price: ${asset.previousPrice?.toFixed(2) || 'N/A'}</p>
      <p>Total Value: ${(asset.previousPrice ? asset.previousPrice * asset.quantity : asset.previousPrice * asset.quantity).toFixed(2)}</p>
      <PriceChart symbol={asset.symbol} />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleBack}
      >
        Back to Home
      </button>
    </div>
  );
}
