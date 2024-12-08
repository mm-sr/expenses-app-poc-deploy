'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';
import { getStoredExpenses } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export function AskAI() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    setIsLoading(true);
    try {
      const expenses = getStoredExpenses();
      const context = {
        expenses,
        totalSpent: formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0)),
        expenseCount: expenses.length,
        dateRange: expenses.length > 0 ? {
          start: new Date(Math.min(...expenses.map(e => new Date(e.date).getTime()))).toLocaleDateString(),
          end: new Date(Math.max(...expenses.map(e => new Date(e.date).getTime()))).toLocaleDateString()
        } : null
      };

      // For now, we'll implement a simple local analysis
      let response = '';
      const queryLower = query.toLowerCase();
      
      if (queryLower.includes('total spent')) {
        response = `The total amount spent is ${context.totalSpent}.`;
      } else if (queryLower.includes('number of expenses')) {
        response = `You have recorded ${context.expenseCount} expenses.`;
      } else if (queryLower.includes('date range')) {
        response = context.dateRange 
          ? `Your expenses span from ${context.dateRange.start} to ${context.dateRange.end}.`
          : 'No expenses have been recorded yet.';
      } else {
        response = 'I can help you analyze your expenses. Try asking about total spent, number of expenses, or date range.';
      }

      setAnswer(response);
    } catch (error) {
      setAnswer('Sorry, I encountered an error analyzing your expenses.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MessagesSquare className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Ask AI Assistant</h2>
        </div>
        <div className="flex gap-2 min-w-0">
          <Input
            placeholder="Ask about your expenses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="flex-1 min-w-0"
          />
          <Button 
            onClick={handleAsk}
            disabled={isLoading || !query.trim()}
          >
            Ask
          </Button>
        </div>

        {answer && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{answer}</p>
          </div>
        )}
      </div>
    </Card>
  );
}