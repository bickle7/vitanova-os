import { useState, useRef, useEffect } from 'react'
import { Plus, Star, Check, GripVertical, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TodoList, LongTermTask } from '../../../types/todo'
import { sortTasksForDisplay } from '../../../hooks/useTodoLists'
import TaskDetail from './TaskDetail'

interface Props {
  lists: TodoList[]
  tasks: LongTermTask[]
  addList: (name: string) => void
  renameList: (id: string, name: string) => void
  deleteList: (id: string) => void
  addTask: (params: { title: string; listId: string }) => LongTermTask
  updateTask: (id: string, updates: Partial<LongTermTask>) => void
  deleteTask: (id: string) => void
  toggleComplete: (id: string) => void
  toggleStar: (id: string) => void
  reorderTasks: (listId: string, starred: boolean, orderedIds: string[]) => void
}

// ── Sortable task row ───────────────────────────────────────────────────────

function SortableRow({
  task, onTap, onToggleComplete, onToggleStar,
}: {
  task: LongTermTask
  onTap: (task: LongTermTask) => void
  onToggleComplete: (id: string) => void
  onToggleStar: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'card px-3 py-3 flex items-center gap-2 transition-opacity duration-200',
        task.completed && 'opacity-50'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-text-muted cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id)}
        className={clsx(
          'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 press-active',
          task.completed
            ? 'bg-accent border-accent'
            : 'border-border-subtle hover:border-accent/60'
        )}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <Check size={11} strokeWidth={3} className="text-bg-primary" />}
      </button>

      {/* Title — tap to open detail */}
      <button
        className="flex-1 text-left min-w-0 press-active"
        onClick={() => onTap(task)}
      >
        <p className={clsx(
          'text-sm font-medium leading-snug truncate',
          task.completed ? 'line-through text-text-muted' : 'text-text-primary'
        )}>
          {task.title}
        </p>
        {task.reminderAt && !task.completed && (
          <p className="text-[10px] text-accent mt-0.5">
            ⏰ {new Date(task.reminderAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </button>

      {/* Star */}
      <button
        onClick={() => onToggleStar(task.id)}
        className={clsx(
          'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center press-active transition-colors',
          task.starred ? 'text-accent' : 'text-text-muted hover:text-accent/60'
        )}
        aria-label={task.starred ? 'Unstar' : 'Star'}
      >
        <Star size={14} className={task.starred ? 'fill-accent' : ''} />
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function LongTermLists({
  lists, tasks,
  addList, renameList, deleteList,
  addTask, updateTask, deleteTask, toggleComplete, toggleStar, reorderTasks,
}: Props) {
  const [activeListId, setActiveListId] = useState<string>(() => lists[0]?.id ?? '')
  const [inputValue, setInputValue]     = useState('')
  const [detailTask, setDetailTask]     = useState<LongTermTask | null>(null)
  const [completedExpanded, setCompletedExpanded] = useState(false)

  // List management UI
  const [renamingListId, setRenamingListId]   = useState<string | null>(null)
  const [renameValue, setRenameValue]          = useState('')
  const [showNewListInput, setShowNewListInput] = useState(false)
  const [newListName, setNewListName]           = useState('')

  const quickAddRef = useRef<HTMLInputElement>(null)

  // Keep activeListId valid when lists change
  useEffect(() => {
    if (lists.length > 0 && !lists.find(l => l.id === activeListId)) {
      setActiveListId(lists[0].id)
    }
  }, [lists, activeListId])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  // Tasks for active list
  const listTasks = tasks.filter(t => t.listId === activeListId)
  const sorted    = sortTasksForDisplay(listTasks)
  const starredTasks   = sorted.filter(t => t.starred && !t.completed)
  const unstarredTasks = sorted.filter(t => !t.starred && !t.completed)
  const completedTasks = sorted.filter(t => t.completed)

  const handleAddTask = () => {
    const trimmed = inputValue.trim()
    if (!trimmed || !activeListId) return
    addTask({ title: trimmed, listId: activeListId })
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTask()
  }

  const handleDragEnd = (starred: boolean) => (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const section = starred ? starredTasks : unstarredTasks
    const oldIndex = section.findIndex(t => t.id === active.id)
    const newIndex = section.findIndex(t => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const newOrder = arrayMove(section, oldIndex, newIndex).map(t => t.id)
    reorderTasks(activeListId, starred, newOrder)
  }

  const startRename = (list: TodoList) => {
    setRenamingListId(list.id)
    setRenameValue(list.name)
  }

  const confirmRename = () => {
    if (renamingListId && renameValue.trim()) {
      renameList(renamingListId, renameValue.trim())
    }
    setRenamingListId(null)
    setRenameValue('')
  }

  const handleAddList = () => {
    const name = newListName.trim()
    if (!name) return
    addList(name)
    setNewListName('')
    setShowNewListInput(false)
    // Activate the new list
    setTimeout(() => {
      const allLists = lists
      if (allLists.length > 0) setActiveListId(allLists[allLists.length - 1]?.id ?? '')
    }, 100)
  }

  return (
    <div className="flex flex-col h-full">
      {/* List tabs */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 items-center">
          {lists.map(list => (
            <div key={list.id} className="flex-shrink-0 relative">
              {renamingListId === list.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={confirmRename}
                  onKeyDown={e => {
                    if (e.key === 'Enter') confirmRename()
                    if (e.key === 'Escape') { setRenamingListId(null); setRenameValue('') }
                  }}
                  className="px-3 py-2 rounded-full text-sm font-medium bg-bg-elevated border border-accent/60 text-text-primary focus:outline-none w-28"
                />
              ) : (
                <button
                  onClick={() => setActiveListId(list.id)}
                  onDoubleClick={() => startRename(list)}
                  className={clsx(
                    'pill-btn flex items-center gap-1.5',
                    activeListId === list.id ? 'pill-btn-active' : 'pill-btn-inactive'
                  )}
                >
                  {list.name}
                  {activeListId === list.id && lists.length > 1 && (
                    <button
                      onClick={e => { e.stopPropagation(); startRename(list) }}
                      className="opacity-60 hover:opacity-100 transition-opacity -mr-1"
                      aria-label="Rename list"
                    >
                      <Pencil size={10} />
                    </button>
                  )}
                </button>
              )}
            </div>
          ))}

          {/* Add new list */}
          {showNewListInput ? (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <input
                autoFocus
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddList()
                  if (e.key === 'Escape') { setShowNewListInput(false); setNewListName('') }
                }}
                placeholder="List name"
                className="px-3 py-2 rounded-full text-sm font-medium bg-bg-elevated border border-accent/60 text-text-primary focus:outline-none w-28 placeholder-text-muted"
              />
              <button
                onClick={handleAddList}
                disabled={!newListName.trim()}
                className="w-7 h-7 rounded-full bg-accent flex items-center justify-center disabled:opacity-40 press-active flex-shrink-0"
              >
                <Check size={13} className="text-bg-primary" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewListInput(true)}
              className="pill-btn pill-btn-inactive flex items-center gap-1 flex-shrink-0"
              aria-label="Add new list"
            >
              <Plus size={12} />
              New list
            </button>
          )}

          {/* Delete active list (if more than 1 exists) */}
          {lists.length > 1 && activeListId && !renamingListId && (
            <button
              onClick={() => {
                if (!confirm(`Delete "${lists.find(l => l.id === activeListId)?.name}"? All tasks in this list will be deleted.`)) return
                deleteList(activeListId)
              }}
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors"
              aria-label="Delete this list"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Quick-add input */}
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="flex gap-2">
          <input
            ref={quickAddRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="input-base flex-1 pr-16"
          />
          <button
            onClick={handleAddTask}
            disabled={!inputValue.trim()}
            className={clsx(
              'px-4 h-12 rounded-xl text-sm font-semibold transition-all press-active flex-shrink-0',
              inputValue.trim()
                ? 'bg-accent text-bg-primary'
                : 'bg-bg-elevated text-text-muted cursor-not-allowed border border-border-subtle'
            )}
          >
            Add
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-8">
        {starredTasks.length === 0 && unstarredTasks.length === 0 && completedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-2xl mb-3">📋</p>
            <p className="text-text-secondary font-medium">No tasks in this list</p>
            <p className="text-text-muted text-sm mt-1">Add a task above to get started</p>
          </div>
        )}

        {(starredTasks.length > 0 || unstarredTasks.length > 0) && (
          <div className="space-y-4">
            {/* Starred section */}
            {starredTasks.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Star size={10} className="fill-accent" /> Starred
                </p>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(true)}>
                  <SortableContext items={starredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {starredTasks.map(task => (
                        <SortableRow
                          key={task.id}
                          task={task}
                          onTap={setDetailTask}
                          onToggleComplete={toggleComplete}
                          onToggleStar={toggleStar}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* Unstarred section */}
            {unstarredTasks.length > 0 && (
              <div>
                {starredTasks.length > 0 && (
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Tasks
                  </p>
                )}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(false)}>
                  <SortableContext items={unstarredTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {unstarredTasks.map(task => (
                        <SortableRow
                          key={task.id}
                          task={task}
                          onTap={setDetailTask}
                          onToggleComplete={toggleComplete}
                          onToggleStar={toggleStar}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        )}

        {/* Completed section */}
        {completedTasks.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setCompletedExpanded(v => !v)}
              className="flex items-center gap-2 mb-3 press-active"
            >
              {completedExpanded
                ? <ChevronDown size={14} className="text-text-muted" />
                : <ChevronRight size={14} className="text-text-muted" />
              }
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                {completedTasks.length} completed
              </span>
            </button>
            {completedExpanded && (
              <div className="space-y-2">
                {completedTasks.map(task => (
                  <SortableRow
                    key={task.id}
                    task={task}
                    onTap={setDetailTask}
                    onToggleComplete={toggleComplete}
                    onToggleStar={toggleStar}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task detail sheet */}
      {detailTask && (
        <TaskDetail
          task={detailTask}
          onClose={() => setDetailTask(null)}
          onUpdate={(id, updates) => {
            updateTask(id, updates)
            setDetailTask(prev => prev ? { ...prev, ...updates } : null)
          }}
          onDelete={deleteTask}
          onToggleStar={(id) => {
            toggleStar(id)
            setDetailTask(prev => prev ? { ...prev, starred: !prev.starred } : null)
          }}
          onToggleComplete={(id) => {
            toggleComplete(id)
            setDetailTask(null)
          }}
        />
      )}
    </div>
  )
}

