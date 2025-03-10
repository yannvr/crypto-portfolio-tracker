# Crypto Portfolio Tracker

## Install
- `bun install`
- `bun run test`
- `run run dev`

## Overview

The solution is meant to be as simple as possible. Therefore, Zustand has been chosen for state management although Redux would be better for scaling.
In addition:
- a real time price change notification has been added to help tracking the price. 
Notes on external API:
- SWR is used to minimise network request through caching and streamline fetching.
- Binance provide the web socket stream for real time updates via miniTicker and Kline for historical price (via Rest).
- CoinGecko provides market data and inital asset price. 

## Features

- **Portfolio Dashboard**: View all your cryptocurrency holdings in one place with current values
- **Real-time Price Updates**: Get the latest prices from CoinGecko and Binance APIs
- **Historical Data**: View price charts for different time periods (1d, 7d, 30d)
- **Portfolio Management**: Add, edit, and remove assets from your portfolio
- **Search & Filter**: Find specific assets quickly with search and sorting options
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Your portfolio data is saved between sessions
- **Market Stats**: Access to key market statistics for each asset

## Tech Stack

- **Frontend**: React 19 with TypeScript running on Vite
- **State Management**: Zustand
- **Data Fetching**: SWR for data fetching with caching
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Testing**: Jest and React Testing Library
- **APIs**: CoinGecko and Binance for cryptocurrency data