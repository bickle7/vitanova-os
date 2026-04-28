import { useState, useCallback, useEffect, useMemo } from 'react'
import type { DailyTask, LongTermTask, ListCategory, Priority } from '../types/todo'
import {
  getDailyTasks,
  saveDailyTasks,
  addDailyTask,
  toggleDailyTaskComplete,
  deleteDailyTask,
  getTodayDateString,
  generateTodoId,
} from '../lib/todoStorage'
import { addLongTermTask } from '../lib/todoStorage'

export function useDailyDump() {
  const [allDailyTasks, setAllDailyTasks] = useState<DailyTask[]>(() => getDailyTasks())

  // Sync on focus
  useEffect(() => {
    const handleFocus = () => setAllDailyTasks(getDailyTasks())
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const today = getTodayDateString()

  const todayTasks = useMemo(
    () => allDailyTasks.filter(t => t.date === today),
    [allDailyTasks, today]
  )

  const incompleteTodayCount = useMemo(
    () => todayTasks.filter(t => !t.completed).length,
    [todayTasks]
  )

  const addTask = useCallback((title: string): DailyTask => {
    const task: DailyTask = {
      id: generateTodoId(),
      title: title.trim(),
      completed: false,
      date: getTodayDateString(),
      createdAt: new Date().toISOString(),
    }
    const updated = addDailyTask(task)
    setAllDailyTasks(updated)
    return task
  }, [])

  const toggleComplete = useCallback((id: string) => {
    const updated = toggleDailyTaskComplete(id)
    setAllDailyTasks(updated)
  }, [])

  const deleteTask = useCallback((id: string) => {
    const updated = deleteDailyTask(id)
    setAllDailyTasks(updated)
  }, [])

  const moveToLongTerm = useCallback((
    dailyTask: DailyTask,
    listCategory: ListCategory,
    priority: Priority
  ): LongTermTask => {
    const longTermTask: LongTermTask = {
      id: generateTodoId(),
      title: dailyTask.title,
      listCategory,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    addLongTermTask(longTermTask)
    const updated = deleteDailyTask(dailyTask.id)
    setAllDailyTasks(updated)
    return longTermTask
  }, [])

  const clearCompleted = useCallback(() => {
    const tasks = getDailyTasks()
    const updated = tasks.filter(t => !(t.date === today && t.completed))
    saveDailyTasks(updated)
    setAllDailyTasks(updated)
  }, [today])

  const clearAll = useCallback(() => {
    const tasks = getDailyTasks()
    const updated = tasks.filter(t => t.date !== today)
    saveDailyTasks(updated)
    setAllDailyTasks(updated)
  }, [today])

  return {
    todayTasks,
    allDailyTasks,
    addTask,
    toggleComplete,
    deleteTask,
    moveToLongTerm,
    clearCompleted,
    clearAll,
    incompleteTodayCount,
  }
}
