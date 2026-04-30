import { useState, useCallback, useEffect } from 'react'
import type { TodoList, LongTermTask } from '../types/todo'
import {
  getTodoLists, addTodoList, renameTodoList, deleteTodoList,
  getLongTermTasks, saveLongTermTasks, addLongTermTask, updateLongTermTask, deleteLongTermTask,
  toggleLongTermTaskComplete, reorderLongTermTasks, generateTodoId,
} from '../lib/todoStorage'

// ─── Sort helper ─────────────────────────────────────────────────────────────

export function sortTasksForDisplay(tasks: LongTermTask[]): LongTermTask[] {
  const incomplete = tasks.filter(t => !t.completed)
  const completed  = tasks.filter(t => t.completed)

  const starred    = incomplete.filter(t => t.starred).sort((a, b) => a.order - b.order)
  const unstarred  = incomplete.filter(t => !t.starred).sort((a, b) => a.order - b.order)

  completed.sort((a, b) => {
    const aAt = a.completedAt ? new Date(a.completedAt).getTime() : 0
    const bAt = b.completedAt ? new Date(b.completedAt).getTime() : 0
    return bAt - aAt
  })

  return [...starred, ...unstarred, ...completed]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTodoLists() {
  const [lists, setLists]   = useState<TodoList[]>(() => getTodoLists())
  const [tasks, setTasks]   = useState<LongTermTask[]>(() => getLongTermTasks())

  // Sync on focus + cross-hook changes (DailyDump moveToLongTerm)
  useEffect(() => {
    const refresh = () => {
      setLists(getTodoLists())
      setTasks(getLongTermTasks())
    }
    window.addEventListener('focus', refresh)
    window.addEventListener('vitanova:longtermtasks:changed', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('vitanova:longtermtasks:changed', refresh)
    }
  }, [])

  // ── List operations ──────────────────────────────────────────────────────

  const addList = useCallback((name: string) => {
    setLists(addTodoList(name))
  }, [])

  const renameList = useCallback((id: string, name: string) => {
    setLists(renameTodoList(id, name))
  }, [])

  const deleteList = useCallback((id: string) => {
    const remaining = getLongTermTasks().filter(t => t.listId !== id)
    saveLongTermTasks(remaining)
    setTasks(remaining)
    setLists(deleteTodoList(id))
  }, [])

  // ── Task operations ──────────────────────────────────────────────────────

  const addTask = useCallback((params: { title: string; listId: string }): LongTermTask => {
    const existingTasks = getLongTermTasks()
    const listTasks = existingTasks.filter(t => t.listId === params.listId && !t.starred && !t.completed)
    const task: LongTermTask = {
      id: generateTodoId(),
      title: params.title.trim(),
      listId: params.listId,
      starred: false,
      order: listTasks.length,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks(addLongTermTask(task))
    return task
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<LongTermTask>) => {
    setTasks(updateLongTermTask(id, updates))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(deleteLongTermTask(id))
  }, [])

  const toggleComplete = useCallback((id: string) => {
    setTasks(toggleLongTermTaskComplete(id))
  }, [])

  const toggleStar = useCallback((id: string) => {
    const task = getLongTermTasks().find(t => t.id === id)
    if (!task) return
    setTasks(updateLongTermTask(id, { starred: !task.starred }))
  }, [])

  const reorderTasks = useCallback((listId: string, starred: boolean, orderedIds: string[]) => {
    setTasks(reorderLongTermTasks(listId, starred, orderedIds))
  }, [])

  return {
    lists,
    tasks,
    addList,
    renameList,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleStar,
    reorderTasks,
  }
}
