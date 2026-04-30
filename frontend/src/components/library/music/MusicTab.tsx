import { useState } from 'react'
import { Plus, Music, X, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import type { MusicItem } from '../../../types/library'
import { getMusicItems, addMusicItem, deleteMusicItem } from '../../../lib/libraryStorage'

interface AddModalProps {
  onClose: () => void
  onAdd: (item: { artist: string; album?: string; genre?: string }) => void
}

function MusicAddModal({ onClose, onAdd }: AddModalProps) {
  const [artist, setArtist] = useState('')
  const [album, setAlbum]   = useState('')
  const [genre, setGenre]   = useState('')

  const handleAdd = () => {
    if (!artist.trim()) return
    onAdd({
      artist: artist.trim(),
      album: album.trim() || undefined,
      genre: genre.trim() || undefined,
    })
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet pb-safe">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h2 className="text-lg font-bold text-text-primary">Add Music</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Artist *</label>
            <input
              autoFocus
              type="text"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && artist.trim()) handleAdd() }}
              placeholder="e.g. Arctic Monkeys"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Album <span className="font-normal text-text-muted normal-case">(optional)</span></label>
            <input
              type="text"
              value={album}
              onChange={e => setAlbum(e.target.value)}
              placeholder="e.g. AM"
              className="input-base"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Genre <span className="font-normal text-text-muted normal-case">(optional)</span></label>
            <input
              type="text"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              placeholder="e.g. Indie Rock"
              className="input-base"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!artist.trim()}
            className="w-full py-3.5 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all"
          >
            Add Artist / Album
          </button>
        </div>
      </div>
    </>
  )
}

export default function MusicTab() {
  const [items, setItems]       = useState<MusicItem[]>(() => getMusicItems())
  const [showAdd, setShowAdd]   = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleAdd = (item: { artist: string; album?: string; genre?: string }) => {
    setItems(addMusicItem(item))
    setShowAdd(false)
  }

  const handleDelete = (id: string) => {
    setItems(deleteMusicItem(id))
    setExpandedId(null)
  }

  // Group by artist
  const grouped = items.reduce<Record<string, MusicItem[]>>((acc, item) => {
    if (!acc[item.artist]) acc[item.artist] = []
    acc[item.artist].push(item)
    return acc
  }, {})
  const artists = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
              <Music size={24} className="text-text-muted" />
            </div>
            <p className="text-text-primary font-semibold">No music logged yet</p>
            <p className="text-text-muted text-sm mt-1">Tap + to add an artist or album</p>
          </div>
        ) : (
          <div className="space-y-4">
            {artists.map(artist => (
              <div key={artist}>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Music size={10} className="text-accent" />
                  {artist}
                </p>
                <div className="space-y-2">
                  {grouped[artist].map(item => (
                    <div key={item.id}>
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="card w-full px-4 py-3 flex items-center gap-3 text-left press-active"
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Music size={15} className="text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {item.album ?? item.artist}
                          </p>
                          {item.genre && (
                            <p className="text-xs text-text-muted mt-0.5">{item.genre}</p>
                          )}
                        </div>
                        <ChevronRight
                          size={14}
                          className={clsx('text-text-muted transition-transform flex-shrink-0', expandedId === item.id && 'rotate-90')}
                        />
                      </button>

                      {expandedId === item.id && (
                        <div className="mt-1 px-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 text-xs font-semibold press-active hover:bg-red-500/10 transition-all"
                          >
                            <X size={13} />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} className="fab" aria-label="Add music">
        <Plus size={24} className="text-bg-primary" />
      </button>

      {showAdd && (
        <MusicAddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
    </div>
  )
}
