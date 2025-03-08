import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AssetCard from '../../components/AssetCard';

const asset = { id: 1, symbol: 'BTC', quantity: 2 };

jest.mock('../../components/PriceBadge', () => () => <div>PriceBadge</div>);

test('renders AssetCard component correctly', () => {
  render(
    <Router>
      <AssetCard asset={asset} />
    </Router>
  );
  expect(screen.getByText(/BTC/i)).toBeInTheDocument();
  expect(screen.getByText(/Quantity: 2/i)).toBeInTheDocument();
});

test('handles edit button click', () => {
  const { container } = render(
    <Router>
      <AssetCard asset={asset} />
    </Router>
  );
  console.log("🚀 ~ test ~ container:", container)
  const editButton = container.querySelector('button[aria-label="Edit "]');
  console.log("🚀 ~ test ~ editButton:", editButton)
  if(editButton) {
  fireEvent.click(editButton);
  }
  expect(window.location.pathname).toBe('/edit/1');
});

// test('handles delete button click', () => {
//   const { container } = render(
//     <Router>
//       <AssetCard asset={asset} />
//     </Router>
//   );
//   const deleteButton = container.querySelector('button[aria-label="Delete BTC"]');
//   fireEvent.click(deleteButton);
//   expect(window.location.pathname).toBe('/');
// });
