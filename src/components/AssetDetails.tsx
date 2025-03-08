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
    <div>
      <h3 className="text-lg font-semibold">{asset.symbol} Details</h3>
      <p>Quantity: {asset.quantity}</p>
      <p>Current Price: ${currentPrice?.toFixed(2) || 'N/A'}</p>
      <p>Total Value: ${(currentPrice ? currentPrice * asset.quantity : 0).toFixed(2)}</p>
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
