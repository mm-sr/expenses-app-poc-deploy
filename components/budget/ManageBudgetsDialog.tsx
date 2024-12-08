'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { updateCategoryBudget } from '@/lib/supabase/db';
import { formatCurrency } from '@/lib/utils';
import { getStoredPreferences } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ManageBudgetsDialogProps {
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageBudgetsDialog({ categories, open, onOpenChange }: ManageBudgetsDialogProps) {
  const preferences = getStoredPreferences();
  const currencySymbol = CURRENCIES.find(c => c.code === preferences.currency)?.symbol || '$';
  const { user } = useSupabase();
  const { toast } = useToast();

  const [budgets, setBudgets] = useState<Record<string, string>>(() => {
    return categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat.budget?.toString() || ''
    }), {});
  });

  const handleRemoveBudget = async (categoryId: string) => {
    if (!user) return;

    try {
      await updateCategoryBudget(user.id, categoryId, null);
      setBudgets(prev => ({ ...prev, [categoryId]: '' }));
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update budgets.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Update each category's budget in parallel
      await Promise.all(
        categories.map(async (category) => {
          const newBudget = budgets[category.id] ? parseFloat(budgets[category.id]) : null;
          if (newBudget !== category.budget) {
            await updateCategoryBudget(user.id, category.id, newBudget);
          }
        })
      );

      toast({
        title: 'Success',
        description: 'Category budgets updated successfully.',
      });
      onOpenChange(false);
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
    }
  };

  const handleBudgetChange = (categoryId: string, value: string) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setBudgets(prev => ({
        ...prev,
        [categoryId]: value
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Category Budgets</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set monthly spending limits for each category.
          </p>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {categories.map(category => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <Label className="font-medium">{category.name}</Label>
                </div>
                {category.budget && (
                  <span className="text-sm text-muted-foreground">
                    Current: {formatCurrency(category.budget)}
                  </span>
                )}
              </div>
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currencySymbol}
                  </span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={budgets[category.id]}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    className="pl-8"
                  />
                </div>
                {budgets[category.id] && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBudget(category.id)}
                    className="h-10 w-10 shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}