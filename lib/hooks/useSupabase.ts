'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { Expense, Category, UserPreferences } from '@/lib/types';
import { storeExpenses, storeCategories } from '@/lib/store';
import { 
  fetchUserExpenses, 
  fetchUserCategories,
  fetchUserPreferences,
  createUserExpense,
  createUserCategory 
} from '@/lib/supabase/db';

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    // Check current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user data when authenticated
  useEffect(() => {
    if (user) {
      Promise.all([
        fetchUserExpenses(user.id),
        fetchUserCategories(user.id),
        fetchUserPreferences(user.id).catch(() => null)
      ]).then(([expenses, categories, preferences]) => {
        setExpenses(expenses);
        setCategories(categories);
        setPreferences(preferences);
        setLoading(false);
        // Store in local storage for offline access
        storeExpenses(expenses);
        storeCategories(categories);
      });
    }
  }, [user]);

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;
    const newExpense = await createUserExpense(user.id, expense);
    if (newExpense) {
      setExpenses(prev => [newExpense, ...prev]);
    }
    return newExpense;
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) {
      throw new Error('You must be logged in to create a category');
    }
    
    try {
      const newCategory = await createUserCategory(user.id, category);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error: any) {
      console.error('Error in addCategory:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    expenses,
    categories,
    preferences,
    addExpense,
    addCategory
  };
}