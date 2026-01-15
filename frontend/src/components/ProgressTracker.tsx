import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { goalsAPI, progressAPI } from '../services/api';
import { Goal, ProgressEntry } from '../types';
import ProgressForm from './ProgressForm';

const ProgressTracker: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProgressEntry | null>(null);

  const fetchData = async () => {
    if (!goalId) return;

    try {
      setLoading(true);
      const [goalRes, progressRes] = await Promise.all([
        goalsAPI.getById(goalId),
        progressAPI.getByGoal(goalId),
      ]);
      console.log('Goal Response:', goalRes);
      console.log('Progress Response:', progressRes);
      setGoal(goalRes.data.goal);
      setProgressEntries(progressRes.data.progress || []);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await progressAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
    }
  };

  const handleEdit = (entry: ProgressEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEntry(null);
    fetchData();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateTotal = () => {
    return progressEntries.reduce((sum, entry) => sum + entry.value, 0);
  };

  const calculateAverage = () => {
    if (progressEntries.length === 0) return 0;
    return calculateTotal() / progressEntries.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Goal not found</p>
          <button
            onClick={() => navigate('/goals')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Goals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/goals')}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Goals
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{goal.title}</h1>
        {goal.description && (
          <p className="text-gray-600">{goal.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Progress</h3>
          <p className="text-3xl font-bold text-primary-600">
            {calculateTotal().toFixed(2)} {goal.targetUnit || ''}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Average per Day</h3>
          <p className="text-3xl font-bold text-green-600">
            {calculateAverage().toFixed(2)} {goal.targetUnit || ''}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Target</h3>
          <p className="text-3xl font-bold text-gray-900">
            {goal.targetValue ? `${goal.targetValue} ${goal.targetUnit || ''}` : 'No target set'}
          </p>
        </div>
      </div>

      {/* Progress Entries */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Progress Entries</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
          >
            + Log Progress
          </button>
        </div>

        {progressEntries.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No progress entries yet. Start logging your progress!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {progressEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.value} {entry.unit || goal.targetUnit || ''}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {entry.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Progress Form Modal */}
      {showForm && goalId && (
        <ProgressForm
          goalId={goalId}
          entry={editingEntry}
          defaultUnit={goal.targetUnit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default ProgressTracker;
