import { useState, useRef } from 'react'
import { Trash2, Check, Mic, Upload, X, ArrowRight, SkipForward } from 'lucide-react'
import clsx from 'clsx'
import type { DailyTask, ListCategory, Priority } from '../../../types/todo'
import ImportModal from './ImportModal'

interface Props {
  todayTasks: DailyTask[]
  addTask: (title: string) => DailyTask
  toggleComplete: (id: string) => void
  deleteTask: (id: string) => void
  moveToLongTerm: (task: DailyTask, category: ListCategory, priority: Priority) => void
  clearCompleted: () => void
  clearAll: () => void
  incompleteTodayCount: number
}

const DISMISS_KEY = 'vitanova_eod_dismiss_date'

function getTodayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isEndOfDay() {
  return new Date().getHours() >= 20
}

function isDismissedToday(): boolean {
  return localStorage.getItem(DISMISS_KEY) === getTodayString()
}

function dismissToday() {
  localStorage.setItem(DISMISS_KEY, getTodayString())
}

const categoryOptions: { value: ListCategory; label: string }[] = [
  { value: 'work',     label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'home',     label: 'Home' },
]

const priorityOptions: { value: Priority; label: string; activeClass: string }[] = [
  { value: 'high',   label: 'High',   activeClass: 'bg-red-500 text-white border-red-500' },
  { value: 'medium', label: 'Medium', activeClass: 'bg-accent text-bg-primary border-accent' },
  { value: 'low',    label: 'Low',    activeClass: 'bg-bg-elevated text-text-secondary border-border-subtle' },
]

