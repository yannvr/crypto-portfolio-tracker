import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorState, AssetNotFound } from './StateComponents';

describe('ErrorState', () => {
  test('renders default error message', () => {
    render(<ErrorState />);
    expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
  });

  test('renders custom error message', () => {
    const customMessage = 'Custom error message';
    render(<ErrorState message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test('renders error icon', () => {
    render(<ErrorState />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});

describe('AssetNotFound', () => {
  test('renders not found message', () => {
    render(
      <BrowserRouter>
        <AssetNotFound />
      </BrowserRouter>,
    );
    expect(screen.getByText('Asset not found')).toBeInTheDocument();
  });

  test('renders back to portfolio button', () => {
    render(
      <BrowserRouter>
        <AssetNotFound />
      </BrowserRouter>,
    );
    expect(screen.getByText('Back to Portfolio')).toBeInTheDocument();
  });
});
