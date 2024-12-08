'use client';

import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Category, Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExpenseList } from '@/components/expenses/ExpenseList';

interface RecentTransactionsProps {
  expenses: Expense[];
  categories: Category[];
}

export function RecentTransactions({ expenses, categories }: RecentTransactionsProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link href="/expenses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        
        <ExpenseList
          expenses={expenses}
          categories={categories}
          limit={5}
          showViewButton
        />
      </div>
    </Card>
  );
}