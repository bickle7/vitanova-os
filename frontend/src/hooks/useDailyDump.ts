import { useState, useCallback, useEffect, useMemo } from 'react'
import type { DailyTask, LongTermTask } from '../types/todo'
import {
  getDailyTasks,
  saveDailyTasks,
  addDailyTask,
  toggleDailyTaskComplete,
  deleteDailyTask,
  getTodayDateString,
  generateTodoId,
  addLongTermTask,
  getTodoLists,
  getLongTermTasks,
} from '../lib/todoStorage'

export function useDailyDump() {
  const [allDailyTasks, setAllDailyTasks] = useState<DailyTask[]>(() => getDailyTasks())

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
    setAllDailyTasks(toggleDailyTaskComplete(id))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setAllDailyTasks(deleteDailyTask(id))
  }, [])

  // Move a daily task to the first available long-term list
  const moveToLongTerm = useCallback((dailyTask: DailyTask): LongTermTask => {
    const lists = getTodoLists()
    const targetList = lists[0]
    const existing = getLongTermTasks().filter(t => t.listId === targetList?.id && !t.completed)
    const longTermTask: LongTermTask = {
      id: generateTodoId(),
      title: dailyTask.title,
      listId: targetList?.id ?? 'default_list_1',
      starred: false,
      order: existing.length,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    addLongTermTask(longTermTask)
    setAllDailyTasks(deleteDailyTask(dailyTask.id))
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
