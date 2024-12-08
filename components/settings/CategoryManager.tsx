'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Category } from '@/lib/types';
import { useState, useEffect } from 'react';
import { getStoredCategories, storeCategories } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Archive, Edit2, Plus, Trash2 } from 'lucide-react';

export function CategoryManager() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setCategories(getStoredCategories());
  }, []);

  const handleSaveCategory = (category: Category) => {
    const updatedCategories = editingCategory
      ? categories.map((c) => (c.id === category.id ? category : c))
      : [...categories, { ...category, id: `cat_${Date.now()}` }];

    setCategories(updatedCategories);
    storeCategories(updatedCategories);
    setIsDialogOpen(false);
    setEditingCategory(null);

    toast({
      title: editingCategory ? 'Category updated' : 'Category added',
      description: `Successfully ${editingCategory ? 'updated' : 'added'} category "${category.name}"`,
    });
  };

  const handleDeleteCategory = (category: Category) => {
    const updatedCategories = categories.filter((c) => c.id !== category.id);
    setCategories(updatedCategories);
    storeCategories(updatedCategories);

    toast({
      title: 'Category deleted',
      description: `Successfully deleted category "${category.name}"`,
    });
  };

  const handleArchiveCategory = (category: Category) => {
    const updatedCategories = categories.map((c) =>
      c.id === category.id ? { ...c, archived: !c.archived } : c
    );
    setCategories(updatedCategories);
    storeCategories(updatedCategories);

    toast({
      title: category.archived ? 'Category restored' : 'Category archived',
      description: `Successfully ${category.archived ? 'restored' : 'archived'} category "${
        category.name
      }"`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your expense categories</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CategoryForm
              category={editingCategory}
              onSave={handleSaveCategory}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between space-x-2 rounded-lg border p-4"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className={category.archived ? 'text-muted-foreground line-through' : ''}>
                  {category.name}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingCategory(category);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleArchiveCategory(category)}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface CategoryFormProps {
  category?: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || '#000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: category?.id || '',
      name,
      color,
      archived: category?.archived || false,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogDescription>
          {category ? 'Update category details below.' : 'Enter category details below.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="color" className="text-right">
            Color
          </Label>
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="col-span-3 h-10"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{category ? 'Update' : 'Add'} Category</Button>
      </DialogFooter>
    </form>
  );
}