import React, { useEffect, useState } from "react";

interface PriceBadgeProps {
  currentPrice: number | null;
}

export default function PriceBadge({ currentPrice }: PriceBadgeProps) {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const [priceChangeIndicator, setPriceChangeIndicator] = useState<'▲' | '▼' | null>(null);
  const [priceChangeValue, setPriceChangeValue] = useState<number | null>(null);

  useEffect(() => {
    if (currentPrice !== null) {
      if (previousPrice !== null && currentPrice !== previousPrice) {
        setPriceChangeIndicator(currentPrice > previousPrice ? '▲' : '▼');
        setPriceChangeValue(((currentPrice - previousPrice) / previousPrice) * 100);
      }
      setPreviousPrice(currentPrice);
    }
  }, [currentPrice, previousPrice]);

  if (currentPrice === null || previousPrice === null || priceChangeValue === null) {
    return null;
  }

  const priceChangeColor = priceChangeIndicator === '▲' ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`font-semibold text-sm flex items-center ${priceChangeColor}`}>
      {priceChangeIndicator} {priceChangeValue?.toFixed(2)}%
    </div>
  );
}
