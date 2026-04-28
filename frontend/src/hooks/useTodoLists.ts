import { useState, useCallback, useEffect } from 'react'
import type { LongTermTask, ListCategory, Priority } from '../types/todo'
import {
  getLongTermTasks,
  addLongTermTask,
  updateLongTermTask,
  deleteLongTermTask,
  toggleLongTermTaskComplete,
  generateTodoId,
} from '../lib/todoStorage'

// ─── Sort Helper ────────────────────────────────────────────────────────────

export function sortLongTermTasks(tasks: LongTermTask[]): LongTermTask[] {
  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const incomplete = tasks.filter(t => !t.completed)
  const completed = tasks.filter(t => t.completed)

  incomplete.sort((a, b) => {
    // Overdue first
    const aOverdue = a.dueDate ? new Date(a.dueDate + 'T00:00:00') < today : false
    const bOverdue = b.dueDate ? new Date(b.dueDate + 'T00:00:00') < today : false
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1

    // Then priority
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (pDiff !== 0) return pDiff

    // Then soonest due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1

    // Then creation date (oldest first)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  completed.sort((a, b) => {
    const aAt = a.completedAt ? new Date(a.completedAt).getTime() : 0
    const bAt = b.completedAt ? new Date(b.completedAt).getTime() : 0
    return bAt - aAt // most recently completed first
  })

  return [...incomplete, ...completed]
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTodoLists() {
  const [tasks, setTasks] = useState<LongTermTask[]>(() => getLongTermTasks())

  // Sync from storage on focus (multi-tab support)
  useEffect(() => {
    const handleFocus = () => setTasks(getLongTermTasks())
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const addTask = useCallback((params: {
    title: string
    listCategory: ListCategory
    priority: Priority
    dueDate?: string
  }): LongTermTask => {
    const task: LongTermTask = {
      id: generateTodoId(),
      title: params.title.trim(),
      listCategory: params.listCategory,
      priority: params.priority,
      dueDate: params.dueDate || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    const updated = addLongTermTask(task)
    setTasks(updated)
    return task
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<LongTermTask>) => {
    const updated = updateLongTermTask(id, updates)
    setTasks(updated)
  }, [])

  const deleteTask = useCallback((id: string) => {
    const updated = deleteLongTermTask(id)
    setTasks(updated)
  }, [])

  const toggleComplete = useCallback((id: string) => {
    const updated = toggleLongTermTaskComplete(id)
    setTasks(updated)
  }, [])

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
  }
}
