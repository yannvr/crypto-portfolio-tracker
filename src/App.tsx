import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddEditHolding from './pages/AddEditHolding';
import Details from './pages/Details';
import PageNotFound from './pages/PageNotFound';
import { useCoinList } from './hooks/useAssetData';

export default function App() {
  // Pre-initialize the coin list so it's available throughout the app
  useCoinList();

  return (
    <div className="min-h-screen bg-gray-900">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEditHolding />} />
          <Route path="/edit/:id" element={<AddEditHolding />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </div>
  );
}
