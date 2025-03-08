import React, { useEffect, useState } from "react";

interface PriceBadgeProps {
  currentPrice: number | null;
}

export default function PriceBadge({ currentPrice }: PriceBadgeProps) {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  useEffect(() => {
    if (currentPrice !== null) {
      setPreviousPrice(currentPrice);
    }
  }, [currentPrice]);

  if (currentPrice === null || previousPrice === null) {
    return null;
  }

  const priceChange = currentPrice - previousPrice;
  const priceChangeIndicator = priceChange > 0 ? '▲' : priceChange < 0 ? '▼' : '';
  const formattedPrice = currentPrice.toFixed(2);
  const priceChangeColor = priceChange > 0 ? 'text-green-500' : priceChange < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <div className={`font-semibold ${priceChangeColor}`}>
      ${formattedPrice} {priceChangeIndicator}
    </div>
  );
}
