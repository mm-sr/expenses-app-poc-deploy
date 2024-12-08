import { Category, Expense, UserPreferences } from './types';

const DEFAULT_CATEGORIES: Category[] = [
  // Empty array - no default categories
];

const DEFAULT_PREFERENCES: UserPreferences = {
  currency: 'USD',
  dateFormat: 'dd.MM.yyyy',
  numberFormat: 'en-US',
  theme: 'system'
};

const MOCK_EXPENSES: Expense[] = [];

export function getStoredExpenses(): Expense[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('expenses');
  return stored ? JSON.parse(stored) : [];
}

export function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  const stored = localStorage.getItem('categories');
  return stored ? JSON.parse(stored) : [];
}

export function getStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const stored = localStorage.getItem('preferences');
  return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
}

export function storeExpenses(expenses: Expense[]): void {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  // Dispatch custom event for immediate updates
  window.dispatchEvent(new Event('expenseUpdated'));
}

export function storeCategories(categories: Category[]): void {
  localStorage.setItem('categories', JSON.stringify(categories));
  // Dispatch custom event for immediate updates
  window.dispatchEvent(new Event('expenseUpdated'));
}

export function storePreferences(preferences: UserPreferences): void {
  localStorage.setItem('preferences', JSON.stringify(preferences));
}