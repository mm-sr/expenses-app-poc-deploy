'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, Mic, PlusCircle, Upload, X } from 'lucide-react';
import { getStoredCategories, getStoredExpenses, storeExpenses } from '@/lib/store';
import { Category, Expense } from '@/lib/types';
import { CURRENCIES } from '@/lib/constants';
import { AddCategoryDialog } from './AddCategoryDialog';

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const categories = getStoredCategories();
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(transcript);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      currency,
      description,
      categoryId,
      date: new Date(date).toISOString(),
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentExpenses = getStoredExpenses();
    storeExpenses([newExpense, ...currentExpenses]);

    setOpen(false);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setCategoryId('');
    setReceipt(null);
    setPreviewUrl(null);
    
    // Force reload to update the UI
    window.location.reload();
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveReceipt = () => {
    setReceipt(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter the expense details below.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick Input Options</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 h-[100px] border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors">
                {previewUrl ? (
                  <div className="relative h-full aspect-square">
                    <img
                      src={previewUrl}
                      alt="Receipt preview"
                      className="rounded-lg object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={handleRemoveReceipt}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 w-full">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium">Scan Receipt</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Upload & auto-fill
                      </p>
                    </div>
                    <Label
                      htmlFor="receipt-upload"
                      className="cursor-pointer shrink-0"
                    >
                      <Button variant="secondary" size="sm" type="button">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </Label>
                    <Input
                      id="receipt-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleReceiptUpload}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 h-[100px] border-2 border-dashed rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2 px-4 w-full">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Mic className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium">Voice Input</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Speak to add expense
                    </p>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    type="button" 
                    disabled={!('webkitSpeechRecognition' in window)}
                    onClick={startListening}
                    className={isListening ? "bg-red-100 hover:bg-red-200" : ""}
                  >
                    {isListening ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-pulse">●</span>
                        <span className="text-xs">Recording...</span>
                      </span>
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm">Amount</Label>
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
                placeholder={`${CURRENCIES.find(c => c.code === currency)?.symbol}0.00`}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              required
              className="bg-background"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2">
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: Category) => (
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
              <AddCategoryDialog />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              required
              className="bg-background"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              className="bg-background resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>

          <Button type="submit" className="w-full mt-6">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}