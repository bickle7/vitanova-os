import { useState, useEffect, useCallback } from 'react'
import {
  Globe2, BookOpen, MessageSquareDashed, Heart,
  Info, ChevronDown, ListTodo, CalendarDays, Check,
  Film, Music, MapPin,
} from 'lucide-react'
import clsx from 'clsx'
import type { AppMode } from './types/spanish'
import type { TodoTab } from './types/todo'
import type { LibraryTab } from './types/library'
import { addDailyTask as storageAddDailyTask } from './lib/todoStorage'
import SpanishFeature from './components/spanish/SpanishFeature'
import TodoFeature from './components/todo/TodoFeature'
import LibraryFeature from './components/library/LibraryFeature'
import Onboarding from './components/Onboarding'
import TodoHelp from './components/todo/TodoHelp'

type ActiveFeature = 'spanish' | 'todo' | 'library'

const FEATURES: { id: ActiveFeature; emoji: string; label: string }[] = [
  { id: 'spanish', emoji: '🇪🇸', label: 'Spanish' },
  { id: 'todo',    emoji: '✅',   label: 'To Do'   },
  { id: 'library', emoji: '📚',   label: 'Library' },
]

export default function App() {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('spanish')
  const [spanishTab, setSpanishTab]       = useState<AppMode>('dictionary')
  const [todoTab, setTodoTab]             = useState<TodoTab>('lists')
  const [libraryTab, setLibraryTab]       = useState<LibraryTab>('movies')
  const [showHelp, setShowHelp]           = useState(false)
  const [showFeaturePicker, setShowFeaturePicker] = useState(false)
  const [todayCount, setTodayCount]       = useState(0)

  // Siri / URL scheme: ?add=Task+text  →  add to daily dump and open Today tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const addText = params.get('add')
    if (addText?.trim()) {
      storageAddDailyTask({
        id: `siri_${Date.now()}`,
        title: addText.trim(),
        completed: false,
        date: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
      })
      setActiveFeature('todo')
      setTodoTab('today')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const switchFeature = useCallback((f: ActiveFeature) => {
    setActiveFeature(f)
    setShowFeaturePicker(false)
  }, [])

  const handleLogoTap = () => {
    if (activeFeature === 'spanish') setSpanishTab('dictionary')
    else if (activeFeature === 'library') setLibraryTab('movies')
    else setTodoTab('lists')
  }

  const currentFeature = FEATURES.find(f => f.id === activeFeature)!

  return (
    <div className="min-h-dvh bg-bg-primary">
      <div className="mx-auto max-w-[430px] min-h-dvh flex flex-col bg-bg-primary relative">

        {/* Header */}
        <header className="sticky top-0 z-20 glass border-b border-border-subtle flex-shrink-0">
          <div className="px-4 pt-safe">
            <div className="flex items-center justify-between h-14">

              {/* Logo */}
              <button onClick={handleLogoTap} className="flex items-center gap-2.5 press-active" aria-label="Home">
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-glow-accent">
                  <Globe2 size={16} className="text-bg-primary" />
                </div>
                <div className="leading-none">
                  <span className="text-sm font-bold text-text-primary tracking-tight">VitaNova</span>
                  <span className="text-sm font-bold text-accent tracking-tight">OS</span>
                </div>
              </button>

              {/* Right: feature switcher + info */}
              <div className="flex items-center gap-2">
                {/* Feature pill */}
                <div className="relative">
                  <button
                    onClick={() => setShowFeaturePicker(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-border-subtle press-active hover:border-accent/40 transition-colors"
                  >
                    <span className="text-sm">{currentFeature.emoji}</span>
                    <span className="text-xs font-medium text-text-secondary">{currentFeature.label}</span>
                    <ChevronDown
                      size={11}
                      className={clsx('text-text-muted transition-transform duration-200', showFeaturePicker && 'rotate-180')}
                    />
                  </button>

                  {/* Dropdown */}
                  {showFeaturePicker && (
                    <div
                      className="absolute right-0 top-full mt-2 w-44 bg-bg-elevated border border-border-subtle rounded-2xl overflow-hidden z-30"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)', animation: 'scaleIn 0.15s ease-out' }}
                    >
                      {FEATURES.map(f => (
                        <button
                          key={f.id}
                          onClick={() => switchFeature(f.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-surface press-active transition-colors text-left"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{f.emoji}</span>
                            <span className="text-sm font-medium text-text-primary">{f.label}</span>
                          </div>
                          {activeFeature === f.id && <Check size={14} className="text-accent" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info button */}
                <button
                  onClick={() => setShowHelp(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-accent press-active transition-colors"
                  aria-label="Help"
                >
                  <Info size={18} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dropdown backdrop */}
        {showFeaturePicker && (
          <div className="fixed inset-0 z-10" onClick={() => setShowFeaturePicker(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {activeFeature === 'spanish' && (
            <SpanishFeature activeTab={spanishTab} onTabChange={setSpanishTab} />
          )}
          {activeFeature === 'todo' && (
            <TodoFeature
              activeTab={todoTab}
              onTabChange={setTodoTab}
              onTodayCountChange={setTodayCount}
            />
          )}
          {activeFeature === 'library' && (
            <LibraryFeature activeTab={libraryTab} />
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="sticky bottom-0 z-20 glass-bottom border-t border-border-subtle flex-shrink-0">
          <div className="flex items-stretch pb-safe">
            {activeFeature === 'spanish' && (
              <>
                <NavTab icon={BookOpen}           label="Dictionary" active={spanishTab === 'dictionary'}   onClick={() => setSpanishTab('dictionary')} />
                <NavTab icon={MessageSquareDashed} label="Phrases"    active={spanishTab === 'phrasebuilder'} onClick={() => setSpanishTab('phrasebuilder')} />
                <NavTab icon={Heart}              label="Favourites" active={spanishTab === 'favourites'}   onClick={() => setSpanishTab('favourites')} />
              </>
            )}
            {activeFeature === 'todo' && (
              <>
                <NavTab icon={ListTodo}     label="Lists" active={todoTab === 'lists'} onClick={() => setTodoTab('lists')} />
                <NavTab icon={CalendarDays} label="Today" active={todoTab === 'today'} onClick={() => setTodoTab('today')} badge={todayCount > 0 ? todayCount : undefined} />
              </>
            )}
            {activeFeature === 'library' && (
              <>
                <NavTab icon={Film}   label="Movies & TV" active={libraryTab === 'movies'} onClick={() => setLibraryTab('movies')} />
                <NavTab icon={Music}  label="Music"       active={libraryTab === 'music'}  onClick={() => setLibraryTab('music')} />
                <NavTab icon={MapPin} label="Places"      active={libraryTab === 'places'} onClick={() => setLibraryTab('places')} />
              </>
            )}
          </div>
        </nav>

      </div>

      {/* Help overlay — feature-specific */}
      {showHelp && (
        <div className="fixed inset-0 z-50">
          {activeFeature === 'todo'
            ? <TodoHelp onComplete={() => setShowHelp(false)} />
            : <Onboarding onComplete={() => setShowHelp(false)} />
          }
        </div>
      )}
    </div>
  )
}

interface NavTabProps {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
  badge?: number
}

function NavTab({ icon: Icon, label, active, onClick, badge }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex-1 flex flex-col items-center justify-center gap-1 h-14 press-active transition-all duration-200 relative',
        active ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
      )}
    >
      <div className="relative">
        <Icon size={22} strokeWidth={active ? 2 : 1.75} className={active ? 'fill-accent/10' : ''} />
        {badge != null && (
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-danger rounded-full text-[9px] font-bold text-white flex items-center justify-center">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>
      <span className={clsx('text-[10px] font-semibold tracking-wide', active ? 'text-accent' : 'text-text-muted')}>
        {label}
      </span>
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
      )}
    </button>
  )
}
