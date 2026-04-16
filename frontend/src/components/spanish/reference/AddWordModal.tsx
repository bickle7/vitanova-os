import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Category } from '../../../types/spanish'

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'greetings', label: 'Greetings', emoji: '👋' },
  { id: 'eating_drinking', label: 'Eating & Drinking', emoji: '🍽️' },
  { id: 'travel_directions', label: 'Travel & Directions', emoji: '✈️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'hotel', label: 'Hotel', emoji: '🏨' },
  { id: 'emergencies', label: 'Emergencies', emoji: '🚨' },
  { id: 'general', label: 'General', emoji: '📝' },
]

interface Props {
  onClose: () => void
  onAdd: (params: {
    english: string
    spanish: string
    category: Category
    pronunciation?: string
    source: 'custom'
  }) => void
}

export default function AddWordModal({ onClose, onAdd }: Props) {
  const [english, setEnglish] = useState('')
  const [spanish, setSpanish] = useState('')
  const [pronunciation, setPronunciation] = useState('')
  const [category, setCategory] = useState<Category>('general')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!english.trim() || !spanish.trim()) {
      toast.error('English and Spanish are required')
      return
    }
    onAdd({
      english: english.trim(),
      spanish: spanish.trim(),
      category,
      pronunciation: pronunciation.trim() || undefined,
      source: 'custom',
    })
    toast.success('Word added!')
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

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h2 className="text-lg font-bold text-text-primary">Add New Word</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 pb-6 space-y-4">
          {/* English */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              English
            </label>
            <input
              type="text"
              value={english}
              onChange={e => setEnglish(e.target.value)}
              placeholder="e.g. The beach"
              className="input-base"
              autoFocus
            />
          </div>

          {/* Spanish */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Spanish
            </label>
            <input
              type="text"
              value={spanish}
              onChange={e => setSpanish(e.target.value)}
              placeholder="e.g. La playa"
              className="input-base"
            />
          </div>

          {/* Pronunciation */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Pronunciation <span className="text-text-muted font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={pronunciation}
              onChange={e => setPronunciation(e.target.value)}
              placeholder="e.g. la PLA-ya"
              className="input-base"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium press-active transition-all duration-150 text-left
                    ${category === cat.id
                      ? 'bg-accent/15 border border-accent/30 text-accent'
                      : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:border-border-subtle/80'
                    }
                  `}
                >
                  <span>{cat.emoji}</span>
                  <span className="truncate text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!english.trim() || !spanish.trim()}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-accent text-white font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Plus size={16} />
            Save Word
          </button>
        </form>
      </div>
    </div>
  )
}
