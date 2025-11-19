import React, { useState, useEffect } from 'react';
import { goalsAPI } from '../services/api';
import { Goal } from '../types';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';

const GoalList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      
      const response = await goalsAPI.getAll(params);
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalsAPI.delete(id);
        fetchGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingGoal(null);
    fetchGoals();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          + New Goal
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Categories</option>
            <option value="fitness">Fitness</option>
            <option value="nutrition">Nutrition</option>
            <option value="job_search">Job Search</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No goals found. Create your first goal to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default GoalList;
