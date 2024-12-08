'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, Expense } from '@/lib/types';
import { BudgetProgress } from './BudgetProgress';
import { SetBudgetDialog } from './SetBudgetDialog';
import { Wallet } from 'lucide-react';

interface BudgetOverviewProps {
  categories: Category[];
  expenses: Expense[];
}

export function BudgetOverview({ categories, expenses }: BudgetOverviewProps) {
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const categoriesWithBudget = categories.filter(c => c.budget);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Budget Overview</h2>
          </div>
          <Button onClick={() => setShowBudgetDialog(true)}>
            Manage Budgets
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categoriesWithBudget.map(category => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <BudgetProgress 
                category={category}
                expenses={expenses}
              />
            </div>
          ))}
        </div>

        {categoriesWithBudget.length === 0 && (
          <div className="text-center text-muted-foreground py-6">
            <p>No budgets set. Click "Manage Budgets" to get started.</p>
          </div>
        )}
      </div>

      <SetBudgetDialog
        categories={categories}
        open={showBudgetDialog}
        onOpenChange={setShowBudgetDialog}
      />
    </Card>
  );
}