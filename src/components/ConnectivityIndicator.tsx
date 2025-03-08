import React from 'react';

interface ConnectivityIndicatorProps {
  connected: boolean;
}

const ConnectivityIndicator: React.FC<ConnectivityIndicatorProps> = React.memo(({ connected }) => (
  <div className="flex items-center">
    <span
      className={`h-2 w-2 rounded-full ${
        connected ? 'bg-green-500' : 'bg-red-500'
      }`}
    />
    <span className="ml-2 text-sm font-medium text-gray-700">
      {connected ? 'Live Prices' : 'Disconnected'}
    </span>
  </div>
));

export default ConnectivityIndicator;
