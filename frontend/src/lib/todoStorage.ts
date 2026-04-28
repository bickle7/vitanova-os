import type { LongTermTask, DailyTask } from '../types/todo'

const LONGTERM_KEY = 'vitanova_longterm_tasks'
const DAILY_KEY = 'vitanova_daily_tasks'

// ─── Long Term Tasks ───────────────────────────────────────────────────────

export function getLongTermTasks(): LongTermTask[] {
  try {
    const raw = localStorage.getItem(LONGTERM_KEY)
    if (!raw) return []
    return JSON.parse(raw) as LongTermTask[]
  } catch {
    return []
  }
}

export function saveLongTermTasks(tasks: LongTermTask[]): void {
  try {
    localStorage.setItem(LONGTERM_KEY, JSON.stringify(tasks))
  } catch (e) {
    console.error('Failed to save long-term tasks', e)
  }
}

export function addLongTermTask(task: LongTermTask): LongTermTask[] {
  const tasks = getLongTermTasks()
  if (tasks.find(t => t.id === task.id)) return tasks
  const updated = [task, ...tasks]
  saveLongTermTasks(updated)
  // Notify other hook instances (e.g. after moveToLongTerm from DailyDump)
  window.dispatchEvent(new CustomEvent('vitanova:longtermtasks:changed'))
  return updated
}

export function updateLongTermTask(id: string, updates: Partial<LongTermTask>): LongTermTask[] {
  const tasks = getLongTermTasks()
  const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  saveLongTermTasks(updated)
  return updated
}

export function deleteLongTermTask(id: string): LongTermTask[] {
  const tasks = getLongTermTasks()
  const updated = tasks.filter(t => t.id !== id)
  saveLongTermTasks(updated)
  return updated
}

export function toggleLongTermTaskComplete(id: string): LongTermTask[] {
  const tasks = getLongTermTasks()
  const updated = tasks.map(t => {
    if (t.id !== id) return t
    const nowComplete = !t.completed
    return {
      ...t,
      completed: nowComplete,
      completedAt: nowComplete ? new Date().toISOString() : undefined,
    }
  })
  saveLongTermTasks(updated)
  return updated
}

// ─── Daily Tasks ───────────────────────────────────────────────────────────

export function getDailyTasks(): DailyTask[] {
  try {
    const raw = localStorage.getItem(DAILY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DailyTask[]
  } catch {
    return []
  }
}

export function saveDailyTasks(tasks: DailyTask[]): void {
  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(tasks))
  } catch (e) {
    console.error('Failed to save daily tasks', e)
  }
}

export function addDailyTask(task: DailyTask): DailyTask[] {
  const tasks = getDailyTasks()
  if (tasks.find(t => t.id === task.id)) return tasks
  const updated = [task, ...tasks]
  saveDailyTasks(updated)
  return updated
}

export function updateDailyTask(id: string, updates: Partial<DailyTask>): DailyTask[] {
  const tasks = getDailyTasks()
  const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  saveDailyTasks(updated)
  return updated
}

export function deleteDailyTask(id: string): DailyTask[] {
  const tasks = getDailyTasks()
  const updated = tasks.filter(t => t.id !== id)
  saveDailyTasks(updated)
  return updated
}

export function toggleDailyTaskComplete(id: string): DailyTask[] {
  const tasks = getDailyTasks()
  const updated = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )
  saveDailyTasks(updated)
  return updated
}

// ─── Custom Lists ──────────────────────────────────────────────────────────

const CUSTOM_LISTS_KEY = 'vitanova_custom_lists'

export function getCustomLists(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_LISTS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function addCustomList(name: string): string[] {
  const lists = getCustomLists()
  const trimmed = name.trim()
  if (!trimmed || lists.includes(trimmed)) return lists
  const updated = [...lists, trimmed]
  localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updated))
  return updated
}

export function deleteCustomList(name: string): string[] {
  const updated = getCustomLists().filter(l => l !== name)
  localStorage.setItem(CUSTOM_LISTS_KEY, JSON.stringify(updated))
  return updated
}

// ─── Utilities ─────────────────────────────────────────────────────────────

export function getTodayDateString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function generateTodoId(): string {
  return `todo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
