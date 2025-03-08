import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddEditHolding from './pages/AddEditHolding';
import Details from './pages/Details';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEditHolding />} />
        <Route path="/edit/:id" element={<AddEditHolding />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}
