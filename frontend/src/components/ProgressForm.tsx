import React, { useState, useEffect } from 'react';
import { progressAPI } from '../services/api';
import { ProgressEntry } from '../types';

interface ProgressFormProps {
  goalId: string;
  entry?: ProgressEntry | null;
  defaultUnit?: string;
  onClose: () => void;
}

const ProgressForm: React.FC<ProgressFormProps> = ({ goalId, entry, defaultUnit, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    value: '',
    unit: defaultUnit || '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date.split('T')[0],
        value: entry.value.toString(),
        unit: entry.unit || defaultUnit || '',
        notes: entry.notes || '',
      });
    }
  }, [entry, defaultUnit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        goalId,
        date: formData.date,
        value: parseFloat(formData.value),
        unit: formData.unit || null,
        notes: formData.notes || null,
      };

      if (entry) {
        await progressAPI.update(entry.id, submitData);
      } else {
        await progressAPI.create(submitData);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {entry ? 'Edit Progress Entry' : 'Log Progress'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                max={new Date().toISOString().split('T')[0]}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 5.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., miles, kg, applications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Saving...' : entry ? 'Update Entry' : 'Log Progress'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgressForm;
