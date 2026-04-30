import { useState } from 'react'
import { X, Film, Tv } from 'lucide-react'
import clsx from 'clsx'
import type { MediaType, MediaStatus } from '../../../types/library'

interface Props {
  onClose: () => void
  onAdd: (item: { title: string; type: MediaType; status: MediaStatus }) => void
}

const STATUSES: { value: MediaStatus; label: string; emoji: string }[] = [
  { value: 'watchlist',  label: 'Watchlist',   emoji: '📋' },
  { value: 'watch_next', label: 'Watch Next',  emoji: '🎬' },
  { value: 'watched',    label: 'Watched',     emoji: '✓'  },
  { value: 'favourite',  label: 'Favourite',   emoji: '⭐' },
]

export default function MovieAddModal({ onClose, onAdd }: Props) {
  const [title, setTitle]   = useState('')
  const [type, setType]     = useState<MediaType>('movie')
  const [status, setStatus] = useState<MediaStatus>('watchlist')

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd({ title: title.trim(), type, status })
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet pb-safe">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h2 className="text-lg font-bold text-text-primary">Add to Library</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && title.trim()) handleAdd() }}
              placeholder="e.g. Oppenheimer"
              className="input-base"
            />
          </div>

          {/* Type toggle */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setType('movie')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all press-active',
                  type === 'movie'
                    ? 'bg-accent/15 border-accent/40 text-accent'
                    : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/30'
                )}
              >
                <Film size={15} />
                Movie
              </button>
              <button
                onClick={() => setType('tv')}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all press-active',
                  type === 'tv'
                    ? 'bg-accent/15 border-accent/40 text-accent'
                    : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/30'
                )}
              >
                <Tv size={15} />
                TV Show
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
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

          {/* Add button */}
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="w-full py-3.5 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Add to Library
          </button>
        </div>
      </div>
    </>
  )
}
