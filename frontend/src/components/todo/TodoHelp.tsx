import { ListTodo, CalendarDays, Mic, Upload, ChevronLeft, Sparkles } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

interface Props {
  onComplete: () => void
}

const SCREENS = [
  {
    id: 'welcome',
    icon: null,
    emoji: '✅',
    title: 'Your To Do companion',
    subtitle: 'Two views to match how you think. Long term planning and the daily brain dump.',
    cta: 'Next',
  },
  {
    id: 'lists',
    icon: ListTodo,
    emoji: null,
    title: 'Long Term Lists',
    subtitle: 'Organise tasks by Work, Personal, Home — or your own custom lists. Set priorities and due dates.',
    cta: 'Next',
  },
  {
    id: 'today',
    icon: CalendarDays,
    emoji: null,
    title: 'Daily Brain Dump',
    subtitle: 'Type, speak, or import tasks for today. Unfinished tasks can be moved to your lists at day end.',
    cta: 'Next',
  },
  {
    id: 'voice',
    icon: Mic,
    emoji: null,
    title: 'Voice & Import',
    subtitle: 'Tap the mic to speak tasks hands-free. Use the import button to paste a list or scan a photo.',
    cta: 'Next',
  },
  {
    id: 'ready',
    icon: Sparkles,
    emoji: null,
    title: "You're all set",
    subtitle: 'Tap + to add your first task, or go to Today to start your brain dump.',
    cta: 'Done',
  },
]

export default function TodoHelp({ onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(false)

  const screen = SCREENS[current]
  const isLast = current === SCREENS.length - 1

  const advance = () => {
    if (isLast) { onComplete(); return }
    setExiting(true)
    setTimeout(() => { setCurrent(c => c + 1); setExiting(false) }, 180)
  }

  const goBack = () => {
    if (current === 0) return
    setExiting(true)
    setTimeout(() => { setCurrent(c => c - 1); setExiting(false) }, 180)
  }

  const Icon = screen.icon as React.ElementType | null

  return (
    <div className="min-h-dvh bg-bg-primary flex flex-col">
      <div className="mx-auto max-w-[430px] w-full min-h-dvh flex flex-col">
        <div className="flex items-center justify-between px-6 pt-safe">
          <div className="h-14 flex items-center">
            {current > 0 && (
              <button
                onClick={goBack}
                className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors"
                aria-label="Back"
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>
          <div className="h-14 flex items-center">
            {!isLast && (
              <button
                onClick={onComplete}
                className="text-text-muted text-sm font-medium press-active hover:text-text-secondary transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </div>

        <div
          className={clsx(
            'flex-1 flex flex-col items-center justify-center px-8 text-center transition-all duration-180',
            exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
          )}
          style={{ transitionDuration: '180ms' }}
        >
          <div className="mb-10">
            {screen.emoji ? (
              <div className="text-7xl" style={{ filter: 'drop-shadow(0 4px 24px rgba(212,168,67,0.15))' }}>
                {screen.emoji}
              </div>
            ) : Icon ? (
              <div
                className="w-24 h-24 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto"
                style={{ boxShadow: '0 0 40px rgba(212,168,67,0.12)' }}
              >
                <Icon size={40} className="text-accent" strokeWidth={1.5} />
              </div>
            ) : null}
          </div>

          <h1 className="text-3xl font-bold text-text-primary tracking-tight leading-tight mb-4">
            {screen.title}
          </h1>
          <p className="text-text-secondary text-base leading-relaxed max-w-[280px]">
            {screen.subtitle}
          </p>
        </div>

        <div className="px-6 pb-safe">
          <div className="pb-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              {SCREENS.map((_, i) => (
                <div
                  key={i}
                  className={clsx(
                    'rounded-full transition-all duration-300',
                    i === current ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-border-subtle'
                  )}
                />
              ))}
            </div>
            <button
              onClick={advance}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg-primary font-bold text-base press-active shadow-glow-accent transition-all duration-200"
            >
              <span>{screen.cta}</span>
              {!isLast && <Upload size={0} className="hidden" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
