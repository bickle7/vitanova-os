import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, ArrowLeftRight, Plus, Compass, Heart, X, GripVertical } from 'lucide-react'
import clsx from 'clsx'
import type { Word, Category, DirectionToggle, SavedPhrase } from '../../../types/spanish'
import type { useWords } from '../../../hooks/useWords'
import { getSavedPhrases, deleteSavedPhrase, reorderSavedPhrases } from '../../../lib/storage'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import WordCard from './WordCard'
import WordDetail from './WordDetail'
import AddWordModal from './AddWordModal'

type WordsState = ReturnType<typeof useWords>

const CATEGORY_FILTERS: { id: Category | 'all'; label: string; emoji: string }[] = [
  { id: 'all',            label: 'All',            emoji: '📚' },
  { id: 'greetings',      label: 'Greetings',      emoji: '👋' },
  { id: 'cafe',           label: 'Café',           emoji: '☕' },
  { id: 'restaurant',     label: 'Restaurant',     emoji: '🍽️' },
  { id: 'bar',            label: 'Bar',            emoji: '🍺' },
  { id: 'shop',           label: 'Shop',           emoji: '🛍️' },
  { id: 'hotel',          label: 'Hotel',          emoji: '🏨' },
  { id: 'getting_around', label: 'Getting Around', emoji: '🧭' },
  { id: 'health',         label: 'Health',         emoji: '🏥' },
  { id: 'beach',          label: 'Beach',          emoji: '🏖️' },
  { id: 'emergencies',    label: 'Emergencies',    emoji: '🚨' },
]

// ── Sortable word row (Favourites tab only) ────────────────────────────────
function SortableWordRow({
  word, direction, onTap, onToggleFavourite,
}: {
  word: Word
  direction: DirectionToggle
  onTap: (w: Word) => void
  onToggleFavourite: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: word.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-1"
    >
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 w-6 h-8 flex items-center justify-center text-text-muted cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>
      <div className="flex-1 min-w-0">
        <WordCard word={word} direction={direction} onTap={onTap} onToggleFavourite={onToggleFavourite} />
      </div>
    </div>
  )
}

