import { Copy, X, Expand, Bookmark } from 'lucide-react'
import { toast } from 'react-hot-toast'
import clsx from 'clsx'
import type { BuiltPhrase } from '../../../types/spanish'
import { addSavedPhrase } from '../../../lib/storage'

interface Props {
  phrase: BuiltPhrase
  onClear: () => void
  onShowMode: () => void
  onPhraseSaved?: () => void
}

function generatePhraseId() {
  return `phrase_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export default function PhraseDisplay({ phrase, onClear, onShowMode, onPhraseSaved }: Props) {
  const hasPhrase = phrase.spanish.length > 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phrase.spanish)
      toast.success('Phrase copied!')
    } catch {
      toast.error('Could not copy')
    }
  }

  const handleSave = () => {
    addSavedPhrase({
      id: generatePhraseId(),
      spanish: phrase.spanish,
      english: phrase.english,
      savedAt: new Date().toISOString(),
    })
    toast.success('Phrase saved!')
    onPhraseSaved?.()
  }

  return (
    <div
      className={clsx(
        'absolute bottom-0 left-0 right-0 border-t border-border-subtle transition-all duration-300',
        'glass-bottom',
        hasPhrase ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}
      style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.6)' }}
    >
      <div className="px-4 pt-4 pb-3">
        {/* Phrase text — tappable to expand */}
        <button
          onClick={onShowMode}
          className="w-full text-left mb-3 press-active"
          tabIndex={hasPhrase ? 0 : -1}
        >
          <p className="text-xl font-bold text-text-primary leading-snug tracking-tight">
            {phrase.spanish}
          </p>
          {phrase.english && (
            <p className="text-sm text-text-muted mt-1 leading-snug">
              {phrase.english}
            </p>
          )}
        </button>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onShowMode}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs font-semibold press-active hover:bg-accent hover:text-bg-primary transition-all duration-200 flex-1 justify-center"
          >
            <Expand size={13} />
            Show
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold press-active hover:bg-accent hover:text-bg-primary transition-all duration-200 flex-1 justify-center"
          >
            <Bookmark size={13} />
            Save
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-text-muted text-xs font-semibold press-active hover:text-text-primary transition-all duration-200 flex-1 justify-center"
          >
            <Copy size={13} />
            Copy
          </button>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-bg-elevated border border-border-subtle text-text-muted text-xs font-semibold press-active hover:text-text-primary transition-all duration-200 flex-1 justify-center"
          >
            <X size={13} />
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
