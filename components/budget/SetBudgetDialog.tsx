'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/lib/types';
import { getStoredCategories, storeCategories } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { getStoredPreferences } from '@/lib/store';
import { CURRENCIES } from '@/lib/constants';
import { Label } from '@/components/ui/label';

interface SetBudgetDialogProps {
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetBudgetDialog({ categories, open, onOpenChange }: SetBudgetDialogProps) {
  const preferences = getStoredPreferences();
  const currencySymbol = CURRENCIES.find(c => c.code === preferences.currency)?.symbol || '$';

  const [budgets, setBudgets] = useState<Record<string, string>>(() => {
    return categories.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: cat.budget?.toFixed(2) || ''
    }), {});
  });

  const handleSave = () => {
    const updatedCategories = categories.map(cat => ({
      ...cat,
      budget: budgets[cat.id] ? parseFloat(budgets[cat.id]) : undefined
    }));
    storeCategories(updatedCategories);
    onOpenChange(false);
    window.location.reload();
  };

  const handleBudgetChange = (categoryId: string, value: string) => {
    setBudgets(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Manage Category Budgets</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set monthly spending limits for each category.
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={category.budget ? category.budget.toFixed(2) : "0.00"}
                  value={budgets[category.id]}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                      handleBudgetChange(category.id, value);
                    }
                  }}
                  className="w-full pl-8"
                />
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