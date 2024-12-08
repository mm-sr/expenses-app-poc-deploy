'use client';

import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Category, Expense } from '@/lib/types';
import { getStoredExpenses, storeExpenses } from '@/lib/store';
import { EditExpenseDialog } from './EditExpenseDialog';
import { Calendar, CreditCard, FileText, Pencil, Tag, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const FIELD_LABELS: Record<string, string> = {
  amount: 'Amount',
  description: 'Description',
  categoryId: 'Category',
  date: 'Date',
  notes: 'Notes'
};

interface ViewExpenseDialogProps {
  expense: Expense;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewExpenseDialog({ expense, categories, open, onOpenChange }: ViewExpenseDialogProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const category = categories.find(c => c.id === expense.categoryId);

  const handleDelete = useCallback(() => {
    const currentExpenses = getStoredExpenses();
    const updatedExpenses = currentExpenses.filter(e => e.id !== expense.id);
    storeExpenses(updatedExpenses);
    setShowDeleteAlert(false);
    onOpenChange(false);
    window.location.reload();
  }, [expense.id, onOpenChange]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Expense Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDeleteAlert(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Amount</h3>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(expense.amount)}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
                </div>
                <p className="text-lg">{expense.description}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Category</h3>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <span>{category?.name || 'Uncategorized'}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">Date</h3>
                </div>
                <p className="text-lg">{format(new Date(expense.date), 'MMMM d, yyyy')}</p>
              </div>

              {expense.notes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium text-sm text-muted-foreground">Notes</h3>
                  </div>
                  <p className="whitespace-pre-wrap text-lg">{expense.notes}</p>
                </div>
              )}

              <div className="border-t pt-4 mt-6">
                <h3 className="font-medium mb-3 text-sm">History</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Created: {format(new Date(expense.createdAt), 'PPp')}</p>
                  <p>Last modified: {format(new Date(expense.updatedAt), 'PPp')}</p>
                </div>
                {expense.history && expense.history.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <h4 className="text-sm font-medium">Changes</h4>
                    {expense.history.map((change, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-muted-foreground">
                          {format(new Date(change.timestamp), 'MMM d, h:mm a')}:
                        </span>{' '}
                        Changed {FIELD_LABELS[change.field] || change.field} from{' '}
                        <span className="font-medium">{change.oldValue}</span> to{' '}
                        <span className="font-medium">{change.newValue}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditExpenseDialog
        expense={expense}
        categories={categories}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={() => {
          setShowEditDialog(false);
          onOpenChange(false);
          window.location.reload();
        }}
      />
    </>
  );
}