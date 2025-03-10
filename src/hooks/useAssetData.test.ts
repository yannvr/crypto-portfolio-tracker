import usePriceStore from '../store/usePriceStore';

// Reset the store before each test
beforeEach(() => {
  usePriceStore.setState({
    prices: {},
    previousPrices: {},
    priceChanges: {},
    lastUpdated: {},
    connectionStatus: {}
  });
});

describe('usePriceStore', () => {
  test('should set a price', () => {
    const { setPrice } = usePriceStore.getState();

    setPrice('BTC', 50000);

    // Get the updated state after the action
    const updatedState = usePriceStore.getState();
    expect(updatedState.prices.BTC).toBe(50000);
  });

  test('should calculate price change percentage', () => {
    const { setPrice } = usePriceStore.getState();

    // Set initial price
    setPrice('BTC', 50000);

    // Set new price (10% increase)
    setPrice('BTC', 55000);

    // Get the updated state after the actions
    const updatedState = usePriceStore.getState();
    // Should calculate a 10% price change
    expect(updatedState.priceChanges.BTC).toBeCloseTo(10, 1);
  });

  test('should set connection status', () => {
    const { setConnectionStatus } = usePriceStore.getState();

    setConnectionStatus('BTC', 'connected');

    // Get the updated state after the action
    const updatedState = usePriceStore.getState();
    expect(updatedState.connectionStatus.BTC).toBe('connected');
  });
});
