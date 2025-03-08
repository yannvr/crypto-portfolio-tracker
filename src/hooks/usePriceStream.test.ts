import { renderHook } from '@testing-library/react';
import usePriceStream from './usePriceStream';

test('initial price state is null', () => {
  const { result } = renderHook(() => usePriceStream('BTC'));
  expect(result.current).toBeNull();
});