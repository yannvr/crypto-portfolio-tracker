import useSWR from 'swr';
import { fetcher, coinGeckoSWRConfig } from '../utils/swrConfig';
import { API_URLS, COINGECKO_ENDPOINTS } from '../utils/constants';

export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
}

// There are some coins that have multiple IDs, we need to map the most common ones to the canonical ID
// For intance, BTC is first looked up as batcat...
const CANONICAL_COIN_IDS: Record<string, string> = {
  'btc': 'bitcoin',
  'eth': 'ethereum',
  'usdt': 'tether',
  'usdc': 'usd-coin',
  'bnb': 'binancecoin',
  'xrp': 'ripple',
  'ada': 'cardano',
  'doge': 'dogecoin',
  'sol': 'solana',
  'dot': 'polkadot',
  'shib': 'shiba-inu',
  'matic': 'matic-network',
  'avax': 'avalanche-2',
  'link': 'chainlink',
  'ltc': 'litecoin',
  'uni': 'uniswap',
  'atom': 'cosmos',
  'xlm': 'stellar',
  'algo': 'algorand',
  'etc': 'ethereum-classic',
  'fil': 'filecoin',
  'vet': 'vechain',
  'icp': 'internet-computer',
  'xmr': 'monero',
  'xtz': 'tezos',
  'aave': 'aave',
  'egld': 'elrond-erd-2',
  'axs': 'axie-infinity',
  'theta': 'theta-token',
  'cake': 'pancakeswap-token',
};

/**
 * Hook to fetch and cache the list of all coins from CoinGecko
 */
export function useCoinList() {
  const { data, error, isLoading } = useSWR<CoinListItem[]>(
    `${API_URLS.COINGECKO_BASE_URL}${COINGECKO_ENDPOINTS.COINS_LIST}`,
    fetcher,
    {
      ...coinGeckoSWRConfig,
      // Cache the coin list for a longer period since it doesn't change often
      dedupingInterval: 24 * 60 * 60 * 1000, // 24 hours
      refreshInterval: 0, // Don't auto-refresh
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  /**
   * Find a coin ID by its symbol using a priority-based approach
   * @param symbol The coin symbol to look up
   * @returns The coin ID or null if not found
   */
  const findCoinIdBySymbol = (symbol: string): string | null => {
    if (!data) return null;

    const normalizedSymbol = symbol.toLowerCase();

    // 1. Check if we have a canonical ID for this symbol
    if (CANONICAL_COIN_IDS[normalizedSymbol]) {
      // Verify that the canonical ID exists in our data
      const canonicalExists = data.some(coin => coin.id === CANONICAL_COIN_IDS[normalizedSymbol]);
      if (canonicalExists) {
        return CANONICAL_COIN_IDS[normalizedSymbol];
      }
    }

    // 2. Find all matches for this symbol
    const matches = data.filter(coin => coin.symbol.toLowerCase() === normalizedSymbol);

    if (matches.length === 0) {
      return null;
    }

    if (matches.length === 1) {
      return matches[0].id;
    }

    // 3. If we have multiple matches, use heuristics to find the most likely one

    // a. Prefer coins where the name closely matches the symbol
    const nameMatchesSymbol = matches.find(coin =>
      coin.name.toLowerCase() === normalizedSymbol ||
      coin.name.toLowerCase().replace(/\s+/g, '') === normalizedSymbol ||
      coin.name.toLowerCase().includes(normalizedSymbol)
    );
    if (nameMatchesSymbol) return nameMatchesSymbol.id;

    // b. Prefer coins with shorter IDs (usually the original/main coins)
    matches.sort((a, b) => a.id.length - b.id.length);

    // c. Prefer coins where the ID starts with the symbol
    const idStartsWithSymbol = matches.find(coin =>
      coin.id.toLowerCase().startsWith(normalizedSymbol)
    );
    if (idStartsWithSymbol) return idStartsWithSymbol.id;

    // d. If all else fails, return the first match (which will be the one with the shortest ID)
    return matches[0].id;
  };

  return {
    coinList: data || [],
    findCoinIdBySymbol,
    isLoading,
    isError: error,
  };
}
