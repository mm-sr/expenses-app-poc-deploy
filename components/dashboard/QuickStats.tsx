'use client';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Expense } from '@/lib/types';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { getStoredPreferences } from '@/lib/store';

interface QuickStatsProps {
  expenses: Expense[];
}

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <div className="flex items-center text-sm">
              {change.value > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={change.value > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(change.value)}%
              </span>
            </div>
          )}
        </div>
        {change && (
          <p className="text-sm text-muted-foreground">{change.label}</p>
        )}
      </div>
      {icon && (
        <div className="absolute right-6 top-6 p-2 bg-primary/10 rounded-full">
          {icon}
        </div>
      )}
    </Card>
  );
}

export function QuickStats({ expenses }: QuickStatsProps) {
  const preferences = getStoredPreferences();
  const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthSpending = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === thisMonth && 
           expenseDate.getFullYear() === thisYear;
  }).reduce((sum, expense) => sum + expense.amount, 0);

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

  const categories = new Set(expenses.map(e => e.categoryId));
  const activeBudgets = categories.size;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Spent"
        value={formatCurrency(totalSpending)}
        change={{
          value: monthOverMonthChange,
          label: "from last month"
        }}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
      />
      
      <StatCard
        title="This Month"
        value={formatCurrency(thisMonthSpending)}
        change={{
          value: monthOverMonthChange,
          label: "vs last month"
        }}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
      />
      
      <StatCard
        title="Active Budgets"
        value={activeBudgets.toString()}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
      />
    </div>
  );
}