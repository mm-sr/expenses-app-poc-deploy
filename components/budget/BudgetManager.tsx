import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Category, Expense } from '@/lib/types';
import { storeCategories } from '@/lib/store';
import { BudgetProgress } from './BudgetProgress';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const handleSave = useCallback(() => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      budget: budgets[cat.id] ? parseFloat(budgets[cat.id]) : undefined
    }));
    storeCategories(updatedCategories);
    window.dispatchEvent(new Event('expenseUpdated'));
    toast({
      title: 'Success',
      description: 'Budget changes saved successfully.',
    });
  }, [budgets, categories, toast]);

  const handleBudgetChange = (categoryId: string, value: string) => {
    // Allow empty string or valid decimal number with up to 2 decimal places
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) { 
      setBudgets(prev => ({
        ...prev,
        [categoryId]: value
      }));
    }
  };

  const handleRemoveBudget = (categoryId: string) => {
    setBudgets(prev => ({
      ...prev,
      [categoryId]: ''
    }));
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Category Budgets</h2>
          <Button onClick={handleSave} size="sm">Save Changes</Button>
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
                <div className="flex items-center gap-2">
                  <div className="relative w-[120px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="Set budget..."
                    value={budgets[category.id]}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    className="pl-8 pr-4 h-9 text-sm transition-colors focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  </div>
                  {budgets[category.id] && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveBudget(category.id)}
                      className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
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