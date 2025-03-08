import React from "react";

interface PriceBadgeProps {
  currentPrice: number | null;
  previousPrice: number | null;
}

export default function PriceBadge({ currentPrice, previousPrice }: PriceBadgeProps) {
  if (currentPrice === null || previousPrice === null) {
    return null;
  }

  const priceChange = currentPrice - previousPrice;
  const priceChangeIndicator = priceChange > 0 ? '▲' : '▼';
  const formattedPrice = currentPrice.toFixed(2);
  const priceChangeColor = priceChange > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`font-semibold ${priceChangeColor}`}>
      ${formattedPrice} {priceChangeIndicator}
    </div>
  );
}
