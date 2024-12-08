import { format, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, isSameDay } from 'date-fns';
import { Expense, Period } from '../types';

export function getPeriodStart(period: Period, date: Date = new Date()) {
  switch (period) {
    case 'week':
      return startOfWeek(date);
    case 'month':
      return startOfMonth(date);
    case 'year':
      return startOfYear(date);
  }
}

export function getDailyExpenses(expenses: Expense[], startDate: Date, endDate: Date) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.map(day => {
    const dayExpenses = expenses.filter(expense => 
      isSameDay(new Date(expense.date), day)
    );
    
    return {
      date: format(day, 'MMM dd'),
      total: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    };
  });
}