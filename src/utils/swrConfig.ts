import { SWRConfiguration } from 'swr';

/**
 * Create a localStorage based persistence layer for SWR
 */
function createLocalStorageProvider() {
  // When initializing, we restore the data from localStorage
  const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'));

  // Before unloading the page, we save all data to localStorage
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem('app-cache', appCache);
  });

  // We still use the map for write & read
  return map;
}

/**
 * Global SWR configuration
 */
export const swrConfig: SWRConfiguration = {
  // Global error retry - don't retry on 404s
  shouldRetryOnError: (err) => {
    if (err.status === 404) return false;
    return true;
  },
  // Global error handler
  onError: (err, key) => {
    // Here we can log the error to a service like Sentry
    console.error(`SWR Error for ${key}:`, err);
  },
  // Default refresh interval (30 seconds)
  refreshInterval: 30000,
  // Don't revalidate on focus by default
  revalidateOnFocus: false,
  // Don't revalidate on reconnect by default
  revalidateOnReconnect: true,
  // Keep data for 5 minutes when window is hidden
  dedupingInterval: 300000,
};

/**
 * Specific configuration for CoinGecko API requests
 * This helps manage rate limits and improve performance
 */
export const coinGeckoSWRConfig: SWRConfiguration = {
  ...swrConfig,
  // Cache CoinGecko data for longer periods
  dedupingInterval: 60000, // 1 minute
  // Refresh less frequently to avoid rate limits
  refreshInterval: 60000, // 1 minute
  // Keep stale data on error
  keepPreviousData: true,
  // Retry fewer times for CoinGecko
  errorRetryCount: 2,
  // Longer retry delay
  errorRetryInterval: 5000,
};

/**
 * Fetcher function for SWR
 */
export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // @ts-ignore
    error.status = response.status;
    throw error;
  }
  return response.json();
};
