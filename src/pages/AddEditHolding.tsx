import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';
import NumberInput from '@components/NumberInput';
import TextInput from '@components/TextInput';
import { useCoinList } from '../hooks/useAssetData';
import usePortfolioStore from '@store/usePortfolioStore';

// Types
interface FormState {
  symbol: string;
  quantity: string;
}

interface FormErrors {
  symbol?: string;
  quantity?: string;
}

export default function AddEditHolding() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAsset, editAsset, removeAsset, selectAsset, assets } = usePortfolioStore();
  const { loading, findCoinIdBySymbol } = useCoinList();

  const [form, setForm] = useState<FormState>({ symbol: '', quantity: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  const editingAsset = selectAsset(id);


  // Load asset data when editing
  useEffect(() => {
    if (editingAsset) {
      setForm({
        symbol: editingAsset.symbol,
        quantity: String(editingAsset.quantity)
      });
    }
  }, [editingAsset]);

  // Validate form fields
  const validateForm = () => {
    const newErrors: FormErrors = {};
    const trimmedSymbol = form.symbol.trim().toUpperCase();

    if (!trimmedSymbol) {
      newErrors.symbol = 'Token symbol is required';
    } else if (!loading && !findCoinIdBySymbol(trimmedSymbol)) {
      newErrors.symbol = 'Invalid token symbol. Please enter a valid cryptocurrency symbol.';
    } else {
      // Check if symbol already exists in portfolio (only for new assets)
      const symbolExists = !editingAsset && assets.some(
        asset => asset.symbol.toUpperCase() === trimmedSymbol
      );

      if (symbolExists) {
        newErrors.symbol = 'This token is already in your portfolio. Edit the existing entry instead.';
      }
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (editingAsset) {
      editAsset(editingAsset.id, {
        symbol: form.symbol.toUpperCase(),
        quantity: parseFloat(form.quantity)
      });
    } else {
      addAsset(
        form.symbol.toUpperCase(),
        parseFloat(form.quantity)
      );
    }

    navigate('/');
  };

  // Handle asset deletion
  const handleDeleteAsset = () => {
    if (editingAsset) {
      const confirmed = window.confirm(`Are you sure you want to delete ${editingAsset.symbol}?`);
      if (confirmed) {
        removeAsset(editingAsset.id);
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {editingAsset ? 'Edit Asset' : 'Add New Asset'}
        </h2>

        {/* using the form element is best for accessibility */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextInput
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value })}
              placeholder="Token Symbol (BTC)"
            />
            {errors.symbol && <ErrorMessage message={errors.symbol} />}
          </div>

          <div className="mb-4">
            <NumberInput
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="Quantity"
            />
            {errors.quantity && <ErrorMessage message={errors.quantity} />}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex justify-between gap-4">
              <Button onClick={() => navigate('/')} secondary>
                Cancel
              </Button>
              {editingAsset && (
                <Button
                  onClick={handleDeleteAsset}
                  className="bg-red-500 hover:bg-red-400"
                >
                  Delete
                </Button>
              )}
            </div>
            <Button type="submit">
              {editingAsset ? 'Save' : 'Add'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
