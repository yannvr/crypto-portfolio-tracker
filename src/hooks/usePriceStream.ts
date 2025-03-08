import { useEffect, useState } from 'react';

export default function usePriceStream(assetSymbol: string, onError?: (message: string) => void) {
  console.log("🚀 ~ usePriceStream ~ assetSymbol:", assetSymbol)
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${assetSymbol.toLowerCase()}usdt@trade`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p));
    };

    ws.onerror = () => {
      onError?.(`WebSocket error for ${assetSymbol}`);
    };

    return () => ws.close();
  }, [assetSymbol, onError]);

  return price;
}