// ── Sortable phrase row (Favourites tab only) ──────────────────────────────
function SortablePhraseRow({
  phrase, onDelete,
}: {
  phrase: SavedPhrase
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: phrase.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-1"
    >
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 w-6 h-8 flex items-center justify-center text-text-muted cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>
      <div className="card flex items-center gap-2 px-3 py-2.5 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary leading-snug">{phrase.spanish}</p>
          {phrase.english && <p className="text-xs text-text-muted mt-0.5">{phrase.english}</p>}
        </div>
        <button
          onClick={() => onDelete(phrase.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors flex-shrink-0"
          aria-label="Delete phrase"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

interface DiscoveryModalProps {
  discoveryWords: Word[]
  onAdd: (word: Word) => void
  onClose: () => void
}

function DiscoveryModal({ discoveryWords, onAdd, onClose }: DiscoveryModalProps) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all')

  const filtered = useMemo(() => {
    return discoveryWords.filter(w => {
      const matchesCat = catFilter === 'all' || w.category === catFilter
      const q = search.toLowerCase()
      const matchesSearch = !q || w.english.toLowerCase().includes(q) || w.spanish.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  }, [discoveryWords, search, catFilter])

  const catFilters = CATEGORY_FILTERS.filter(c => c.id !== 'all') as { id: Category; label: string; emoji: string }[]

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-bg-surface rounded-t-[20px] z-50 flex flex-col"
        style={{ maxHeight: '85dvh', animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 bg-border-subtle rounded-full" />
        </div>

        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-text-primary">Browse & Add Words</h2>
            <span className="text-xs text-text-muted bg-bg-elevated px-2 py-1 rounded-full">
              {discoveryWords.length} available
            </span>
          </div>

          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search words..."
              className="input-base pl-9 text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setCatFilter('all')}
              className={clsx('pill-btn flex-shrink-0 text-xs', catFilter === 'all' ? 'pill-btn-active' : 'pill-btn-inactive')}
            >
              All
            </button>
            {catFilters.map(c => (
              <button
                key={c.id}
                onClick={() => setCatFilter(c.id)}
                className={clsx('pill-btn flex-shrink-0 text-xs', catFilter === c.id ? 'pill-btn-active' : 'pill-btn-inactive')}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-safe">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-text-secondary text-sm">No words found</p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {filtered.map(word => (
                <div
                  key={word.id}
                  className="flex items-center justify-between bg-bg-elevated rounded-xl p-3 border border-border-subtle"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{word.english}</p>
                    <p className="text-sm text-accent font-medium truncate">{word.spanish}</p>
                    {word.pronunciation && (
                      <p className="text-xs text-text-muted truncate">{word.pronunciation}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onAdd(word)}
                    className="ml-3 flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent press-active hover:bg-accent hover:text-bg-primary transition-all duration-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface Props extends WordsState {
  favouritesOnly: boolean
}

export default function ReferenceMode({
  words,
  discoveryWords,
  addSeedWord,
  addWord,
  toggleFavourite,
  reorderFavouriteWords,
  deleteWord,
  incrementUseCount,
  favouritesOnly,
}: Props) {
  const [search, setSearch] = useState('')
  const [direction, setDirection] = useState<DirectionToggle>('EN_ES')
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>(() => getSavedPhrases())

  useEffect(() => {
    const refresh = () => setSavedPhrases(getSavedPhrases())
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  const handleWordDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const favs = words.filter(w => w.is_favourite)
    const oldIndex = favs.findIndex(w => w.id === active.id)
    const newIndex = favs.findIndex(w => w.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const newOrder = arrayMove(favs, oldIndex, newIndex).map(w => w.id)
    reorderFavouriteWords(newOrder)
  }, [words, reorderFavouriteWords])

  const handlePhraseDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = savedPhrases.findIndex(p => p.id === active.id)
    const newIndex = savedPhrases.findIndex(p => p.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(savedPhrases, oldIndex, newIndex)
    setSavedPhrases(reordered)
    reorderSavedPhrases(reordered.map(p => p.id))
  }, [savedPhrases])

  const handleDeletePhrase = useCallback((id: string) => {
    deleteSavedPhrase(id)
    setSavedPhrases(getSavedPhrases())
  }, [])

  const filteredWords = useMemo(() => {
    const filtered = words.filter(word => {
      if (favouritesOnly && !word.is_favourite) return false
      if (!favouritesOnly && activeCategory !== 'all' && word.category !== activeCategory) return false

      if (search) {
        const q = search.toLowerCase()
        const primary = direction === 'EN_ES' ? word.english : word.spanish
        const secondary = direction === 'EN_ES' ? word.spanish : word.english
        return primary.toLowerCase().includes(q) || secondary.toLowerCase().includes(q)
      }
      return true
    })

    // Favourites always float to top in the full "all" view
    if (!favouritesOnly && activeCategory === 'all') {
      return filtered.sort((a, b) => {
        if (a.is_favourite && !b.is_favourite) return -1
        if (!a.is_favourite && b.is_favourite) return 1
        return a.english.localeCompare(b.english)
      })
    }

    return filtered
  }, [words, activeCategory, search, direction, favouritesOnly])

  const handleToggleFavourite = (id: string) => {
    toggleFavourite(id)
    if (selectedWord?.id === id) {
      setSelectedWord(prev => prev ? { ...prev, is_favourite: !prev.is_favourite } : null)
    }
  }

  const handleWordTap = (word: Word) => {
    setSelectedWord(word)
    incrementUseCount(word.id)
  }

  const emptyTitle = search ? 'No results found' : 'No words yet'
  const emptyBody = search ? 'Try a different search term' : 'Add words using the + button or browse the word bank'

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Favourites tab header */}
      {favouritesOnly && (
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-accent fill-accent" />
            <h2 className="text-base font-bold text-text-primary">Favourites</h2>
            {filteredWords.length > 0 && (
              <span className="text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">
                {filteredWords.length}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Search + Direction toggle + Word bank shortcut */}
      {!favouritesOnly && (
        <div className="px-4 pt-3 pb-3 flex gap-2 flex-shrink-0">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={direction === 'EN_ES' ? 'Search English or Spanish...' : 'Buscar...'}
              className="input-base pl-9 text-sm"
            />
          </div>
          <button
            onClick={() => setDirection(d => d === 'EN_ES' ? 'ES_EN' : 'EN_ES')}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-xs font-semibold text-text-secondary hover:border-accent/40 hover:text-accent press-active transition-all duration-200 flex-shrink-0"
          >
            <ArrowLeftRight size={13} />
            <span>{direction === 'EN_ES' ? 'EN→ES' : 'ES→EN'}</span>
          </button>
          {discoveryWords.length > 0 && (
            <button
              onClick={() => setShowDiscovery(true)}
              className="flex items-center justify-center w-10 bg-bg-elevated border border-border-subtle rounded-xl text-text-secondary hover:border-accent/40 hover:text-accent press-active transition-all duration-200 flex-shrink-0"
              aria-label="Browse word bank"
              title="Browse word bank"
            >
              <Compass size={15} />
            </button>
          )}
        </div>
      )}

      {/* Favourites search */}
      {favouritesOnly && (
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search favourites..."
              className="input-base pl-9 text-sm"
            />
          </div>
        </div>
      )}

      {/* Category filter pills — Dictionary only */}
      {!favouritesOnly && (
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide flex-shrink-0">
          {CATEGORY_FILTERS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as Category | 'all')}
              className={clsx(
                'pill-btn flex-shrink-0 text-xs',
                activeCategory === cat.id ? 'pill-btn-active' : 'pill-btn-inactive'
              )}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Word list / Favourites content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4">
        {favouritesOnly ? (
          <div className="pb-8 space-y-6">
            {/* Words section */}
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Heart size={10} className="fill-accent text-accent" /> Words
              </p>
              {filteredWords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-bg-elevated rounded-2xl border border-border-subtle">
                  <span className="text-2xl mb-2">🤍</span>
                  <p className="text-text-muted text-sm">{search ? 'No results found' : 'No favourited words yet'}</p>
                  {!search && <p className="text-text-muted text-xs mt-1">Tap the heart on any word to save it here</p>}
                </div>
              ) : !search ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleWordDragEnd}>
                  <SortableContext items={filteredWords.map(w => w.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {filteredWords.map(word => (
                        <SortableWordRow
                          key={word.id}
                          word={word}
                          direction={direction}
                          onTap={handleWordTap}
                          onToggleFavourite={handleToggleFavourite}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="space-y-2">
                  {filteredWords.map(word => (
                    <WordCard
                      key={word.id}
                      word={word}
                      direction={direction}
                      onTap={handleWordTap}
                      onToggleFavourite={handleToggleFavourite}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Phrases section */}
            <div>
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2.5">
                Phrases
              </p>
              {savedPhrases.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-bg-elevated rounded-2xl border border-border-subtle">
                  <span className="text-2xl mb-2">💬</span>
                  <p className="text-text-muted text-sm">No saved phrases yet</p>
                  <p className="text-text-muted text-xs mt-1">Build phrases in the Phrase Builder tab and save them</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePhraseDragEnd}>
                  <SortableContext items={savedPhrases.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {savedPhrases.map(p => (
                        <SortablePhraseRow
                          key={p.id}
                          phrase={p}
                          onDelete={handleDeletePhrase}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        ) : (
          <>
            {filteredWords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-text-primary font-semibold mb-1">{emptyTitle}</h3>
                <p className="text-text-muted text-sm max-w-[200px]">{emptyBody}</p>
                {!search && (
                  <button
                    onClick={() => setShowDiscovery(true)}
                    className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-accent/10 border border-accent/20 rounded-xl text-accent text-sm font-medium press-active hover:bg-accent hover:text-bg-primary transition-all duration-200"
                  >
                    <Compass size={15} />
                    Browse word bank
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 pb-28">
                {filteredWords.map(word => (
                  <WordCard
                    key={word.id}
                    word={word}
                    direction={direction}
                    onTap={handleWordTap}
                    onToggleFavourite={handleToggleFavourite}
                  />
                ))}

                {discoveryWords.length > 0 && (
                  <div className="pt-4 pb-2">
                    <button
                      onClick={() => setShowDiscovery(true)}
                      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-bg-elevated border border-dashed border-border-subtle text-text-secondary hover:border-accent/30 hover:text-accent press-active transition-all duration-200"
                    >
                      <Compass size={16} />
                      <span className="text-sm font-medium">Browse & Add Words</span>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                        {discoveryWords.length} more
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB — Dictionary only */}
      {!favouritesOnly && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fab"
          aria-label="Add word"
        >
          <Plus size={24} className="text-bg-primary" />
        </button>
      )}

      {/* Word detail bottom sheet */}
      {selectedWord && (
        <WordDetail
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onToggleFavourite={handleToggleFavourite}
          onDelete={(id) => {
            deleteWord(id)
            setSelectedWord(null)
          }}
        />
      )}

      {/* Add Word Modal */}
      {showAddModal && (
        <AddWordModal
          onClose={() => setShowAddModal(false)}
          onAdd={(params) => {
            addWord(params)
            setShowAddModal(false)
          }}
        />
      )}

      {/* Discovery Modal */}
      {showDiscovery && (
        <DiscoveryModal
          discoveryWords={discoveryWords}
          onAdd={addSeedWord}
          onClose={() => setShowDiscovery(false)}
        />
      )}
    </div>
  )
}
