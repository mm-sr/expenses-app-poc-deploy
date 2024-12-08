'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStoredExpenses, storeExpenses } from '@/lib/store';
import { Category, Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { CURRENCIES } from '@/lib/constants';

interface EditExpenseDialogProps {
  expense: Expense;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditExpenseDialog({ 
  expense, 
  categories, 
  open, 
  onOpenChange,
  onSuccess 
}: EditExpenseDialogProps) {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [currency, setCurrency] = useState(expense.currency);
  const [description, setDescription] = useState(expense.description);
  const [date, setDate] = useState(expense.date.split('T')[0]);
  const [notes, setNotes] = useState(expense.notes || '');
  const [categoryId, setCategoryId] = useState(expense.categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track changes
    const changes = [];
    if (parseFloat(amount) !== expense.amount) {
      changes.push({
        field: 'amount',
        oldValue: formatCurrency(expense.amount),
        newValue: formatCurrency(parseFloat(amount)),
        timestamp: new Date().toISOString()
      });
    }
    if (description !== expense.description) {
      changes.push({
        field: 'description',
        oldValue: expense.description,
        newValue: description,
        timestamp: new Date().toISOString()
      });
    }
    if (categoryId !== expense.categoryId) {
      const oldCategory = categories.find(c => c.id === expense.categoryId);
      const newCategory = categories.find(c => c.id === categoryId);
      changes.push({
        field: 'categoryId',
        oldValue: oldCategory?.name || 'Uncategorized',
        newValue: newCategory?.name || 'Uncategorized',
        timestamp: new Date().toISOString()
      });
    }
    if (date !== expense.date.split('T')[0]) {
      changes.push({
        field: 'date',
        oldValue: format(new Date(expense.date), 'MMMM d, yyyy'),
        newValue: format(new Date(date), 'MMMM d, yyyy'),
        timestamp: new Date().toISOString()
      });
    }
    if (notes !== (expense.notes || '')) {
      changes.push({
        field: 'notes',
        oldValue: expense.notes || 'No notes',
        newValue: notes || 'No notes',
        timestamp: new Date().toISOString()
      });
    }

    const updatedExpense: Expense = {
      ...expense,
      amount: parseFloat(amount),
      currency,
      description,
      categoryId,
      date: new Date(date).toISOString(),
      notes,
      history: [...(expense.history || []), ...changes],
      updatedAt: new Date().toISOString(),
    };

    const currentExpenses = getStoredExpenses();
    const updatedExpenses = currentExpenses.map(e => 
      e.id === expense.id ? updatedExpense : e
    );
    
    storeExpenses(updatedExpenses);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}