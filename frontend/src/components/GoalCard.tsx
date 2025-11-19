import React from 'react';
import { Goal } from '../types';
import { useNavigate } from 'react-router-dom';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness':
        return 'bg-green-100 text-green-800';
      case 'nutrition':
        return 'bg-orange-100 text-orange-800';
      case 'job_search':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{goal.title}</h3>
          <div className="flex gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
              {goal.category.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
              {goal.status}
            </span>
          </div>
        </div>
      </div>

      {goal.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{goal.description}</p>
      )}

      {goal.targetValue && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Target:</span> {goal.targetValue} {goal.targetUnit || ''}
          </p>
        </div>
      )}

      <div className="mb-4 text-sm text-gray-600">
        <p>Start: {formatDate(goal.startDate)}</p>
        {goal.endDate && <p>End: {formatDate(goal.endDate)}</p>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/goals/${goal.id}/progress`)}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-200"
        >
          View Progress
        </button>
        <button
          onClick={() => onEdit(goal)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