export default function DailyDump({
  todayTasks,
  addTask,
  toggleComplete,
  deleteTask,
  moveToLongTerm,
  clearCompleted,
  clearAll,
  incompleteTodayCount,
}: Props) {
  const [inputValue, setInputValue] = useState('')
  const [listening, setListening] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [eodDismissed, setEodDismissed] = useState(() => isDismissedToday())

  // Move flow state
  const [movingTasks, setMovingTasks] = useState<DailyTask[] | null>(null)
  const [moveIndex, setMoveIndex] = useState(0)
  const [moveCategory, setMoveCategory] = useState<ListCategory>('personal')
  const [movePriority, setMovePriority] = useState<Priority>('medium')

  const inputRef = useRef<HTMLInputElement>(null)


  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    addTask(trimmed)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
  }

  const handleVoice = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      inputRef.current?.focus()
      return
    }
    const recognition = new SpeechRec()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-GB'
    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      addTask(text)
      setListening(false)
    }
    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)
    recognition.start()
    setListening(true)
  }

  const handleImport = (titles: string[]) => {
    titles.forEach(t => addTask(t))
  }

  const handleDismissEod = () => {
    dismissToday()
    setEodDismissed(true)
  }

  const startMoveFlow = () => {
    const incomplete = todayTasks.filter(t => !t.completed)
    if (incomplete.length === 0) return
    setMovingTasks(incomplete)
    setMoveIndex(0)
    setMoveCategory('personal')
    setMovePriority('medium')
  }

  const handleMoveTask = () => {
    if (!movingTasks) return
    const task = movingTasks[moveIndex]
    moveToLongTerm(task, moveCategory, movePriority)
    advanceMoveFlow()
  }

  const handleSkipTask = () => {
    advanceMoveFlow()
  }

  const advanceMoveFlow = () => {
    if (!movingTasks) return
    if (moveIndex + 1 >= movingTasks.length) {
      setMovingTasks(null)
    } else {
      setMoveIndex(i => i + 1)
      setMoveCategory('personal')
      setMovePriority('medium')
    }
  }

  const incomplete = todayTasks.filter(t => !t.completed)
  const completed = todayTasks.filter(t => t.completed)
  const showEodPrompt = isEndOfDay() && incompleteTodayCount > 0 && !eodDismissed

  // ── Move flow overlay ──
  if (movingTasks && moveIndex < movingTasks.length) {
    const currentTask = movingTasks[moveIndex]
    const total = movingTasks.length
    return (
      <div className="flex flex-col h-full px-4 pt-6 pb-safe">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-text-primary">Move to lists</h2>
          <span className="text-xs text-text-muted font-medium">{moveIndex + 1} of {total}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-bg-elevated rounded-full mb-6">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${((moveIndex) / total) * 100}%` }}
          />
        </div>

        <div className="card px-5 py-5 mb-6">
          <p className="text-base font-medium text-text-primary">{currentTask.title}</p>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Category</p>
            <div className="flex gap-2">
              {categoryOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setMoveCategory(value)}
                  className={clsx(
                    'pill-btn flex-1 justify-center',
                    moveCategory === value ? 'pill-btn-active' : 'pill-btn-inactive'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">Priority</p>
            <div className="flex gap-2">
              {priorityOptions.map(({ value, label, activeClass }) => (
                <button
                  key={value}
                  onClick={() => setMovePriority(value)}
                  className={clsx(
                    'flex-1 py-2 rounded-full text-sm font-medium border transition-all duration-200 press-active',
                    movePriority === value
                      ? activeClass
                      : 'bg-bg-elevated text-text-secondary border-border-subtle hover:border-accent/40'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSkipTask}
            className="flex-1 py-3.5 rounded-2xl text-sm font-semibold border border-border-subtle text-text-secondary hover:border-accent/40 transition-colors press-active flex items-center justify-center gap-2"
          >
            <SkipForward size={15} />
            Skip
          </button>
          <button
            onClick={handleMoveTask}
            className="flex-1 py-3.5 rounded-2xl text-sm font-semibold bg-accent text-bg-primary shadow-glow-accent press-active flex items-center justify-center gap-2"
          >
            Move to list
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Quick-add bar */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind today?"
              className="input-base pr-20"
            />
            {/* Inline Add + Import */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={() => setShowImport(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-secondary press-active transition-colors"
                aria-label="Import tasks"
              >
                <Upload size={15} />
              </button>
              <button
                onClick={handleAdd}
                disabled={!inputValue.trim()}
                className={clsx(
                  'px-3 h-8 rounded-lg text-xs font-semibold transition-all press-active',
                  inputValue.trim()
                    ? 'bg-accent text-bg-primary'
                    : 'bg-bg-primary text-text-muted cursor-not-allowed'
                )}
              >
                Add
              </button>
            </div>
          </div>

          {/* Mic button */}
          <button
            onClick={handleVoice}
            disabled={listening}
            className={clsx(
              'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 press-active',
              listening
                ? 'bg-accent shadow-glow-accent animate-pulse'
                : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:border-accent/40 hover:text-accent'
            )}
            aria-label={listening ? 'Listening...' : 'Voice input'}
          >
            <Mic
              size={18}
              className={listening ? 'text-bg-primary' : ''}
            />
          </button>
        </div>

        {listening && (
          <p className="text-xs text-accent mt-2 text-center font-medium animate-pulse">
            Listening...
          </p>
        )}
      </div>

      {/* Scrollable task list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-32">
        {/* End of day prompt */}
        {showEodPrompt && (
          <div className="mb-4 rounded-2xl border border-accent/40 bg-accent/5 px-4 py-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  You have {incompleteTodayCount} task{incompleteTodayCount !== 1 ? 's' : ''} left
                </p>
                <p className="text-xs text-text-secondary mt-0.5">Clear them or move to your lists?</p>
              </div>
              <button
                onClick={handleDismissEod}
                className="w-6 h-6 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startMoveFlow}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-accent text-bg-primary press-active"
              >
                Move tasks
              </button>
              <button
                onClick={() => {
                  clearAll()
                  handleDismissEod()
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-border-subtle text-text-secondary hover:border-accent/40 press-active transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {todayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-2xl mb-3">🎉</p>
            <p className="text-text-secondary font-medium">Brain dump clear — have a great day</p>
            <p className="text-text-muted text-sm mt-1">Add tasks above or use voice input</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Incomplete tasks */}
            {incomplete.map(task => (
              <DailyTaskRow
                key={task.id}
                task={task}
                onToggle={toggleComplete}
                onDelete={deleteTask}
              />
            ))}

            {/* Completed tasks */}
            {completed.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Completed
                  </p>
                  {completed.length > 0 && (
                    <button
                      onClick={clearCompleted}
                      className="text-xs text-text-muted hover:text-text-secondary transition-colors press-active"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {completed.map(task => (
                  <DailyTaskRow
                    key={task.id}
                    task={task}
                    onToggle={toggleComplete}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Import modal */}
      {showImport && (
        <ImportModal
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  )
}

// ── Daily task row sub-component ──────────────────────────────────────────

interface RowProps {
  task: DailyTask
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function DailyTaskRow({ task, onToggle, onDelete }: RowProps) {
  return (
    <div className={clsx(
      'card px-4 py-3.5 flex items-center gap-3 transition-opacity duration-200',
      task.completed && 'opacity-50'
    )}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
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

      {/* Title */}
      <p className={clsx(
        'flex-1 text-sm font-medium leading-snug',
        task.completed ? 'line-through text-text-muted' : 'text-text-primary'
      )}>
        {task.title}
      </p>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center press-active text-text-muted hover:text-red-400 transition-colors"
        aria-label="Delete task"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
