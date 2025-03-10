import { render, screen, fireEvent } from '@testing-library/react';
import { PriceChartCard } from './PriceChartCard';
import { usePriceChart } from '../../../hooks/useAssetData';

// Mock the hooks
jest.mock('../../../hooks/useAssetData', () => ({
  usePriceChart: jest.fn()
}));

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => ({
  LineChart: () => <div data-testid="line-chart" />,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('PriceChartCard', () => {
  const mockAsset = {
    symbol: 'BTC'
  };

  const mockSetSelectedDays = jest.fn();

  beforeEach(() => {
    (usePriceChart as jest.Mock).mockReturnValue({
      chartData: [
        { date: '2023-01-01', price: 48000 },
        { date: '2023-01-02', price: 49000 },
        { date: '2023-01-03', price: 50000 }
      ],
      loading: false
    });
  });

  test('renders price history title', () => {
    render(
      <PriceChartCard
        asset={mockAsset}
        selectedDays={7}
        setSelectedDays={mockSetSelectedDays}
      />
    );

    expect(screen.getByText('Price History')).toBeInTheDocument();
  });

  test('renders time period buttons', () => {
    render(
      <PriceChartCard
        asset={mockAsset}
        selectedDays={7}
        setSelectedDays={mockSetSelectedDays}
      />
    );

    expect(screen.getByText('7D')).toBeInTheDocument();
    expect(screen.getByText('14D')).toBeInTheDocument();
    expect(screen.getByText('30D')).toBeInTheDocument();
    expect(screen.getByText('90D')).toBeInTheDocument();
  });

  test('calls setSelectedDays when time period button is clicked', () => {
    render(
      <PriceChartCard
        asset={mockAsset}
        selectedDays={7}
        setSelectedDays={mockSetSelectedDays}
      />
    );

    fireEvent.click(screen.getByText('30D'));
    expect(mockSetSelectedDays).toHaveBeenCalledWith(30);
  });

  test('renders loading state', () => {
    (usePriceChart as jest.Mock).mockReturnValue({
      chartData: [],
      loading: true
    });

    render(
      <PriceChartCard
        asset={mockAsset}
        selectedDays={7}
        setSelectedDays={mockSetSelectedDays}
      />
    );

    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
  });

  test('renders no data message when chart data is empty', () => {
    (usePriceChart as jest.Mock).mockReturnValue({
      chartData: [],
      loading: false
    });

    render(
      <PriceChartCard
        asset={mockAsset}
        selectedDays={7}
        setSelectedDays={mockSetSelectedDays}
      />
    );

    expect(screen.getByText('No chart data available')).toBeInTheDocument();
  });

  test('renders chart when data is available', () => {
    render(
      <PriceChartCard
        asset={mockAsset}
        selectedDays={7}
        setSelectedDays={mockSetSelectedDays}
      />
    );

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
