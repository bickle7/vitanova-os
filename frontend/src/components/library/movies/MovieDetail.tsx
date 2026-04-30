import { useState, useEffect, useRef } from 'react'
import { X, Film, Tv, Loader2, Trash2, Sparkles } from 'lucide-react'
import clsx from 'clsx'
import type { MediaItem, MediaStatus, MediaType } from '../../../types/library'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface Props {
  item: MediaItem
  onClose: () => void
  onUpdate: (id: string, updates: Partial<MediaItem>) => void
  onDelete: (id: string) => void
}

const STATUSES: { value: MediaStatus; label: string; emoji: string }[] = [
  { value: 'watchlist',  label: 'Watchlist',  emoji: '📋' },
  { value: 'watch_next', label: 'Watch Next', emoji: '🎬' },
  { value: 'watched',    label: 'Watched',    emoji: '✓'  },
  { value: 'favourite',  label: 'Favourite',  emoji: '⭐' },
]

interface SuggestionItem {
  title: string
  type: string
  year?: string
  genre?: string
  reason: string
}

export default function MovieDetail({ item, onClose, onUpdate, onDelete }: Props) {
  const [notes, setNotes]           = useState(item.notes ?? '')
  const [status, setStatus]         = useState<MediaStatus>(item.status)
  const [type, setType]             = useState<MediaType>(item.type)
  const [suggestions, setSuggestions] = useState<SuggestionItem[] | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const notesRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save on unmount
  useEffect(() => {
    return () => {
      // intentionally empty — save happens on each change
    }
  }, [])

  const handleStatusChange = (s: MediaStatus) => {
    setStatus(s)
    onUpdate(item.id, { status: s })
  }

  const handleTypeChange = (t: MediaType) => {
    setType(t)
    onUpdate(item.id, { type: t })
  }

  const handleNotesBlur = () => {
    onUpdate(item.id, { notes: notes.trim() || undefined })
  }

  const handleDelete = () => {
    onDelete(item.id)
    onClose()
  }

  const loadSuggestions = async () => {
    if (suggestions !== null || loadingSuggestions) return
    setLoadingSuggestions(true)
    try {
      const res = await fetch(`${API_URL}/api/similar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: item.title, type }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSuggestions(data.suggestions ?? [])
    } catch {
      setSuggestions([])
    } finally {
      setLoadingSuggestions(false)
    }
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet pb-safe" style={{ maxHeight: '90dvh' }}>
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>

        <div className="overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-2 pb-3">
            <div className="flex-1 min-w-0 pr-3">
              <h2 className="text-lg font-bold text-text-primary leading-snug">{item.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                {/* Type toggle */}
                <button
                  onClick={() => handleTypeChange(type === 'movie' ? 'tv' : 'movie')}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-elevated border border-border-subtle text-xs font-medium text-text-secondary press-active hover:border-accent/40 transition-colors"
                >
                  {type === 'movie' ? <Film size={10} /> : <Tv size={10} />}
                  {type === 'movie' ? 'Movie' : 'TV Show'}
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-5 pb-6 space-y-5">
            {/* Status */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Status</p>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => handleStatusChange(s.value)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all press-active',
                      status === s.value
                        ? 'bg-accent/15 border-accent/40 text-accent'
                        : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/30'
                    )}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Notes</p>
              <textarea
                ref={notesRef}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add your thoughts..."
                rows={3}
                className="input-base resize-none text-sm"
              />
            </div>

            {/* Similar titles */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Similar Titles</p>
                {suggestions === null && !loadingSuggestions && (
                  <button
                    onClick={loadSuggestions}
                    className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/70 press-active transition-colors"
                  >
                    <Sparkles size={11} />
                    Get suggestions
                  </button>
                )}
              </div>

              {loadingSuggestions && (
                <div className="flex items-center gap-2 py-4 text-text-muted">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm">Finding similar titles...</span>
                </div>
              )}

              {suggestions !== null && suggestions.length === 0 && (
                <p className="text-sm text-text-muted py-2">No suggestions available</p>
              )}

              {suggestions !== null && suggestions.length > 0 && (
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <div key={i} className="card px-3 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-semibold text-text-primary">{s.title}</span>
                            {s.year && <span className="text-xs text-text-muted">{s.year}</span>}
                            <span className={clsx(
                              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                              s.type === 'tv' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'
                            )}>
                              {s.type === 'tv' ? 'TV' : 'Film'}
                            </span>
                          </div>
                          {s.genre && <p className="text-xs text-text-muted mt-0.5">{s.genre}</p>}
                          <p className="text-xs text-text-secondary mt-1 italic">{s.reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {suggestions === null && !loadingSuggestions && (
                <div className="flex items-center justify-center py-6 rounded-2xl bg-bg-elevated border border-dashed border-border-subtle">
                  <div className="text-center">
                    <Sparkles size={20} className="text-accent/40 mx-auto mb-2" />
                    <p className="text-sm text-text-muted">Tap above to get AI suggestions</p>
                  </div>
                </div>
              )}
            </div>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-400 text-sm font-semibold press-active hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={15} />
              Remove from Library
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
