import { useState } from 'react'
import { Plus, Film, Tv, Sparkles, ListPlus } from 'lucide-react'
import clsx from 'clsx'
import type { MediaItem, MediaStatus, MediaType } from '../../../types/library'
import {
  getMediaItems, addMediaItem, updateMediaItem, deleteMediaItem,
} from '../../../lib/libraryStorage'
import MovieAddModal from './MovieAddModal'
import MovieDetail from './MovieDetail'
import RecommendedPage from './RecommendedPage'
import MovieImportModal from './MovieImportModal'

type FilterStatus = 'all' | MediaStatus

const STATUS_META: { value: MediaStatus; label: string; emoji: string }[] = [
  { value: 'favourite',  label: 'Favourites', emoji: '⭐' },
  { value: 'watch_next', label: 'Watch Next',  emoji: '🎬' },
  { value: 'watchlist',  label: 'Watchlist',   emoji: '📋' },
  { value: 'watched',    label: 'Watched',     emoji: '✓'  },
]

function TypeBadge({ type }: { type: MediaType }) {
  return (
    <span className={clsx(
      'text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0',
      type === 'tv' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'
    )}>
      {type === 'tv' ? 'TV' : 'Film'}
    </span>
  )
}

export default function MoviesTab() {
  const [items, setItems]             = useState<MediaItem[]>(() => getMediaItems())
  const [filter, setFilter]           = useState<FilterStatus>('all')
  const [showAdd, setShowAdd]         = useState(false)
  const [detailItem, setDetailItem]   = useState<MediaItem | null>(null)
  const [showRecommended, setShowRecommended] = useState(false)
  const [showImport, setShowImport]           = useState(false)

  const handleAdd = (item: { title: string; type: MediaType; status: MediaStatus }) => {
    setItems(addMediaItem(item))
    setShowAdd(false)
  }

  const handleUpdate = (id: string, updates: Partial<MediaItem>) => {
    const updated = updateMediaItem(id, updates)
    setItems(updated)
    if (detailItem?.id === id) {
      setDetailItem(prev => prev ? { ...prev, ...updates } : null)
    }
  }

  const handleDelete = (id: string) => {
    setItems(deleteMediaItem(id))
    setDetailItem(null)
  }

  const handleAddFromRecommended = (title: string, type: 'movie' | 'tv') => {
    setItems(addMediaItem({ title, type, status: 'watchlist' }))
  }

  const handleImport = (titles: string[]) => {
    let updated = items
    for (const title of titles) {
      updated = addMediaItem({ title, type: 'movie', status: 'watchlist' })
    }
    setItems(updated)
  }

  const filteredItems = filter === 'all' ? items : items.filter(i => i.status === filter)

  // Group by status for "all" view
  const grouped = STATUS_META.map(s => ({
    ...s,
    items: items.filter(i => i.status === s.value),
  })).filter(g => g.items.length > 0)

  const isEmpty = items.length === 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header row: filter pills + Recommended button */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
            <button
              onClick={() => setFilter('all')}
              className={clsx('pill-btn flex-shrink-0 text-xs', filter === 'all' ? 'pill-btn-active' : 'pill-btn-inactive')}
            >
              All {items.length > 0 && <span className="ml-1 opacity-60">{items.length}</span>}
            </button>
            {STATUS_META.map(s => {
              const count = items.filter(i => i.status === s.value).length
              if (count === 0) return null
              return (
                <button
                  key={s.value}
                  onClick={() => setFilter(s.value)}
                  className={clsx('pill-btn flex-shrink-0 text-xs', filter === s.value ? 'pill-btn-active' : 'pill-btn-inactive')}
                >
                  {s.emoji} {s.label}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-bg-elevated border border-border-subtle text-text-secondary text-xs font-semibold press-active hover:border-accent/40 transition-all"
              aria-label="Import list"
            >
              <ListPlus size={12} />
              <span>Import</span>
            </button>
            <button
              onClick={() => setShowRecommended(true)}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-semibold press-active hover:bg-accent hover:text-bg-primary transition-all"
              aria-label="Recommended"
            >
              <Sparkles size={12} />
              <span>For You</span>
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-24">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
              <Film size={24} className="text-text-muted" />
            </div>
            <p className="text-text-primary font-semibold">Nothing here yet</p>
            <p className="text-text-muted text-sm mt-1">Tap + to add a movie or TV show</p>
          </div>
        )}

        {!isEmpty && filter !== 'all' && (
          <div className="space-y-2 pt-1">
            {filteredItems.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-12">No titles with this status</p>
            ) : (
              filteredItems.map(item => (
                <MediaRow key={item.id} item={item} onTap={setDetailItem} />
              ))
            )}
          </div>
        )}

        {!isEmpty && filter === 'all' && (
          <div className="space-y-6 pt-1">
            {grouped.map(group => (
              <div key={group.value}>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
                  {group.emoji} {group.label}
                </p>
                <div className="space-y-2">
                  {group.items.map(item => (
                    <MediaRow key={item.id} item={item} onTap={setDetailItem} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} className="fab" aria-label="Add title">
        <Plus size={24} className="text-bg-primary" />
      </button>

      {/* Modals */}
      {showAdd && (
        <MovieAddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
      {detailItem && (
        <MovieDetail
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
      {showRecommended && (
        <RecommendedPage
          mediaItems={items}
          onClose={() => setShowRecommended(false)}
          onAddToLibrary={handleAddFromRecommended}
        />
      )}
      {showImport && (
        <MovieImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}
    </div>
  )
}

function MediaRow({ item, onTap }: { item: MediaItem; onTap: (item: MediaItem) => void }) {
  return (
    <button
      onClick={() => onTap(item)}
      className="card w-full px-4 py-3 flex items-center gap-3 text-left press-active"
    >
      <div className={clsx(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        item.type === 'tv' ? 'bg-blue-500/10' : 'bg-purple-500/10'
      )}>
        {item.type === 'tv'
          ? <Tv size={15} className="text-blue-400" />
          : <Film size={15} className="text-purple-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
        {item.notes && (
          <p className="text-xs text-text-muted truncate mt-0.5">{item.notes}</p>
        )}
      </div>
      <TypeBadge type={item.type} />
    </button>
  )
}
