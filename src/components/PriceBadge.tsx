import React, { useEffect, useState } from "react";

interface PriceBadgeProps {
  currentPrice: number | null;
}

export default function PriceBadge({ currentPrice }: PriceBadgeProps) {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChangeIndicator, setPriceChangeIndicator] = useState<'▲' | '▼' | null>(null);

  useEffect(() => {
    if (currentPrice !== null) {
      if (previousPrice !== null && currentPrice !== previousPrice) {
        // Price has changed, update the indicator
        setPriceChangeIndicator(currentPrice > previousPrice ? '▲' : '▼');
      }
      // Update previousPrice after comparison
      setPreviousPrice(currentPrice);
    }
  }, [currentPrice, previousPrice]);

  if (currentPrice === null || previousPrice === null) {
    return null;
  }

  const formattedPrice = currentPrice.toFixed(2);
  const priceChangeColor = priceChangeIndicator === '▲' ? 'text-green-500' : 'text-red-500';

  return (
    <div
      className={`font-semibold ${
        priceChangeIndicator ? priceChangeColor : 'text-gray-500'
      }`}
    >
      ${formattedPrice} {priceChangeIndicator || ''}
    </div>
  );
}
