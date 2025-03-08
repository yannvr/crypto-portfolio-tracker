import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceData {
  date: string;
  price: number;
}

interface PriceChartProps {
  symbol: string;
}

export default function PriceChart({ symbol }: PriceChartProps) {
  const [data, setData] = useState<PriceData[]>([]);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=1d&limit=7`);
        const result = await response.json();
        const formattedData = result.map((item: any) => ({
          date: new Date(item[0]).toLocaleDateString(),
          price: parseFloat(item[4]), // Closing price
        }));
        setData(formattedData);
      } catch (error) {
        console.error(`Error fetching price data for ${symbol}:`, error);
      }
    };

    fetchPriceData();
  }, [symbol]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} className="bg-black">
        <XAxis dataKey="date" tick={{ fill: '#bbb' }} />
        <YAxis tick={{ fill: '#bbb' }} tickFormatter={(value) => `$${value.toFixed(2)}`} />
        <Tooltip
          contentStyle={{ backgroundColor: 'black', border: 'none', color: 'white' }}
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        <Line type="monotone" dataKey="price" stroke="#66ff66" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
