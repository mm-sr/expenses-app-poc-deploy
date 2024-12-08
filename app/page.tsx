'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { getStoredExpenses, getStoredCategories } from '@/lib/store';
import { Expense, Category } from '@/lib/types';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { AskAI } from '@/components/ai/AskAI';
import { BudgetOverview } from '@/components/budget/BudgetOverview';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setExpenses(getStoredExpenses());
    setCategories(getStoredCategories());
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <AskAI />
        </div>
        <AddExpenseDialog />
      </div>
      
      <QuickStats expenses={expenses} />
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Spending Overview</h2>
          <SpendingChart expenses={expenses} />
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          <CategoryBreakdown expenses={expenses} categories={categories} />
        </Card>
      </div>

      <BudgetOverview 
        categories={categories}
        expenses={expenses}
      />

      <RecentTransactions 
        expenses={expenses} 
        categories={categories}
      />
    </div>
  );
}