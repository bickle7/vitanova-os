import { useState } from 'react'
import { Trash2, Check } from 'lucide-react'
import clsx from 'clsx'
import type { LongTermTask, Priority } from '../../../types/todo'

interface Props {
  task: LongTermTask
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (task: LongTermTask) => void
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.getTime() === today.getTime()) return 'Today'
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high:   { label: 'High',   className: 'text-red-400 bg-red-400/10' },
  medium: { label: 'Medium', className: 'text-accent bg-accent/10' },
  low:    { label: 'Low',    className: 'text-text-muted bg-bg-elevated' },
}

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }: Props) {
  const [showDelete, setShowDelete] = useState(false)

  const dueDateOverdue = task.dueDate && !task.completed && isOverdue(task.dueDate)
  const pConfig = priorityConfig[task.priority]

  return (
    <div
      className={clsx(
        'card px-4 py-3.5 flex items-center gap-3 transition-opacity duration-300',
        task.completed && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id)}
        className={clsx(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 press-active',
          task.completed
            ? 'bg-accent border-accent'
            : 'border-border-subtle hover:border-accent/60'
        )}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && <Check size={13} strokeWidth={3} className="text-bg-primary" />}
      </button>

      {/* Content */}
      <button
        className="flex-1 min-w-0 text-left"
        onClick={() => !task.completed && onEdit(task)}
      >
        <p className={clsx(
          'text-sm font-medium leading-snug truncate',
          task.completed ? 'line-through text-text-muted' : 'text-text-primary'
        )}>
          {task.title}
        </p>

        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {/* Priority badge */}
          <span className={clsx(
            'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
            pConfig.className
          )}>
            {pConfig.label}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span className={clsx(
              'text-[10px] font-medium',
              dueDateOverdue ? 'text-red-400' : 'text-text-muted'
            )}>
              {dueDateOverdue && !task.completed ? '⚠ ' : ''}
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>
      </button>

      {/* Delete button */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {showDelete ? (
          <>
            <button
              onClick={() => onDelete(task.id)}
              className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center press-active"
              aria-label="Confirm delete"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
            <button
              onClick={() => setShowDelete(false)}
              className="w-8 h-8 rounded-xl bg-bg-elevated flex items-center justify-center press-active text-text-muted text-xs font-medium"
              aria-label="Cancel"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowDelete(true)}
            className="w-8 h-8 rounded-xl flex items-center justify-center press-active text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
