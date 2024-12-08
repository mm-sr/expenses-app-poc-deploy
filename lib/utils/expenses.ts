import { Category, Expense } from '../types';

export function getCategoryTotals(expenses: Expense[], categories: Category[]) {
  const totals = new Map<string, number>();
  
  expenses.forEach(expense => {
    const current = totals.get(expense.categoryId) || 0;
    totals.set(expense.categoryId, current + expense.amount);
  });
  
  return categories
    .map(category => ({
      name: category.name,
      value: totals.get(category.id) || 0,
      color: category.color,
    }))
    .filter(category => category.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function generateExpenseId(): string {
  return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateExpense(expense: Expense): boolean {
  return (
    expense.amount > 0 &&
    expense.description.trim().length > 0 &&
    expense.categoryId.length > 0 &&
    isValidDate(new Date(expense.date))
  );
}

function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}