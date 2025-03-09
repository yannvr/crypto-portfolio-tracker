import usePortfolioStore from './usePortfolioStore';

test('adds asset correctly', () => {
  const { addAsset, assets } = usePortfolioStore.getState();
  addAsset({ id: 1, symbol: 'ETH', quantity: 5 });
  expect(assets.length).toBe(1);
});

test('removes asset correctly', () => {
  const { addAsset, removeAsset, assets } = usePortfolioStore.getState();
  addAsset({ id: 2, symbol: 'BTC', quantity: 2 });
  removeAsset(2);
  expect(assets.some(asset => asset.id === 2)).toBeFalsy();
});