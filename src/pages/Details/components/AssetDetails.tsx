import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';
import PriceChart from './PriceChart';
import Button from '../../../components/Button';
import NetworkStats from './NetworkStats';
import AboutCoin from './AboutCoin';

interface AssetDetailsProps {
  asset: {
    id: number;
    symbol: string;
    quantity: number;
  };
  coinData: {
    coinStats: any;
    coinId: string | null;
    isLoading: boolean;
    isError: any;
  } | null;
}

export default function AssetDetails({ asset, coinData }: AssetDetailsProps) {
  const navigate = useNavigate();
  // const coinStats = coinData?.coinStats;

  // Get the current price from the transformed data structure
  const coinStats = coinData?.coinStats;
  const currentPrice = coinStats?.market_data?.current_price?.usd || null;

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="bg-gray-900 p-3 md:p-6 w-full max-w-7xl mx-auto text-white">
      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center mb-4 gap-3">
        <div className="flex items-center justify-between">
          <div>
          {coinStats?.image?.small && (
            <img
              src={coinStats.image.small}
              alt={`${asset.symbol} logo`}
              className="w-8 h-8 mr-3 rounded-full"
            />
          )}
          <div>
            <h3 className="text-xl md:text-2xl font-bold">{coinStats?.name || asset.symbol}</h3>
            <div className="text-gray-400 text-sm">{asset.symbol.toUpperCase()}</div>

          </div>
          </div>
          <Button onClick={handleBack} secondary className="text-sm px-3 py-1 self-start xs:self-auto self-center">
          Back to Portfolio
        </Button>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-black rounded-lg p-3">
          <div className="text-gray-400 text-sm">Current Price</div>
          <div className="text-xl font-bold mt-1">
            {currentPrice ? formatCurrency(currentPrice) : 'Loading...'}
          </div>
        </div>

        <div className="bg-black rounded-lg p-3">
          <div className="text-gray-400 text-sm">Your Holdings</div>
          <div className="text-xl font-bold mt-1">
            {asset.quantity.toLocaleString()} {asset.symbol.toUpperCase()}
          </div>
        </div>

        <div className="bg-black rounded-lg p-3">
          <div className="text-gray-400 text-sm">Value</div>
          <div className="text-xl font-bold mt-1">
            {currentPrice
              ? formatCurrency(currentPrice * asset.quantity)
              : 'Calculating...'}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <PriceChart symbol={asset.symbol} coinStats={coinStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <NetworkStats symbol={asset.symbol} coinData={coinData} />
        </div>
        <div>
          <AboutCoin symbol={asset.symbol} coinData={coinData} />
        </div>
      </div>
    </div>
  );
}
