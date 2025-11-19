import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const categoryColors = {
    fitness: 'rgb(34, 197, 94)',
    nutrition: 'rgb(249, 115, 22)',
    job_search: 'rgb(59, 130, 246)',
  };

  const categoryData = {
    labels: stats?.categoryBreakdown?.map((item: any) => 
      item.category.replace('_', ' ').charAt(0).toUpperCase() + 
      item.category.replace('_', ' ').slice(1)
    ) || [],
    datasets: [
      {
        data: stats?.categoryBreakdown?.map((item: any) => item.count) || [],
        backgroundColor: [
          categoryColors.fitness,
          categoryColors.nutrition,
          categoryColors.job_search,
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600">Here's an overview of your progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Goals</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalGoals || 0}</p>
            </div>
            <div className="bg-primary-100 rounded-full p-3">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Goals</p>
              <p className="text-3xl font-bold text-green-600">{stats?.activeGoals || 0}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.completedGoals || 0}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Entries</p>
              <p className="text-3xl font-bold text-purple-600">{stats?.totalProgress || 0}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Goals by Category</h2>
          {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No goals yet</p>
          )}
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Progress</h2>
          {stats?.recentProgress && stats.recentProgress.length > 0 ? (
            <div className="space-y-4">
              {stats.recentProgress.slice(0, 5).map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.value} {entry.unit || ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-gray-600 italic max-w-xs truncate">
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No progress entries yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to make progress?</h2>
        <p className="mb-6 text-primary-100">Track your goals and see your progress grow</p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/goals"
            className="bg-white text-primary-600 hover:bg-primary-50 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
          >
            View All Goals
          </Link>
          <Link
            to="/goals"
            className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
          >
            Create New Goal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
