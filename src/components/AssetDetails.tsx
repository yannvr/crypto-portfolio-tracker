import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePriceStream } from '@store/usePriceStreamStore';
import Button from '@components/ui/Button';
import PriceChart from '@components/PriceChart';

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

  const renderPrice = () => {
    if (!currentPrice || !priceChange) {
      return null;
    }
    return (
      <>
        <div className="text-2xl font-semibold mb-10">${totalValue.toLocaleString()}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${priceChangeColor}`}>
          <span>{priceChange >= 0 ? '▲' : '▼'}</span>
          <span>{`${priceChange.toFixed(2)} (${((priceChange / currentPrice) * 100).toFixed(2)}%)`}</span>
        </div>
      </>
    );
  };

  return (
    <div className="bg-black rounded-lg shadow-lg p-6 w-[90%] max-w-4xl mx-auto text-white relative">
      <h3 className="text-3xl font-bold mb-2 mt-6">{asset.symbol}</h3>
      {renderPrice()}

      <div className="mt-4">
        <PriceChart symbol={asset.symbol} />
      </div>

      <Button secondary className="w-full mt-10" onClick={handleBack} >
        Back to Home
      </Button>
    </div>
  );
}
