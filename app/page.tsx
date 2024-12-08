'use client';
import { useState, useEffect } from 'react';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { getStoredExpenses, getStoredCategories } from '@/lib/store';
import { Expense, Category } from '@/lib/types';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { AskAI } from '@/components/ai/AskAI';
import { BudgetOverview } from '@/components/budget/BudgetOverview';
import { FileSpreadsheet } from 'lucide-react';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';

const useExpenseUpdates = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const handleStorageChange = () => {
      setExpenses(getStoredExpenses());
      setCategories(getStoredCategories());
    };

    // Initial load
    handleStorageChange();

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    // Custom event for immediate updates
    window.addEventListener('expenseUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('expenseUpdated', handleStorageChange);
    };
  }, []);

  return { expenses, categories };
};

export default function Home() {
  const { loading } = useSupabase();
  const { expenses, categories } = useExpenseUpdates();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <AskAI />
        </div>
        <div className="flex flex-col gap-2">
          <AddExpenseDialog />
          <Link href="/expenses/upload">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Import Statement
            </Button>
          </Link>
        </div>
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