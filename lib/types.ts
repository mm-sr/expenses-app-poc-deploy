export interface Expense {
  id: string;
  amount: number;
  currency: string;
  categoryId: string;
  date: string;
  description: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  history?: ExpenseChange[];
}

export interface ExpenseChange {
  timestamp: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budget?: number;
  archived?: boolean;
}

export interface UserPreferences {
  currency: string;
  dateFormat: string;
  numberFormat: string;
  theme: 'light' | 'dark' | 'system';
}

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  timezone: string;
  currency: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  budgetAlerts: boolean;
  monthlyReport: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
}

export interface PreferenceSettings {
  theme: 'light' | 'dark' | 'system';
  compactView: boolean;
  defaultView: 'dashboard' | 'expenses' | 'budget';
}

export type Period = 'week' | 'month' | 'year';