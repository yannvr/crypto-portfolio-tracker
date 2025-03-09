import React, { useState } from 'react';
import PricePerformance from './PricePerformance';

interface AboutCoinProps {
  symbol: string;
  coinData?: {
    coinStats: any;
    coinId: string | null;
    isLoading: boolean;
    isError: any;
  } | null;
}

const AboutCoin: React.FC<AboutCoinProps> = ({ symbol, coinData }) => {
  const coinStats = coinData?.coinStats;
  const isLoading = coinData?.isLoading || !coinData;
  const coinId = coinData?.coinId;

  if (isLoading) {
    return (
      <div className="bg-black rounded-lg p-4 md:p-6 h-full">
        <h3 className="text-lg md:text-xl font-bold mb-4">About {symbol}</h3>
        <div className="animate-pulse">
          <div className="bg-gray-800 h-4 w-3/4 rounded mb-3"></div>
          <div className="bg-gray-800 h-4 w-full rounded mb-3"></div>
          <div className="bg-gray-800 h-4 w-5/6 rounded mb-3"></div>
          <div className="bg-gray-800 h-4 w-2/3 rounded"></div>
        </div>
      </div>
    );
  }

  if (!coinStats) {
    return (
      <div className="bg-black rounded-lg p-4 md:p-6 h-full">
        <h3 className="text-lg md:text-xl font-bold mb-4">About {symbol}</h3>
        <p className="text-gray-400">No information available for this asset.</p>
      </div>
    );
  }

  const description = coinStats.description || '';
  const marketData = coinStats.market_data || {};

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="bg-black rounded-lg p-4 md:p-6 h-full">
      <h3 className="text-lg md:text-xl font-bold mb-4">About {coinStats.name || symbol}</h3>

      {description ? (
        <div className="mb-4">
          <div
            className={`text-gray-300 text-sm leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {description.length > 200 && (
            <button
              onClick={toggleDescription}
              className="text-blue-400 text-sm mt-2 hover:underline"
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-400 mb-4">No description available.</p>
      )}

      {/* Links */}
      {coinStats.links?.homepage?.[0] && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Links</h4>
          <div className="flex items-center">
            <a
              href={coinStats.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm hover:underline flex items-center"
            >
              Website
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {coinId && (
              <a
                href={`https://www.coingecko.com/en/coins/${coinId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm hover:underline flex items-center ml-4"
              >
                CoinGecko
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Price Performance */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Price Performance</h4>
        <PricePerformance coinStats={coinStats} />
      </div>

      {/* All-time high/low */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-md p-3">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">All Time High</h4>
          <div className="text-base font-bold">
            ${(coinStats.market_data?.ath?.usd || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
            <div className="text-xs text-gray-500">
              {coinStats.market_data?.ath_date?.usd ? new Date(coinStats.market_data.ath_date.usd).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'}
            </div>
            <div className="text-xs text-red-500">
              {(coinStats.market_data?.ath_change_percentage?.usd || 0).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-md p-3">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">All Time Low</h4>
          <div className="text-base font-bold truncate">
            ${(coinStats.market_data?.atl?.usd || 0).toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
            <div className="text-xs text-gray-500">
              {coinStats.market_data?.atl_date?.usd ? new Date(coinStats.market_data.atl_date.usd).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 'N/A'}
            </div>
            <div className="text-xs text-green-500">
              +{Math.abs(coinStats.market_data?.atl_change_percentage?.usd || 0).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutCoin;
