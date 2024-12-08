export type Tables = {
  users: {
    Row: {
      id: string
      email: string
      first_name: string | null
      last_name: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      id: string
      email: string
      first_name?: string | null
      last_name?: string | null
    }
    Update: {
      email?: string
      first_name?: string | null
      last_name?: string | null
    }
  }
  categories: {
    Row: {
      id: string
      user_id: string
      name: string
      color: string
      budget: number | null
      archived: boolean
      created_at: string
      updated_at: string
    }
    Insert: {
      user_id: string
      name: string
      color: string
      budget?: number | null
      archived?: boolean
    }
    Update: {
      name?: string
      color?: string
      budget?: number | null
      archived?: boolean
    }
  }
  expenses: {
    Row: {
      id: string
      user_id: string
      category_id: string | null
      amount: number
      currency: string
      description: string
      date: string
      notes: string | null
      created_at: string
      updated_at: string
    }
    Insert: {
      user_id: string
      category_id?: string | null
      amount: number
      currency: string
      description: string
      date: string
      notes?: string | null
    }
    Update: {
      category_id?: string | null
      amount?: number
      currency?: string
      description?: string
      date?: string
      notes?: string | null
    }
  }
}