import { Heart } from 'lucide-react'
import clsx from 'clsx'
import type { Word, DirectionToggle } from '../../../types/spanish'

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  greetings:     { label: 'Greetings & Basics', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  cafe:          { label: 'In a Café',          color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  restaurant:    { label: 'In a Restaurant',    color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  shop:          { label: 'In a Shop',          color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
  hotel:         { label: 'In a Hotel',         color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  getting_around:{ label: 'Getting Around',     color: 'text-sky-400 bg-sky-400/10 border-sky-400/20' },
  emergencies:   { label: 'Emergencies',        color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  general:       { label: 'General',            color: 'text-text-muted bg-bg-elevated border-border-subtle' },
}

interface Props {
  word: Word
  direction: DirectionToggle
  onTap: (word: Word) => void
  onToggleFavourite: (id: string) => void
}

export default function WordCard({ word, direction, onTap, onToggleFavourite }: Props) {
  const catMeta = CATEGORY_LABELS[word.category] ?? CATEGORY_LABELS.general
  const primary = direction === 'EN_ES' ? word.english : word.spanish
  const secondary = direction === 'EN_ES' ? word.spanish : word.english
  const isSpanishPrimary = direction === 'ES_EN'

  return (
    <div
      className="card flex items-center gap-3 px-4 py-3.5 press-active cursor-pointer hover:border-border-subtle/80 hover:bg-bg-elevated/50 transition-all duration-150"
      onClick={() => onTap(word)}
    >
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className={clsx(
            'text-sm font-semibold leading-snug',
            isSpanishPrimary ? 'text-accent-warm' : 'text-text-primary'
          )}>
            {primary}
          </span>
        </div>
        <p className={clsx(
          'text-sm leading-snug mt-0.5 truncate',
          isSpanishPrimary ? 'text-text-primary' : 'text-accent-warm font-medium'
        )}>
          {secondary}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={clsx(
            'text-xs px-2 py-0.5 rounded-full border font-medium',
            catMeta.color
          )}>
            {catMeta.label}
          </span>
          {word.use_count > 0 && (
            <span className="text-xs text-text-muted tabular-nums">
              ×{word.use_count}
            </span>
          )}
        </div>
      </div>

      {/* Favourite button */}
      <button
        className={clsx(
          'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center press-active transition-all duration-200',
          word.is_favourite
            ? 'text-red-400 bg-red-400/10'
            : 'text-text-muted bg-bg-elevated hover:text-red-400/60'
        )}
        onClick={e => {
          e.stopPropagation()
          onToggleFavourite(word.id)
        }}
        aria-label={word.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Heart
          size={16}
          className={word.is_favourite ? 'fill-current' : ''}
        />
      </button>
    </div>
  )
}
