import { useEffect } from 'react'
import type { TodoTab } from '../../types/todo'
import { useTodoLists } from '../../hooks/useTodoLists'
import { useDailyDump } from '../../hooks/useDailyDump'
import { useReminders } from '../../hooks/useReminders'
import LongTermLists from './longterm/LongTermLists'
import DailyDump from './daily/DailyDump'

interface Props {
  activeTab: TodoTab
  onTabChange: (tab: TodoTab) => void
  onTodayCountChange?: (count: number) => void
}

export default function TodoFeature({ activeTab, onTodayCountChange }: Props) {
  const todoLists = useTodoLists()
  const dailyDump = useDailyDump()
  useReminders()

  useEffect(() => {
    onTodayCountChange?.(dailyDump.incompleteTodayCount)
  }, [dailyDump.incompleteTodayCount, onTodayCountChange])

  return (
    <div className="flex flex-col h-full">
      {activeTab === 'lists' && (
        <LongTermLists
          lists={todoLists.lists}
          tasks={todoLists.tasks}
          addList={todoLists.addList}
          renameList={todoLists.renameList}
          deleteList={todoLists.deleteList}
          addTask={todoLists.addTask}
          updateTask={todoLists.updateTask}
          deleteTask={todoLists.deleteTask}
          toggleComplete={todoLists.toggleComplete}
          toggleStar={todoLists.toggleStar}
          reorderTasks={todoLists.reorderTasks}
        />
      )}
      {activeTab === 'today' && (
        <DailyDump
          todayTasks={dailyDump.todayTasks}
          addTask={dailyDump.addTask}
          toggleComplete={dailyDump.toggleComplete}
          deleteTask={dailyDump.deleteTask}
          moveToLongTerm={dailyDump.moveToLongTerm}
          clearCompleted={dailyDump.clearCompleted}
          clearAll={dailyDump.clearAll}
          incompleteTodayCount={dailyDump.incompleteTodayCount}
        />
      )}
    </div>
  )
}
