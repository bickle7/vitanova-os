import { useState, useEffect } from 'react'
import { Plus, ChevronDown, ChevronRight, Briefcase, User, Home } from 'lucide-react'
import clsx from 'clsx'
import type { LongTermTask, ListCategory } from '../../../types/todo'
import { sortLongTermTasks } from '../../../hooks/useTodoLists'
import { getCustomLists } from '../../../lib/todoStorage'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'

interface Props {
  tasks: LongTermTask[]
  addTask: (params: {
    title: string
    listCategory: ListCategory
    priority: import('../../../types/todo').Priority
    dueDate?: string
  }) => LongTermTask
  updateTask: (id: string, updates: Partial<LongTermTask>) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void
}

type CategoryFilter = 'all' | ListCategory

const BUILT_IN_TABS: { value: string; label: string; Icon?: React.ElementType }[] = [
  { value: 'all',      label: 'All' },
  { value: 'work',     label: 'Work',     Icon: Briefcase },
  { value: 'personal', label: 'Personal', Icon: User },
  { value: 'home',     label: 'Home',     Icon: Home },
]

export default function LongTermLists({ tasks, addTask, updateTask, deleteTask, toggleComplete }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<LongTermTask | undefined>()
  const [completedExpanded, setCompletedExpanded] = useState(false)
  const [customLists, setCustomLists] = useState<string[]>(() => getCustomLists())

  useEffect(() => {
    setCustomLists(getCustomLists())
  }, [showModal])  // refresh when modal opens/closes

  const filteredTasks = activeCategory === 'all'
    ? tasks
    : tasks.filter(t => t.listCategory === activeCategory)

  const sorted = sortLongTermTasks(filteredTasks)
  const incompleteTasks = sorted.filter(t => !t.completed)
  const completedTasks = sorted.filter(t => t.completed)

  const countFor = (cat: CategoryFilter) => {
    const base = cat === 'all' ? tasks : tasks.filter(t => t.listCategory === cat)
    return base.filter(t => !t.completed).length
  }

  const handleSave = (params: {
    title: string
    listCategory: ListCategory
    priority: import('../../../types/todo').Priority
    dueDate?: string
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title: params.title,
        listCategory: params.listCategory,
        priority: params.priority,
        dueDate: params.dueDate,
      })
    } else {
      addTask(params)
    }
    setEditingTask(undefined)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[...BUILT_IN_TABS, ...customLists.map(name => ({ value: name, label: name, Icon: undefined }))].map(({ value, label, Icon }) => {
            const count = countFor(value)
            return (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={clsx(
                  'pill-btn flex items-center gap-1.5 flex-shrink-0',
                  activeCategory === value ? 'pill-btn-active' : 'pill-btn-inactive'
                )}
              >
                {Icon && <Icon size={12} />}
                {label}
                {count > 0 && (
                  <span className={clsx(
                    'text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center',
                    activeCategory === value
                      ? 'bg-bg-primary/30 text-bg-primary'
                      : 'bg-accent/20 text-accent'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-32">
        {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
              <Plus size={28} className="text-text-muted" />
            </div>
            <p className="text-text-secondary font-medium">
            {activeCategory === 'all'      ? 'No tasks yet — you\'re all clear!'
            : activeCategory === 'work'     ? 'No work tasks. Enjoy the breathing room.'
            : activeCategory === 'personal' ? 'No personal tasks. Time to think big.'
            : activeCategory === 'home'     ? 'No home tasks. Looks tidy in here.'
            : `No ${activeCategory} tasks yet.`}
          </p>
            <p className="text-text-muted text-sm mt-1">Tap + to add your first task</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Incomplete tasks */}
            {incompleteTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleComplete}
                onDelete={deleteTask}
                onEdit={t => {
                  setEditingTask(t)
                  setShowModal(true)
                }}
              />
            ))}

            {/* Completed section */}
            {completedTasks.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setCompletedExpanded(v => !v)}
                  className="flex items-center gap-2 mb-3 press-active"
                >
                  {completedExpanded
                    ? <ChevronDown size={15} className="text-text-muted" />
                    : <ChevronRight size={15} className="text-text-muted" />
                  }
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {completedTasks.length} completed
                  </span>
                </button>

                {completedExpanded && (
                  <div className="space-y-2">
                    {completedTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggleComplete={toggleComplete}
                        onDelete={deleteTask}
                        onEdit={t => {
                          setEditingTask(t)
                          setShowModal(true)
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          setEditingTask(undefined)
          setShowModal(true)
        }}
        className="fab"
        aria-label="Add task"
      >
        <Plus size={24} className="text-bg-primary" strokeWidth={2.5} />
      </button>

      {/* Add/Edit Modal */}
      {showModal && (
        <AddTaskModal
          onClose={() => {
            setShowModal(false)
            setEditingTask(undefined)
          }}
          onSave={handleSave}
          initialValues={editingTask}
          customLists={customLists}
          onCustomListAdded={setCustomLists}
        />
      )}
    </div>
  )
}
