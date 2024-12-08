'use client';

import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Expense, Period } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

// Move defaultAxisProps outside component to avoid recreation
const defaultAxisProps = {
  axisLine: false,
  tickLine: false,
};

interface SpendingChartProps {
  expenses: Expense[];
}

export function SpendingChart({ expenses }: SpendingChartProps) {
  const [period, setPeriod] = useState<Period>('week');

  const getChartData = () => {
    const today = new Date();
    let data: { date: string; amount: number }[] = [];

    switch (period) {
      case 'week': {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = subDays(today, i);
          const dayExpenses = expenses.filter(expense => 
            format(new Date(expense.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
          const amount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          data.push({
            date: format(date, 'EEE'),
            amount,
          });
        }
        break;
      }
      case 'month': {
        // Current month by day
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        const days = [];
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          days.push(new Date(d));
        }
        data = days.map(date => {
          const dayExpenses = expenses.filter(expense =>
            format(new Date(expense.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
          return {
            date: format(date, 'd'),
            amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0),
          };
        });
        break;
      }
      case 'year': {
        // Current year by month
        const start = startOfYear(today);
        const months = [];
        for (let m = 0; m < 12; m++) {
          const date = new Date(start);
          date.setMonth(m);
          months.push(date);
        }
        data = months.map(date => {
          const monthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === date.getMonth() &&
                   expenseDate.getFullYear() === date.getFullYear();
          });
          return {
            date: format(date, 'MMM'),
            amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
          };
        });
        break;
      }
    }

    return data;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={period === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('week')}
        >
          Week
        </Button>
        <Button
          variant={period === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('month')}
        >
          Month
        </Button>
        <Button
          variant={period === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('year')}
        >
          Year
        </Button>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getChartData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" {...defaultAxisProps} />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value, { 
                notation: 'compact',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
              {...defaultAxisProps}
            />
            <Tooltip 
              formatter={(value: number) => [
                formatCurrency(value),
                'Amount'
              ]}
            />
            <Bar 
              dataKey="amount" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}