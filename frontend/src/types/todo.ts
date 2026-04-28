export type ListCategory = 'work' | 'personal' | 'home'
export type Priority = 'high' | 'medium' | 'low'

export interface LongTermTask {
  id: string
  title: string
  listCategory: ListCategory
  priority: Priority
  dueDate?: string        // ISO date string YYYY-MM-DD
  completed: boolean
  completedAt?: string
  createdAt: string
}

export interface DailyTask {
  id: string
  title: string
  completed: boolean
  date: string            // YYYY-MM-DD — the day this belongs to
  createdAt: string
}

export type TodoTab = 'lists' | 'today'
