'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useToast } from '@/components/ui/use-toast';
import { Download, Trash2 } from 'lucide-react';
import { getStoredExpenses } from '@/lib/store';

export function DataSettings() {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const expenses = getStoredExpenses();
      const data = JSON.stringify(expenses, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expenses-export.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'Your data has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export your data.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.clear();
      toast({
        title: 'Account deleted',
        description: 'Your account and all associated data have been deleted.',
      });
      setShowDeleteDialog(false);
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Data Management</h2>
            <p className="text-sm text-muted-foreground">
              Export your data or delete your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="flex gap-4">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <Button
                variant="destructive"
                className="mt-4 gap-2"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}