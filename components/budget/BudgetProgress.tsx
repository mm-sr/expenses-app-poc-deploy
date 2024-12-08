import { Progress } from '@/components/ui/progress';
import { Category, Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface BudgetProgressProps {
  category: Category;
  expenses: Expense[];
}

export function BudgetProgress({ category, expenses }: BudgetProgressProps) {
  if (!category.budget) return null;

  const spent = expenses
    .filter(e => e.categoryId === category.id)
    .reduce((sum, e) => sum + e.amount, 0);
  
  const progress = Math.min((spent / category.budget) * 100, 100);
  const remaining = Math.max(category.budget - spent, 0);
  const isOverBudget = spent > category.budget;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {formatCurrency(spent)} spent
        </span>
        <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
          {isOverBudget ? "Over budget!" : formatCurrency(remaining)}
        </span>
      </div>
      <Progress 
        value={progress} 
        className={isOverBudget ? "bg-destructive/20" : ""}
        indicatorClassName={isOverBudget ? "bg-destructive" : undefined}
      />
      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          Budget: {formatCurrency(category.budget)}
        </span>
      </div>
    </div>
  );
}