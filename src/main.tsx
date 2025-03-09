import React from 'react';
import { createRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import App from './App';
import './index.css'; // Import Tailwind CSS
import { swrConfig, fetcher } from './utils/swrConfig';

createRoot(document.getElementById('root')!).render(
  <SWRConfig 
    value={{ 
      ...swrConfig, 
      fetcher,
      // Enable revalidation on focus for better UX
      revalidateOnFocus: true,
      // Keep stale data on error
      keepPreviousData: true,
    }}
  >
    <App />
  </SWRConfig>
);
