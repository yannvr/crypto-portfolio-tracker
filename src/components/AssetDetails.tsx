import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePriceStream } from '../store/usePriceStreamStore';
import { formatCurrency } from '../utils/formatters';
import AssetStats from './AssetStats';
import PriceChart from './PriceChart';
import Button from './ui/Button';
import { useCoinData } from 'hooks/useCoinData';

interface AssetDetailsProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
  };
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const navigate = useNavigate();

   // Use price stream hook for real-time price data
   const currentPrice = usePriceStream(asset.symbol);


  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="bg-black rounded-lg shadow-lg p-4 md:p-6 w-[95%] md:w-[90%] max-w-4xl mx-auto text-white relative">
      <div className="flex justify-between items-center m-3">
        <h3 className="text-2xl md:text-3xl font-bold mb-2 ">{asset.symbol} </h3>

      </div>

      <div className="mt-4">
        <PriceChart symbol={asset.symbol} />
      </div>

      <AssetStats  symbol={asset.symbol} />

      <Button secondary className="w-full mt-6 md:mt-10" onClick={handleBack}>
        Back to Home
      </Button>
    </div>
  );
}
