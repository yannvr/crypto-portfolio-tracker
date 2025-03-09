import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import usePortfolioStore from '../store/usePortfolioStore';
import { useCoinData, usePriceChart } from '../hooks/useAssetData';
import { formatCurrency, formatPercent } from '../utils/utils';
import Button from '../components/Button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const selectAsset = usePortfolioStore(state => state.selectAsset);
  const [selectedDays, setSelectedDays] = useState(7);

  // Use useMemo to prevent unnecessary re-renders when the asset doesn't change
  const asset = useMemo(() => selectAsset(id), [id, selectAsset]);

  // Fetch coin data
  const { data: coinData, loading: coinLoading, error: coinError } =
    asset ? useCoinData(asset.symbol) : { data: null, loading: false, error: null };

  // Fetch price chart data
  const { chartData, loading: chartLoading, error: chartError } =
    asset ? usePriceChart(asset.symbol, selectedDays) : { chartData: [], loading: false, error: null };

  // Calculate y-axis domain for the chart
  const yAxisDomain = useMemo(() => {
    if (!chartData.length) return [0, 0];
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.02;
    return [min - padding, max + padding];
  }, [chartData]);

  if (!asset) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Asset not found</h2>
          <Link to="/">
            <Button>Back to Portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLoading = coinLoading || chartLoading;
  const hasError = coinError || chartError;
  const currentPrice = coinData?.market_data?.current_price?.usd || 0;
  const totalValue = currentPrice * asset.quantity;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <Link to="/" className="text-gray-400 hover:text-white mb-2 inline-block">
            &larr; Back to Portfolio
          </Link>
          <h1 className="text-3xl font-bold">{asset.symbol} Details</h1>
        </div>
        <Link to={`/edit/${asset.id}`}>
          <Button>Edit Asset</Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : hasError ? (
        <div className="text-center py-12 text-red-500">
          Error loading data. Please try again later.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Asset Info Card */}
          <div className="lg:col-span-1 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              {coinData?.image?.small && (
                <img
                  src={coinData.image.small}
                  alt={coinData.name}
                  className="w-10 h-10"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{coinData?.name || asset.symbol}</h2>
                <p className="text-gray-400">{asset.symbol}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Your Holdings</p>
                <p className="text-2xl font-bold">{asset.quantity} {asset.symbol}</p>
              </div>

              <div>
                <p className="text-gray-400">Current Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(currentPrice)}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Total Value</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalValue)}
                </p>
              </div>

              <div>
                <p className="text-gray-400">24h Change</p>
                <p className={`text-xl font-bold ${
                  (coinData?.market_data?.price_change_percentage_24h || 0) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {formatPercent(coinData?.market_data?.price_change_percentage_24h || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Price Chart Card */}
          <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Price History</h3>
              <div className="flex space-x-2">
                {[7, 14, 30, 90].map((days) => (
                  <button
                    key={days}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      selectedDays === days
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setSelectedDays(days)}
                  >
                    {days}D
                  </button>
                ))}
              </div>
            </div>

            <div className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#999' }}
                      axisLine={{ stroke: '#333' }}
                    />
                    <YAxis
                      tick={{ fill: '#999' }}
                      axisLine={{ stroke: '#333' }}
                      domain={yAxisDomain}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No chart data available
                </div>
              )}
            </div>
          </div>

          {/* Market Stats Card */}
          <div className="lg:col-span-3 bg-gray-900/80 border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Market Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400">Market Cap</p>
                <p className="text-xl font-bold">
                  {formatCurrency(coinData?.market_data?.market_cap?.usd || 0)}
                </p>
              </div>

              <div>
                <p className="text-gray-400">7d Change</p>
                <p className={`text-xl font-bold ${
                  (coinData?.market_data?.price_change_percentage_7d || 0) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {formatPercent(coinData?.market_data?.price_change_percentage_7d || 0)}
                </p>
              </div>

              <div>
                <p className="text-gray-400">30d Change</p>
                <p className={`text-xl font-bold ${
                  (coinData?.market_data?.price_change_percentage_30d || 0) >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {formatPercent(coinData?.market_data?.price_change_percentage_30d || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
