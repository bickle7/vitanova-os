import { useState, useEffect, useRef } from 'react'
import { Briefcase, User, Home, X, Plus } from 'lucide-react'
import clsx from 'clsx'
import type { LongTermTask, ListCategory, Priority } from '../../../types/todo'
import { addCustomList } from '../../../lib/todoStorage'

interface Props {
  onClose: () => void
  onSave: (params: {
    title: string
    listCategory: ListCategory
    priority: Priority
    dueDate?: string
  }) => void
  initialValues?: LongTermTask
  customLists?: string[]
  onCustomListAdded?: (lists: string[]) => void
}

const BUILT_IN_CATEGORIES: { value: string; label: string; Icon: React.ElementType }[] = [
  { value: 'work',     label: 'Work',     Icon: Briefcase },
  { value: 'personal', label: 'Personal', Icon: User },
  { value: 'home',     label: 'Home',     Icon: Home },
]

const priorityOptions: { value: Priority; label: string; activeClass: string }[] = [
  { value: 'high',   label: 'High',   activeClass: 'bg-red-500 text-white border-red-500' },
  { value: 'medium', label: 'Medium', activeClass: 'bg-accent text-bg-primary border-accent' },
  { value: 'low',    label: 'Low',    activeClass: 'bg-bg-elevated text-text-secondary border-border-subtle' },
]

export default function AddTaskModal({ onClose, onSave, initialValues, customLists = [], onCustomListAdded }: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [category, setCategory] = useState<ListCategory>(initialValues?.listCategory ?? 'personal')
  const [priority, setPriority] = useState<Priority>(initialValues?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? '')
  const [showNewList, setShowNewList] = useState(false)
  const [newListName, setNewListName] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Small delay so bottom sheet animation completes before focus
    const t = setTimeout(() => inputRef.current?.focus(), 350)
    return () => clearTimeout(t)
  }, [])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      listCategory: category,
      priority,
      dueDate: dueDate || undefined,
    })
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  const handleAddNewList = () => {
    const name = newListName.trim()
    if (!name) return
    const updated = addCustomList(name)
    onCustomListAdded?.(updated)
    setCategory(name)
    setNewListName('')
    setShowNewList(false)
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet pb-safe">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <h2 className="text-base font-semibold text-text-primary">
            {initialValues ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-5">
          {/* Title input */}
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What needs doing?"
            className="input-base text-base"
          />

          {/* Category */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Category</p>
            <div className="flex flex-wrap gap-2">
              {BUILT_IN_CATEGORIES.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={clsx(
                    'pill-btn flex items-center gap-1.5 justify-center',
                    category === value ? 'pill-btn-active' : 'pill-btn-inactive'
                  )}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
              {customLists.map(name => (
                <button
                  key={name}
                  onClick={() => setCategory(name)}
                  className={clsx(
                    'pill-btn justify-center',
                    category === name ? 'pill-btn-active' : 'pill-btn-inactive'
                  )}
                >
                  {name}
                </button>
              ))}
              <button
                onClick={() => setShowNewList(v => !v)}
                className="pill-btn pill-btn-inactive flex items-center gap-1"
              >
                <Plus size={12} />
                New list
              </button>
            </div>
            {showNewList && (
              <div className="flex gap-2 mt-2">
                <input
                  autoFocus
                  type="text"
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddNewList(); if (e.key === 'Escape') { setShowNewList(false); setNewListName('') } }}
                  placeholder="List name..."
                  className="input-base text-sm flex-1 py-2"
                />
                <button
                  onClick={handleAddNewList}
                  disabled={!newListName.trim()}
                  className="px-4 py-2 rounded-xl bg-accent text-bg-primary text-sm font-semibold disabled:opacity-40 press-active"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Priority</p>
            <div className="flex gap-2">
              {priorityOptions.map(({ value, label, activeClass }) => (
                <button
                  key={value}
                  onClick={() => setPriority(value)}
                  className={clsx(
                    'flex-1 py-2 rounded-full text-sm font-medium border transition-all duration-200 press-active',
                    priority === value
                      ? activeClass
                      : 'bg-bg-elevated text-text-secondary border-border-subtle hover:border-accent/40'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
              Due date <span className="normal-case font-normal">(optional)</span>
            </p>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="input-base [color-scheme:dark] flex-1"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:text-red-400 bg-bg-elevated border border-border-subtle press-active transition-colors flex-shrink-0"
                  aria-label="Clear due date"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className={clsx(
              'w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 press-active',
              title.trim()
                ? 'bg-accent text-bg-primary shadow-glow-accent hover:bg-accent-warm'
                : 'bg-bg-elevated text-text-muted cursor-not-allowed'
            )}
          >
            {initialValues ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </div>
    </>
  )
}
