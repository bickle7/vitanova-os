import type { AppMode } from '../../types/spanish'
import { BookOpen, Zap } from 'lucide-react'

interface Props {
  mode: AppMode
  onModeChange: (mode: AppMode) => void
}

export default function ModeToggle({ mode, onModeChange }: Props) {
  return (
    <div className="flex bg-bg-elevated rounded-2xl p-1 gap-1 border border-border-subtle">
      <button
        onClick={() => onModeChange('reference')}
        className={`
          flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-200 press-active
          ${mode === 'reference'
            ? 'bg-accent text-white shadow-glow-accent'
            : 'text-text-secondary hover:text-text-primary'
          }
        `}
      >
        <BookOpen size={15} />
        <span>Reference</span>
      </button>
      <button
        onClick={() => onModeChange('quicktap')}
        className={`
          flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-200 press-active
          ${mode === 'quicktap'
            ? 'bg-accent-warm text-white shadow-glow-warm'
            : 'text-text-secondary hover:text-text-primary'
          }
        `}
      >
        <Zap size={15} />
        <span>Quick Tap</span>
      </button>
    </div>
  )
}
