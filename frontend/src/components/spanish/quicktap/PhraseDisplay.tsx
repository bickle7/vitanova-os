import { Copy, X, Expand } from 'lucide-react'
import { toast } from 'react-hot-toast'
import clsx from 'clsx'
import type { BuiltPhrase } from '../../../types/spanish'

interface Props {
  phrase: BuiltPhrase
  onClear: () => void
  onShowMode: () => void
}

export default function PhraseDisplay({ phrase, onClear, onShowMode }: Props) {
  const hasPhrase = phrase.spanish.length > 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phrase.spanish)
      toast.success('Phrase copied!')
    } catch {
      toast.error('Could not copy')
    }
  }

  return (
    <div
      className={clsx(
        'absolute bottom-0 left-0 right-0 bg-bg-elevated border-t border-border-subtle transition-all duration-300',
        hasPhrase ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}
      style={{ boxShadow: '0 -8px 32px rgba(0,0,0,0.5)' }}
    >
      <div className="px-4 pt-3 pb-safe">
        {/* Phrase text */}
        <div className="mb-3">
          <p className="text-lg font-bold text-white leading-snug tracking-tight">
            {phrase.spanish || ''}
          </p>
          {phrase.english && (
            <p className="text-sm text-text-muted mt-1">
              {phrase.english}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pb-2">
          {/* Show Mode */}
          <button
            onClick={onShowMode}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold press-active hover:bg-accent hover:text-white transition-all duration-200 flex-1 justify-center"
          >
            <Expand size={13} />
            Show
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-accent-warm/10 border border-accent-warm/20 text-accent-warm text-xs font-semibold press-active hover:bg-accent-warm hover:text-white transition-all duration-200 flex-1 justify-center"
          >
            <Copy size={13} />
            Copy
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-muted text-xs font-semibold press-active hover:text-text-primary transition-all duration-200 flex-1 justify-center"
          >
            <X size={13} />
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
