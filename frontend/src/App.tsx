import { useState } from 'react'
import { Globe2, ChevronDown } from 'lucide-react'
import SpanishFeature from './components/spanish/SpanishFeature'

type Feature = 'spanish'

export default function App() {
  const [activeFeature] = useState<Feature>('spanish')

  return (
    <div className="min-h-dvh bg-bg-primary">
      {/* App Shell - centered, max 430px */}
      <div className="mx-auto max-w-[430px] min-h-dvh flex flex-col bg-bg-primary relative">
        {/* Header */}
        <header className="sticky top-0 z-20 glass border-b border-border-subtle">
          <div className="px-4 pt-safe">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-glow-accent">
                  <Globe2 size={16} className="text-white" />
                </div>
                <div>
                  <span className="text-sm font-bold text-text-primary tracking-tight">VitaNova</span>
                  <span className="text-sm font-bold text-accent tracking-tight">OS</span>
                </div>
              </div>

              {/* Feature selector pill */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-border-subtle press-active">
                <span className="text-sm">🇪🇸</span>
                <span className="text-xs font-medium text-text-secondary">Spanish</span>
                <ChevronDown size={12} className="text-text-muted" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {activeFeature === 'spanish' && <SpanishFeature />}
        </main>
      </div>
    </div>
  )
}
