import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePortfolioStore from '../hooks/usePortfolioStore';
import TextInput from '../components/ui/TextInput';
import NumberInput from '../components/ui/NumberInput';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function AddEditHolding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { assets, addAsset, editAsset } = usePortfolioStore();
  const editingAsset = assets.find((asset) => asset.id === Number(id));
  const [form, setForm] = useState({ symbol: '', quantity: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-4">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>

        <TextInput
          value={form.symbol}
          onChange={(e) => setForm({ ...form, symbol: e.target.value })}
          placeholder="Token Symbol (BTC)"
        />
        {errors.symbol && <ErrorMessage message={errors.symbol} />}

        <NumberInput
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Quantity"
        />
        {errors.quantity && <ErrorMessage message={errors.quantity} />}

        <div className="flex justify-between items-center mt-4">
          <Button onClick={() => navigate('/')} secondary>
            Cancel
          </Button>
          <Button onClick={handleAddOrEditAsset}>
            {editingAsset ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}
