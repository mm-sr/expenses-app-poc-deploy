import { Category, Expense, UserPreferences } from './types';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', color: 'hsl(var(--chart-1))', budget: 500 },
  { id: 'transport', name: 'Transportation', color: 'hsl(var(--chart-2))', budget: 200 },
  { id: 'utilities', name: 'Utilities', color: 'hsl(var(--chart-3))', budget: 300 },
  { id: 'entertainment', name: 'Entertainment', color: 'hsl(var(--chart-4))', budget: 150 },
  { id: 'shopping', name: 'Shopping', color: 'hsl(var(--chart-5))', budget: 400 },
];

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  dateFormat: 'MM/dd/yyyy',
  numberFormat: 'en-US',
  theme: 'system'
};

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 42.50,
    currency: 'USD',
    description: 'Groceries',
    categoryId: 'food',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    amount: 29.95,
    currency: 'USD',
    description: 'Movie tickets',
    categoryId: 'entertainment',
    date: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    amount: 120.50,
    currency: 'USD',
    description: 'Electricity bill',
    categoryId: 'utilities',
    date: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
];
export function getStoredExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('expenses');
  return stored ? JSON.parse(stored) : MOCK_EXPENSES;
}

export function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  const stored = localStorage.getItem('categories');
  return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
}

export function getStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const stored = localStorage.getItem('preferences');
  return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
}

export function storeExpenses(expenses: Expense[]): void {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

export function storeCategories(categories: Category[]): void {
  localStorage.setItem('categories', JSON.stringify(categories));
}

export function storePreferences(preferences: UserPreferences): void {
  localStorage.setItem('preferences', JSON.stringify(preferences));
}