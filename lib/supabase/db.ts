import { supabase } from './client';
import { Tables } from './types';
import { Expense, Category, UserPreferences, Budget } from '../types';

export async function fetchUserExpenses(userId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
  
  return data?.map(mapExpenseRowToExpense) || [];
}

export async function createUserExpense(
  userId: string, 
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Expense | null> {
  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      user_id: userId,
      amount: expense.amount,
      currency: expense.currency,
      description: expense.description,
      category_id: expense.categoryId,
      date: expense.date,
      notes: expense.notes
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating expense:', error);
    return null;
  }
  
  return data ? mapExpenseRowToExpense(data) : null;
}

export async function fetchUserCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data?.map(mapCategoryRowToCategory) || [];
}

export async function createUserCategory(
  userId: string, 
  category: Omit<Category, 'id'>
): Promise<Category> {
  if (!userId) {
    throw new Error('User ID is required to create a category');
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([{
      user_id: userId.trim(),
      name: category.name,
      color: category.color,
      budget: category.budget || null,
      archived: category.archived || false
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase error creating category:', error);
    throw new Error(error.message);
  } else if (!data) {
    throw new Error('Failed to create category');
  }
  
  return mapCategoryRowToCategory(data);
}

export async function fetchUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data ? {
    currency: data.currency,
    dateFormat: data.date_format,
    numberFormat: data.number_format,
    theme: data.theme
  } : null;
}

export async function updateCategoryBudget(
  userId: string,
  categoryId: string,
  budget: number | null
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .update({ budget })
    .eq('user_id', userId)
    .eq('id', categoryId)
    .select()
    .single();

  if (error) {
    console.error('Error updating category budget:', error);
    throw error;
  }

  return data ? mapCategoryRowToCategory(data) : null;
}

// Mapping functions
function mapExpenseRowToExpense(row: Tables['expenses']['Row']): Expense {
  return {
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    description: row.description,
    categoryId: row.category_id,
    date: row.date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCategoryRowToCategory(row: Tables['categories']['Row']): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    budget: row.budget,
    archived: row.archived
  };
}