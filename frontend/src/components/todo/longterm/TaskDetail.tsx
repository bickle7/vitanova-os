import { useState, useEffect, useRef } from 'react'
import { X, Star, Bell, BellOff, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import type { LongTermTask } from '../../../types/todo'

interface Props {
  task: LongTermTask
  onClose: () => void
  onUpdate: (id: string, updates: Partial<LongTermTask>) => void
  onDelete: (id: string) => void
  onToggleStar: (id: string) => void
  onToggleComplete: (id: string) => void
}

function formatReminder(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  })
}

function localDatetimeValue(iso: string): string {
  // Convert ISO to local datetime-local input value (YYYY-MM-DDTHH:mm)
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function TaskDetail({ task, onClose, onUpdate, onDelete, onToggleStar, onToggleComplete }: Props) {
  const [title, setTitle] = useState(task.title)
  const [showReminderInput, setShowReminderInput] = useState(false)
  const [reminderValue, setReminderValue] = useState(
    task.reminderAt ? localDatetimeValue(task.reminderAt) : ''
  )
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  const handleSave = () => {
    if (title.trim() && title.trim() !== task.title) {
      onUpdate(task.id, { title: title.trim() })
    }
    onClose()
  }

  const handleSetReminder = () => {
    if (!reminderValue) return
    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
    onUpdate(task.id, { reminderAt: new Date(reminderValue).toISOString() })
    setShowReminderInput(false)
  }

  const handleClearReminder = () => {
    onUpdate(task.id, { reminderAt: undefined })
    setReminderValue('')
    setShowReminderInput(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={handleSave} />
      <div className="bottom-sheet pb-safe">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-2">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={clsx(
              'text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 press-active',
              task.completed
                ? 'bg-accent/20 border-accent/40 text-accent'
                : 'bg-bg-elevated border-border-subtle text-text-muted hover:border-accent/40'
            )}
          >
            {task.completed ? '✓ Done' : 'Mark done'}
          </button>
          <button
            onClick={handleSave}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Title */}
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Task title"
            className={clsx(
              'input-base text-base font-medium',
              task.completed && 'line-through text-text-muted'
            )}
          />

          {/* Star + Reminder row */}
          <div className="flex gap-2">
            {/* Star */}
            <button
              onClick={() => { onToggleStar(task.id); onClose() }}
              className={clsx(
                'flex items-center gap-2 flex-1 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 press-active justify-center',
                task.starred
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/40'
              )}
            >
              <Star size={15} className={task.starred ? 'fill-accent text-accent' : ''} />
              {task.starred ? 'Starred' : 'Star'}
            </button>

            {/* Reminder */}
            <button
              onClick={() => setShowReminderInput(v => !v)}
              className={clsx(
                'flex items-center gap-2 flex-1 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 press-active justify-center',
                task.reminderAt
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/40'
              )}
            >
              {task.reminderAt ? <Bell size={15} /> : <BellOff size={15} />}
              {task.reminderAt ? 'Reminder set' : 'Remind me'}
            </button>
          </div>

          {/* Reminder info / input */}
          {task.reminderAt && !showReminderInput && (
            <div className="flex items-center justify-between bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-text-muted mb-0.5">Reminder</p>
                <p className="text-sm font-medium text-text-primary">{formatReminder(task.reminderAt)}</p>
              </div>
              <button
                onClick={handleClearReminder}
                className="text-text-muted hover:text-red-400 press-active transition-colors"
                aria-label="Clear reminder"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {showReminderInput && (
            <div className="space-y-2">
              <input
                type="datetime-local"
                value={reminderValue}
                onChange={e => setReminderValue(e.target.value)}
                className="input-base [color-scheme:dark]"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReminderInput(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border-subtle text-text-secondary text-sm font-medium press-active"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetReminder}
                  disabled={!reminderValue}
                  className="flex-1 py-2.5 rounded-xl bg-accent text-bg-primary text-sm font-semibold disabled:opacity-40 press-active"
                >
                  Set reminder
                </button>
              </div>
              {task.reminderAt && (
                <button
                  onClick={handleClearReminder}
                  className="w-full py-2.5 rounded-xl text-sm text-red-400 press-active hover:text-red-300 transition-colors"
                >
                  Clear existing reminder
                </button>
              )}
            </div>
          )}

          {/* Delete */}
          <button
            onClick={() => { onDelete(task.id); onClose() }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-400 text-sm font-semibold press-active hover:bg-red-500/10 transition-all duration-200"
          >
            <Trash2 size={15} />
            Delete task
          </button>
        </div>
      </div>
    </>
  )
}
