'use client';

import { useState } from 'react';
import { useSupabase } from '@/lib/hooks/useSupabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CATEGORY_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEEAD', // Yellow
  '#D4A5A5', // Pink
  '#9B59B6', // Purple
  '#3498DB', // Light Blue
  '#E67E22', // Orange
  '#1ABC9C', // Turquoise
];

export function AddCategoryDialog() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const { addCategory } = useSupabase();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a category name',
        variant: 'destructive',
      });
      return;
    }
    // Pick a random color from the predefined palette
    const randomColor = CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
    
    try {
      const newCategory = await addCategory({
        name: name.trim(),
        color: randomColor
      });
      
      if (newCategory) {
        setOpen(false);
        toast({
          title: 'Success',
          description: 'Category added successfully.',
        });
        setName('');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add category. Please try again.';
      console.error('Error adding category:', errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}