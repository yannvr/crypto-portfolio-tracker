import { render } from '@testing-library/react';
import PriceBadge from './PriceBadge';

test('renders PriceBadge component correctly for positive change', () => {
  const { container } = render(<PriceBadge currentPrice={51000} previousPrice={50000} />);
  expect(container).toHaveTextContent('51000.00 ▲');
});

test('renders PriceBadge component correctly for negative change', () => {
  const { container } = render(<PriceBadge currentPrice={49000} previousPrice={50000} />);
  expect(container).toHaveTextContent('49000.00 ▼');
});

test('does not render when no prices are provided', () => {
  const { container } = render(<PriceBadge currentPrice={null} previousPrice={null} />);
  expect(container.firstChild).toBeNull();
});
