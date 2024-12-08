'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Category, Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getStoredPreferences } from '@/lib/store';
import { ViewExpenseDialog } from './ViewExpenseDialog';
import { useState } from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  limit?: number;
  showViewButton?: boolean;
}

export function ExpenseList({ expenses, categories, limit, showViewButton }: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayedExpenses = limit ? sortedExpenses.slice(0, limit) : sortedExpenses;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            {showViewButton && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedExpenses.map((expense) => {
            const category = categories.find((c) => c.id === expense.categoryId);
            return (
              <TableRow key={expense.id}>
                <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category?.color }}
                    />
                    {category?.name || 'Uncategorized'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(expense.amount)}
                </TableCell>
                {showViewButton && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedExpense(expense);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedExpense && (
        <ViewExpenseDialog
          expense={selectedExpense}
          categories={categories}
          open={!!selectedExpense}
          onOpenChange={() => setSelectedExpense(null)}
        />
      )}
    </>
  );
}