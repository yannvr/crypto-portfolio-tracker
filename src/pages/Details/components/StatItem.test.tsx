import { render, screen } from '@testing-library/react';
import { StatItem, LoadingStatItem } from './StatItem';

describe('StatItem', () => {
  test('renders label and value', () => {
    render(<StatItem label="Test Label" value="Test Value" />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  test('applies custom className to value', () => {
    render(<StatItem label="Test" value="Value" valueClassName="custom-class" />);

    const valueElement = screen.getByText('Value');
    expect(valueElement).toHaveClass('custom-class');
  });
});

describe('LoadingStatItem', () => {
  test('renders label and loading state', () => {
    render(<LoadingStatItem label="Loading Test" />);

    expect(screen.getByText('Loading Test')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
