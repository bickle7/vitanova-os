export interface TodoList {
  id: string
  name: string
  order: number
}

export interface LongTermTask {
  id: string
  title: string
  listId: string
  starred: boolean
  order: number
  reminderAt?: string     // ISO datetime — fires a notification
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
