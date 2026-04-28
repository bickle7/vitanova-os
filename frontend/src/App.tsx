import { useState } from 'react'
import { Globe2, BookOpen, MessageSquareDashed, Heart, Info, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import type { AppMode } from './types/spanish'
import SpanishFeature from './components/spanish/SpanishFeature'
import Onboarding from './components/Onboarding'

export default function App() {
  const [activeTab, setActiveTab] = useState<AppMode>('dictionary')
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="min-h-dvh bg-bg-primary">
      <div className="mx-auto max-w-[430px] min-h-dvh flex flex-col bg-bg-primary relative">

        {/* Header */}
        <header className="sticky top-0 z-20 glass border-b border-border-subtle flex-shrink-0">
          <div className="px-4 pt-safe">
            <div className="flex items-center justify-between h-14">

              {/* Logo — taps back to Dictionary */}
              <button
                onClick={() => setActiveTab('dictionary')}
                className="flex items-center gap-2.5 press-active"
                aria-label="Home"
              >
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-glow-accent">
                  <Globe2 size={16} className="text-bg-primary" />
                </div>
                <div className="leading-none">
                  <span className="text-sm font-bold text-text-primary tracking-tight">VitaNova</span>
                  <span className="text-sm font-bold text-accent tracking-tight">OS</span>
                </div>
              </button>

              {/* Right side: feature label + info button */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-border-subtle press-active hover:border-accent/40 hover:text-accent transition-colors">
                  <span className="text-sm">🇪🇸</span>
                  <span className="text-xs font-medium text-text-secondary">Spanish</span>
                  <ChevronDown size={11} className="text-text-muted" />
                </button>
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

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <SpanishFeature activeTab={activeTab} onTabChange={setActiveTab} />
        </main>

        {/* Bottom Navigation */}
        <nav className="sticky bottom-0 z-20 glass-bottom border-t border-border-subtle flex-shrink-0">
          <div className="flex items-stretch pb-safe">
            <NavTab
              icon={BookOpen}
              label="Dictionary"
              active={activeTab === 'dictionary'}
              onClick={() => setActiveTab('dictionary')}
            />
            <NavTab
              icon={MessageSquareDashed}
              label="Phrases"
              active={activeTab === 'phrasebuilder'}
              onClick={() => setActiveTab('phrasebuilder')}
            />
            <NavTab
              icon={Heart}
              label="Favourites"
              active={activeTab === 'favourites'}
              onClick={() => setActiveTab('favourites')}
            />
          </div>
        </nav>

      </div>

      {/* Help overlay — fixed so it sits above everything */}
      {showHelp && (
        <div className="fixed inset-0 z-50">
          <Onboarding onComplete={() => setShowHelp(false)} />
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
}

function NavTab({ icon: Icon, label, active, onClick }: NavTabProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex-1 flex flex-col items-center justify-center gap-1 h-14 press-active transition-all duration-200',
        active ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
      )}
    >
      <Icon
        size={22}
        strokeWidth={active ? 2 : 1.75}
        className={active ? 'fill-accent/10' : ''}
      />
      <span className={clsx('text-[10px] font-semibold tracking-wide', active ? 'text-accent' : 'text-text-muted')}>
        {label}
      </span>
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
      )}
    </button>
  )
}
