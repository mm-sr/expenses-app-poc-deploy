'use client';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Expense } from '@/lib/types';
import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from 'lucide-react';
import { getStoredPreferences } from '@/lib/store';

interface QuickStatsProps {
  expenses: Expense[];
}

export function QuickStats({ expenses }: QuickStatsProps) {
  const preferences = getStoredPreferences();
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate this month's spending
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthSpending = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === thisMonth && 
           expenseDate.getFullYear() === thisYear;
  }).reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate last month's spending
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  const lastMonthSpending = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === lastMonth && 
           expenseDate.getFullYear() === lastMonthYear;
  }).reduce((sum, expense) => sum + expense.amount, 0);

  const monthOverMonthChange = lastMonthSpending === 0 
    ? 100 
    : ((thisMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <WalletIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Spending</p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(totalSpending, { currency: preferences.currency })}
            </h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <WalletIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">This Month</p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(thisMonthSpending, { currency: preferences.currency })}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            {monthOverMonthChange > 0 ? (
              <TrendingUpIcon className="h-6 w-6 text-destructive" />
            ) : (
              <TrendingDownIcon className="h-6 w-6 text-green-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Month over Month</p>
            <h3 className="text-2xl font-bold">
              {monthOverMonthChange > 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
            </h3>
          </div>
        </div>
      </Card>
    </div>
  );
}