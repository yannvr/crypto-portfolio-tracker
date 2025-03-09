import React, { useState } from 'react';
import { useCoinData } from '../../../hooks/useCoinData';
import PricePerformance from './PricePerformance';

interface AboutCoinProps {
  symbol: string;
}

const AboutCoin: React.FC<AboutCoinProps> = ({ symbol }) => {
  const { coinStats, isLoading, coinId } = useCoinData(symbol);

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

  return (
    <div className="bg-black rounded-lg p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {coinStats.image.small && (
            <img
              src={coinStats.image.small}
              alt={`${coinStats.name} logo`}
              className="w-8 h-8 mr-3 rounded-full"
            />
          )}
          <h3 className="text-lg md:text-xl font-bold">About {coinStats.name}</h3>
        </div>
        {coinStats.website && (
          <a
            href={coinStats.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
            aria-label="Visit website"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      <div className="mb-6">
        <p className="text-gray-300 text-sm leading-relaxed">
          {coinStats.description ? (
            coinStats.description.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 200) +
            (coinStats.description.length > 200 ? '...' : '')
          ) : (
            `Information about ${coinStats.name} (${symbol.toUpperCase()})`
          )}
        </p>
      </div>

      {/* Categories */}
      {coinStats.categories && coinStats.categories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {coinStats.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs"
              >
                {category}
              </span>
            ))}
            {coinStats.categories.length > 3 && (
              <span className="text-gray-400 text-xs flex items-center">
                +{coinStats.categories.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Price Performance */}
      <div className="mb-4">
        <PricePerformance symbol={symbol} />
      </div>

      {/* All-time high/low */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-md p-3">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">All Time High</h4>
          <div className="text-base font-bold">
            ${coinStats.allTimeHigh.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
            <div className="text-xs text-gray-500">
              {new Date(coinStats.allTimeHigh.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-red-500">
              {coinStats.allTimeHigh.percentFromATH.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-md p-3">
          <h4 className="text-xs font-semibold text-gray-400 mb-1">All Time Low</h4>
          <div className="text-base font-bold truncate">
            ${coinStats.allTimeLow.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </div>
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
            <div className="text-xs text-gray-500">
              {new Date(coinStats.allTimeLow.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-green-500">
              +{Math.abs(coinStats.allTimeLow.percentFromATL).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Data from CoinGecko: {coinId}
      </div>
    </div>
  );
};

export default AboutCoin;
