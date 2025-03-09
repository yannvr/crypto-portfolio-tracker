# Crypto Portfolio Tracker

A modern React application for tracking and managing your cryptocurrency portfolio.

## Overview

The Crypto Portfolio Tracker is a web application that allows users to manage and track their cryptocurrency assets. Users can view detailed information about their assets, including current prices, historical data, and overall portfolio value.

## Features

- **Portfolio Dashboard**: View all your cryptocurrency holdings in one place with current values
- **Real-time Price Updates**: Get the latest prices from CoinGecko and Binance APIs
- **Historical Data**: View price charts for different time periods (1d, 7d, 30d)
- **Portfolio Management**: Add, edit, and remove assets from your portfolio
- **Search & Filter**: Find specific assets quickly with search and sorting options
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Your portfolio data is saved between sessions
- **Detailed Asset View**: See comprehensive information about each cryptocurrency

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Data Fetching**: SWR for data fetching with caching
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Testing**: Jest and React Testing Library
- **APIs**: CoinGecko and Binance for cryptocurrency data

## Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── pages/            # Application pages
├── services/         # API services
├── store/            # State management
├── utils/            # Utility functions
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## Installation

To get started with the Crypto Portfolio Tracker, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/crypto-portfolio-tracker.git
   ```

2. Navigate to the project directory:
   ```
   cd crypto-portfolio-tracker
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To run the application in development mode, use the following command:
```
npm run dev
```
This will start the Vite development server, and you can view the application in your browser at `http://localhost:3000`.

To build the application for production:
```
npm run build
```

To preview the production build:
```
npm run serve
```

## Running Tests

To run the tests for the application, use the following command:
```
npm test
```

For test coverage:
```
npm test -- --coverage
```

## Key Components

### State Management

The application uses Zustand for state management with persistence to local storage:

- `usePortfolioStore`: Manages the user's portfolio of assets
- `usePriceStore`: Manages real-time price data

### API Integration

The application fetches data from multiple sources:

- CoinGecko API: For detailed coin information and historical data
- Binance API: For real-time price updates

### Data Visualization

Price charts are implemented using Recharts, showing historical price data with customizable time periods.

## Usage Guide

1. **View Portfolio**: The home page displays all your cryptocurrency holdings
2. **Add Asset**: Click the "+ Asset" button to add a new cryptocurrency to your portfolio
3. **Edit Asset**: Click on the edit button on an asset card or in the details view
4. **Remove Asset**: In the edit view, click the "Delete" button
5. **View Details**: Click on an asset card to see detailed information and charts
6. **Filter Assets**: Use the search box to filter assets by name
7. **Sort Assets**: Use the dropdown to sort assets by name or value

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature-name`)
6. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for more details.