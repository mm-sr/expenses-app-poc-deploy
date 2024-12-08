import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getStoredPreferences } from './store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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