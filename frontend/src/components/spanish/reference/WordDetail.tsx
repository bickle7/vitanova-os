import { Heart, Copy, Trash2, Volume2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import clsx from 'clsx'
import type { Word } from '../../../types/spanish'

const CATEGORY_LABELS: Record<string, { label: string; emoji: string }> = {
  greetings: { label: 'Greetings', emoji: '👋' },
  eating_drinking: { label: 'Eating & Drinking', emoji: '🍽️' },
  travel_directions: { label: 'Travel', emoji: '✈️' },
  shopping: { label: 'Shopping', emoji: '🛍️' },
  hotel: { label: 'Hotel', emoji: '🏨' },
  emergencies: { label: 'Emergencies', emoji: '🚨' },
  general: { label: 'General', emoji: '📝' },
}

interface Props {
  word: Word
  onClose: () => void
  onToggleFavourite: (id: string) => void
  onDelete: (id: string) => void
}

export default function WordDetail({ word, onClose, onToggleFavourite, onDelete }: Props) {
  const catMeta = CATEGORY_LABELS[word.category] ?? CATEGORY_LABELS.general

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${word.spanish} (${word.english})`)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Could not copy')
    }
  }

  const handleDelete = () => {
    onDelete(word.id)
    toast.success('Word removed')
  }

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className="bottom-sheet pb-safe"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border-subtle rounded-full" />
        </div>

        <div className="px-5 pb-6 pt-2">
          {/* Category badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-muted font-medium">
              {catMeta.emoji} {catMeta.label}
            </span>
            <span className="text-xs text-text-muted">
              {word.source === 'custom' ? 'Custom word' : 'From word bank'}
            </span>
          </div>

          {/* Spanish - large */}
          <div className="text-center mb-2">
            <h2 className="text-4xl font-bold text-accent-warm leading-tight tracking-tight">
              {word.spanish}
            </h2>

            {/* Pronunciation */}
            {word.pronunciation && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Volume2 size={13} className="text-text-muted" />
                <span className="text-sm text-text-muted italic font-light tracking-wide">
                  {word.pronunciation}
                </span>
              </div>
            )}
          </div>

          {/* English */}
          <p className="text-center text-lg font-medium text-text-secondary mb-6">
            {word.english}
          </p>

          {/* Divider */}
          <div className="h-px bg-border-subtle mb-5" />

          {/* Action buttons */}
          <div className="flex gap-3">
            {/* Favourite */}
            <button
              onClick={() => onToggleFavourite(word.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold press-active transition-all duration-200',
                word.is_favourite
                  ? 'bg-red-400/15 text-red-400 border border-red-400/25'
                  : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:text-red-400 hover:border-red-400/25'
              )}
            >
              <Heart size={15} className={word.is_favourite ? 'fill-current' : ''} />
              <span>{word.is_favourite ? 'Saved' : 'Save'}</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold bg-accent/10 border border-accent/20 text-accent press-active hover:bg-accent hover:text-bg-primary transition-all duration-200"
            >
              <Copy size={15} />
              <span>Copy</span>
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="w-12 flex items-center justify-center py-3 rounded-2xl bg-bg-elevated border border-border-subtle text-text-muted hover:text-red-400 hover:border-red-400/25 press-active transition-all duration-200"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
