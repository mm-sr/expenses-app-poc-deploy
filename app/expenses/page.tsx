'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getStoredExpenses, getStoredCategories } from '@/lib/store';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import Link from 'next/link';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setExpenses(getStoredExpenses());
    setCategories(getStoredCategories());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">All Expenses</h1>
      </div>
      
      <ExpenseList 
        expenses={expenses} 
        categories={categories}
        showViewButton
      />
    </div>
  );
}