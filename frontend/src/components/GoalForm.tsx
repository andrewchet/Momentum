import React, { useState, useEffect } from 'react';
import { goalsAPI } from '../services/api';
import { Goal } from '../types';

interface GoalFormProps {
  goal?: Goal | null;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    targetValue: '',
    targetUnit: '',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goal) {
      setFormData({
        category: goal.category,
        title: goal.title,
        description: goal.description || '',
        targetValue: goal.targetValue?.toString() || '',
        targetUnit: goal.targetUnit || '',
        status: goal.status,
        startDate: goal.startDate.split('T')[0],
        endDate: goal.endDate ? goal.endDate.split('T')[0] : '',
      });
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData: any = {
        ...formData,
        targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null,
      };

      if (!submitData.endDate) {
        delete submitData.endDate;
      }

      if (goal) {
        await goalsAPI.update(goal.id, submitData);
      } else {
        await goalsAPI.create(submitData);
      }

      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {goal ? 'Edit Goal' : 'Create New Goal'}
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
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a category</option>
                <option value="fitness">Fitness</option>
                <option value="nutrition">Nutrition</option>
                <option value="job_search">Job Search</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Run 100 miles this month"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Additional details about your goal..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.targetUnit}
                  onChange={(e) => setFormData({ ...formData, targetUnit: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., miles, kg, applications"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
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

export default GoalForm;
