import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePortfolioStore from '../hooks/usePortfolioStore';

export default function AddEditHolding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assets, addAsset, editAsset } = usePortfolioStore();
  const editingAsset = assets.find((asset) => asset.id === Number(id));
  const [form, setForm] = useState({ symbol: '', quantity: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingAsset) {
      setForm({ symbol: editingAsset.symbol, quantity: String(editingAsset.quantity) });
    }
  }, [editingAsset]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.symbol) newErrors.symbol = 'Token symbol is required';
    if (!form.quantity || Number(form.quantity) <= 0) newErrors.quantity = 'Quantity must be greater than zero';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrEditAsset = useCallback(() => {
    if (!validateForm()) return;

    if (editingAsset) {
      editAsset({ ...editingAsset, symbol: form.symbol.toUpperCase(), quantity: parseFloat(form.quantity) });
    } else {
      addAsset({
        id: Date.now(),
        symbol: form.symbol.toUpperCase(),
        quantity: parseFloat(form.quantity),
        previousPrice: 0,
      });
    }

    navigate('/');
  }, [form, editingAsset, addAsset, editAsset, navigate]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="font-semibold mb-4">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
      <input
        className="border rounded p-2 w-full mb-1"
        placeholder="Token Symbol (BTC)"
        value={form.symbol}
        onChange={(e) => setForm({ ...form, symbol: e.target.value })}
      />
      {errors.symbol && <div className="text-red-600 text-xs">{errors.symbol}</div>}

      <input
        className="mt-2 border rounded p-2 w-full"
        type="number"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />
      {errors.quantity && <div className="text-red-600 text-xs">{errors.quantity}</div>}

      <div className="flex justify-between items-center mt-4">
        <button className="text-sm text-gray-500" onClick={() => navigate('/')}>Cancel</button>
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleAddOrEditAsset}>
          {editingAsset ? 'Save' : 'Add'}
        </button>
      </div>
    </div>
  );
}
