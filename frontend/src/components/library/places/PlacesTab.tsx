import { useState } from 'react'
import { Plus, MapPin, X, Globe } from 'lucide-react'
import clsx from 'clsx'
import type { Place } from '../../../types/library'
import { getPlaces, addPlace, updatePlace, deletePlace } from '../../../lib/libraryStorage'

interface AddModalProps {
  onClose: () => void
  onAdd: (item: Omit<Place, 'id' | 'createdAt'>) => void
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => String(currentYear - i))

function PlaceAddModal({ onClose, onAdd }: AddModalProps) {
  const [name, setName]       = useState('')
  const [notes, setNotes]     = useState('')
  const [visited, setVisited] = useState(true)
  const [month, setMonth]     = useState('')
  const [year, setYear]       = useState('')

  const monthYear = visited && month && year ? `${month} ${year}` : undefined

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), notes: notes.trim() || undefined, visited, monthYear })
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet pb-safe">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>
        <div className="flex items-center justify-between px-5 pt-2 pb-4">
          <h2 className="text-lg font-bold text-text-primary">Add Place</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 pb-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Place Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Seville, Spain"
              className="input-base"
            />
          </div>

          {/* Visited toggle */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">Status</label>
            <div className="flex gap-2">
              <button
                onClick={() => setVisited(true)}
                className={clsx(
                  'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all press-active',
                  visited ? 'bg-accent/15 border-accent/40 text-accent' : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/30'
                )}
              >
                ✓ Visited
              </button>
              <button
                onClick={() => setVisited(false)}
                className={clsx(
                  'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all press-active',
                  !visited ? 'bg-accent/15 border-accent/40 text-accent' : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/30'
                )}
              >
                🌍 Want to Visit
              </button>
            </div>
          </div>

          {/* Month / Year (visited only) */}
          {visited && (
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                When <span className="font-normal text-text-muted normal-case">(optional)</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="input-base flex-1 text-sm"
                >
                  <option value="">Month</option>
                  {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="input-base flex-1 text-sm"
                >
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Notes <span className="font-normal text-text-muted normal-case">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Memories, recommendations, thoughts..."
              rows={3}
              className="input-base resize-none text-sm"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all"
          >
            Add Place
          </button>
        </div>
      </div>
    </>
  )
}

function PlaceDetailSheet({ place, onClose, onDelete, onUpdate }: {
  place: Place
  onClose: () => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Place>) => void
}) {
  const [notes, setNotes] = useState(place.notes ?? '')

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet pb-safe">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border-subtle" />
        </div>
        <div className="flex items-start justify-between px-5 pt-2 pb-3">
          <div>
            <h2 className="text-lg font-bold text-text-primary">{place.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={clsx(
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                place.visited ? 'bg-green-500/15 text-green-400' : 'bg-accent/15 text-accent'
              )}>
                {place.visited ? '✓ Visited' : '🌍 Bucket List'}
              </span>
              {place.monthYear && (
                <span className="text-xs text-text-muted">{place.monthYear}</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={() => onUpdate(place.id, { notes: notes.trim() || undefined })}
              placeholder="Add memories, tips, recommendations..."
              rows={4}
              className="input-base resize-none text-sm"
            />
          </div>
          <button
            onClick={() => { onDelete(place.id); onClose() }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-400 text-sm font-semibold press-active hover:bg-red-500/10 transition-all"
          >
            <X size={15} />
            Remove Place
          </button>
        </div>
      </div>
    </>
  )
}

export default function PlacesTab() {
  const [places, setPlaces]       = useState<Place[]>(() => getPlaces())
  const [showAdd, setShowAdd]     = useState(false)
  const [detailPlace, setDetailPlace] = useState<Place | null>(null)

  const handleAdd = (item: Omit<Place, 'id' | 'createdAt'>) => {
    setPlaces(addPlace(item))
    setShowAdd(false)
  }

  const handleUpdate = (id: string, updates: Partial<Place>) => {
    const updated = updatePlace(id, updates)
    setPlaces(updated)
    if (detailPlace?.id === id) setDetailPlace(prev => prev ? { ...prev, ...updates } : null)
  }

  const handleDelete = (id: string) => {
    setPlaces(deletePlace(id))
    setDetailPlace(null)
  }

  const visited   = places.filter(p => p.visited)
  const bucketList = places.filter(p => !p.visited)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
        {places.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
              <Globe size={24} className="text-text-muted" />
            </div>
            <p className="text-text-primary font-semibold">No places yet</p>
            <p className="text-text-muted text-sm mt-1">Tap + to log a place you've visited or want to visit</p>
          </div>
        ) : (
          <div className="space-y-6">
            {visited.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-green-400/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin size={10} /> Visited
                </p>
                <div className="space-y-2">
                  {visited.map(place => (
                    <PlaceRow key={place.id} place={place} onTap={setDetailPlace} />
                  ))}
                </div>
              </div>
            )}

            {bucketList.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-accent/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe size={10} /> Bucket List
                </p>
                <div className="space-y-2">
                  {bucketList.map(place => (
                    <PlaceRow key={place.id} place={place} onTap={setDetailPlace} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button onClick={() => setShowAdd(true)} className="fab" aria-label="Add place">
        <Plus size={24} className="text-bg-primary" />
      </button>

      {showAdd && (
        <PlaceAddModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}
      {detailPlace && (
        <PlaceDetailSheet
          place={detailPlace}
          onClose={() => setDetailPlace(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

function PlaceRow({ place, onTap }: { place: Place; onTap: (p: Place) => void }) {
  return (
    <button
      onClick={() => onTap(place)}
      className="card w-full px-4 py-3 flex items-center gap-3 text-left press-active"
    >
      <div className={clsx(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        place.visited ? 'bg-green-500/10' : 'bg-accent/10'
      )}>
        {place.visited
          ? <MapPin size={15} className="text-green-400" />
          : <Globe size={15} className="text-accent" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{place.name}</p>
        {place.monthYear && (
          <p className="text-xs text-text-muted mt-0.5">{place.monthYear}</p>
        )}
        {place.notes && !place.monthYear && (
          <p className="text-xs text-text-muted truncate mt-0.5">{place.notes}</p>
        )}
      </div>
    </button>
  )
}
