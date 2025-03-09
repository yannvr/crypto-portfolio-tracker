import usePortfolioStore from './usePortfolioStore';

// Reset the store before each test
beforeEach(() => {
  usePortfolioStore.setState({ assets: [], nextId: 1 });
});

describe('usePortfolioStore', () => {
  test('should add an asset', () => {
    const { addAsset } = usePortfolioStore.getState();

    addAsset('BTC', 1.5);

    // Get the updated state after the action
    const { assets } = usePortfolioStore.getState();
    expect(assets.length).toBe(1);
    expect(assets[0].symbol).toBe('BTC');
    expect(assets[0].quantity).toBe(1.5);
  });

  test('should edit an asset', () => {
    const { addAsset, editAsset } = usePortfolioStore.getState();

    addAsset('BTC', 1.5);

    // Get the updated state after adding
    const { assets: assetsAfterAdd } = usePortfolioStore.getState();
    const id = assetsAfterAdd[0].id;

    editAsset(id, { quantity: 2.5 });

    // Get the updated state after editing
    const { assets: assetsAfterEdit } = usePortfolioStore.getState();
    expect(assetsAfterEdit[0].quantity).toBe(2.5);
  });

  test('should remove an asset', () => {
    const { addAsset, removeAsset } = usePortfolioStore.getState();

    addAsset('BTC', 1.5);

    // Get the updated state after adding
    const { assets: assetsAfterAdd } = usePortfolioStore.getState();
    const id = assetsAfterAdd[0].id;

    removeAsset(id);

    // Get the updated state after removing
    const { assets: assetsAfterRemove } = usePortfolioStore.getState();
    expect(assetsAfterRemove.length).toBe(0);
  });

  test('should select an asset by id', () => {
    const { addAsset, selectAsset } = usePortfolioStore.getState();

    addAsset('BTC', 1.5);

    // Get the updated state after adding
    const { assets } = usePortfolioStore.getState();
    const id = assets[0].id;

    const asset = selectAsset(id.toString());

    expect(asset).toBeDefined();
    expect(asset?.symbol).toBe('BTC');
  });
});
