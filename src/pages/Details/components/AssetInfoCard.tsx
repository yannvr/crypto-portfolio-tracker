import { formatCurrency } from '../../../utils/utils';
import { useCoinData } from '../../../hooks/useAssetData';
import { StatItem, LoadingStatItem } from './StatItem';

export interface AssetInfoCardProps {
  asset: {
    symbol: string;
    quantity: number
  };
}

export const AssetInfoCard: React.FC<AssetInfoCardProps> = ({ asset }) => {
  const symbol = asset?.symbol || '';
  const { data: coinData, loading: coinLoading } = useCoinData(symbol);

  const isLoading = !coinData || coinLoading;
  const currentPrice = coinData?.market_data?.current_price?.usd || 0;
  const totalValue = currentPrice * asset.quantity;

  return (
    <div className="lg:col-span-1 bg-gray-900/80 border border-gray-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        {coinData?.image?.small ? (
          <img
            src={coinData.image.small}
            alt={coinData.name}
            className="w-10 h-10"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            {asset.symbol.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{coinData?.name || asset.symbol}</h2>
          <p className="text-gray-400">{asset.symbol}</p>
        </div>
      </div>

      <div className="space-y-4 flex-grow flex flex-col justify-center">
        <StatItem label="Your Holdings" value={`${asset.quantity} ${asset.symbol}`} />
        {isLoading
          ? <LoadingStatItem label="Current Price" />
          : <StatItem label="Current Price" value={formatCurrency(currentPrice)} />
        }
        {isLoading
          ? <LoadingStatItem label="Total Value" />
          : <StatItem label="Total Value" value={formatCurrency(totalValue)} />
        }
      </div>
    </div>
  );
};
