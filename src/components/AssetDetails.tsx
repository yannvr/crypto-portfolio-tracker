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
  const totalValue = currentPrice ? currentPrice * asset.quantity : 0;
  const priceChange = currentPrice ? currentPrice * 0.0111 : 0; // Mocked percentage change
  const priceChangeColor = priceChange >= 0 ? 'text-green-400' : 'text-red-400';

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="bg-black rounded-lg shadow-lg p-6 w-[90%] max-w-4xl mx-auto text-white relative">
      <h3 className="text-3xl font-bold mb-2 mt-6">{asset.symbol}</h3>

      {/* Price & Percentage Change */}
      <div className="text-2xl font-semibold mb-10">${totalValue.toLocaleString()}</div>
      <div className={`flex items-center gap-1 text-sm font-medium ${priceChangeColor}`}>
        <span>{priceChange >= 0 ? '▲' : '▼'}</span>
        <span>{`${priceChange.toFixed(2)} (${(priceChange / currentPrice * 100).toFixed(2)}%)`}</span>
      </div>

      {/* Chart */}
      <div className="mt-4">
        <PriceChart symbol={asset.symbol} />
      </div>

      <button
        className="mt-6 w-full bg-gray-700 text-white font-semibold py-2 rounded-lg
        hover:bg-gray-600 hover:shadow-green-500/50 transition duration-300 animate-pulse"
        onClick={handleBack}
      >
        Back to Home
      </button>
    </div>
  );
}
