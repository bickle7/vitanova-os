import type { TodoList, LongTermTask, DailyTask } from '../types/todo'

const LISTS_KEY      = 'vitanova_todo_lists'
const LONGTERM_KEY   = 'vitanova_longterm_tasks'
const DAILY_KEY      = 'vitanova_daily_tasks'

// ─── Default Lists ─────────────────────────────────────────────────────────

const DEFAULT_LISTS: TodoList[] = [
  { id: 'default_list_1', name: 'List 1', order: 0 },
  { id: 'default_list_2', name: 'List 2', order: 1 },
  { id: 'default_list_3', name: 'List 3', order: 2 },
]

// ─── Todo Lists ────────────────────────────────────────────────────────────

export function getTodoLists(): TodoList[] {
  try {
    const raw = localStorage.getItem(LISTS_KEY)
    if (!raw) return DEFAULT_LISTS
    const parsed = JSON.parse(raw) as TodoList[]
    return parsed.length > 0 ? parsed : DEFAULT_LISTS
  } catch {
    return DEFAULT_LISTS
  }
}

export function saveTodoLists(lists: TodoList[]): void {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists))
}

export function addTodoList(name: string): TodoList[] {
  const lists = getTodoLists()
  const newList: TodoList = {
    id: `list_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    order: lists.length,
  }
  const updated = [...lists, newList]
  saveTodoLists(updated)
  return updated
}

export function renameTodoList(id: string, name: string): TodoList[] {
  const updated = getTodoLists().map(l => l.id === id ? { ...l, name: name.trim() } : l)
  saveTodoLists(updated)
  return updated
}

export function deleteTodoList(id: string): TodoList[] {
  const updated = getTodoLists().filter(l => l.id !== id)
  saveTodoLists(updated)
  return updated
}

// ─── Long Term Tasks ───────────────────────────────────────────────────────

// Migrate old-schema tasks (listCategory + priority) to new schema (listId + starred)
function migrateTasksIfNeeded(tasks: any[]): LongTermTask[] {
  const needsMigration = tasks.some(t => 'listCategory' in t && !('listId' in t))
  if (!needsMigration) return tasks as LongTermTask[]

  // Collect unique categories and create/find list IDs
  const categoryToListId: Record<string, string> = {}
  const newLists: TodoList[] = getTodoLists()

  tasks.forEach(t => {
    const cat: string = t.listCategory ?? 'personal'
    if (!categoryToListId[cat]) {
      // Find existing list with matching name (case-insensitive)
      const existing = newLists.find(l => l.name.toLowerCase() === cat.toLowerCase())
      if (existing) {
        categoryToListId[cat] = existing.id
      } else {
        // Create a new list for this category
        const newList: TodoList = {
          id: `migrated_${cat}_${Date.now()}`,
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          order: newLists.length,
        }
        newLists.push(newList)
        categoryToListId[cat] = newList.id
      }
    }
  })

  saveTodoLists(newLists)
  window.dispatchEvent(new CustomEvent('vitanova:longtermtasks:changed'))

  return tasks.map((t, i) => ({
    id: t.id,
    title: t.title,
    listId: categoryToListId[t.listCategory ?? 'personal'] ?? DEFAULT_LISTS[0].id,
    starred: t.priority === 'high',
    order: i,
    reminderAt: t.dueDate ? `${t.dueDate}T09:00` : undefined,
    completed: t.completed ?? false,
    completedAt: t.completedAt,
    createdAt: t.createdAt ?? new Date().toISOString(),
  }))
}

export function getLongTermTasks(): LongTermTask[] {
  try {
    const raw = localStorage.getItem(LONGTERM_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    const migrated = migrateTasksIfNeeded(parsed)
    // If migration happened, persist the new schema
    if (migrated !== parsed) saveLongTermTasks(migrated)
    return migrated
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

export function reorderLongTermTasks(listId: string, starred: boolean, orderedIds: string[]): LongTermTask[] {
  const tasks = getLongTermTasks()
  const section = tasks.filter(t => t.listId === listId && t.starred === starred && !t.completed)
  const others = tasks.filter(t => !(t.listId === listId && t.starred === starred && !t.completed))

  const reordered = orderedIds.map((id, i) => {
    const task = section.find(t => t.id === id)!
    return { ...task, order: i }
  })

  saveLongTermTasks([...others, ...reordered])
  return getLongTermTasks()
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

// ─── Custom Lists (legacy — kept for migration compat) ─────────────────────
// Superseded by getTodoLists/saveTodoLists

export function getCustomLists(): string[] { return [] }
export function addCustomList(_name: string): string[] { return [] }
export function deleteCustomList(_name: string): string[] { return [] }

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
