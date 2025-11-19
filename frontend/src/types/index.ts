export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  category: 'fitness' | 'nutrition' | 'job_search';
  title: string;
  description?: string;
  targetValue?: number;
  targetUnit?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressEntry {
  id: string;
  goalId: string;
  date: string;
  value: number;
  unit?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalProgress: number;
  categoryBreakdown: {
    category: string;
    count: number;
  }[];
  recentProgress: ProgressEntry[];
}

export interface TrendData {
  date: string;
  value: number;
  category?: string;
}
