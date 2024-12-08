import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { getStoredPreferences } from './store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const preferences = getStoredPreferences();
  return format(new Date(date), preferences.dateFormat);
}

export function formatCurrency(
  amount: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const preferences = getStoredPreferences();

  return new Intl.NumberFormat(preferences.numberFormat, {
    style: 'currency',
    currency: preferences.currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

export function calculatePercentage(value: number, total: number): string {
  return ((value / total) * 100).toFixed(1);
}