import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category, Expense } from '@/lib/types';
import { getStoredCategories, storeCategories } from '@/lib/store';
import { BudgetProgress } from './BudgetProgress';

interface BudgetManagerProps {
  categories: Category[];
  expenses: Expense[];
}

export function BudgetManager({ categories, expenses }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Record<string, string>>(() => {
    return categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat.budget?.toString() || ''
    }), {});
  });

  const handleSave = () => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      budget: budgets[cat.id] ? parseFloat(budgets[cat.id]) : undefined
    }));
    storeCategories(updatedCategories);
    window.location.reload();
  };

  const handleBudgetChange = (categoryId: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Category Budgets</h2>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <div className="space-y-6">
          {categories.map(category => (
            <div key={category.id} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="w-[150px]">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Set budget..."
                    value={budgets[category.id]}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                  />
                </div>
              </div>
              {category.budget && (
                <BudgetProgress 
                  category={category}
                  expenses={expenses}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}