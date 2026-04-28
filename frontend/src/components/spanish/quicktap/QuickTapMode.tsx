import { useState, useMemo, useCallback } from 'react'
import { Copy, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import clsx from 'clsx'
import type { Word, QuickTapContext, Connector, SuffixChip, SmartItem, SavedPhrase } from '../../../types/spanish'
import type { useWords } from '../../../hooks/useWords'
import { CONNECTORS, SUFFIX_CHIPS, SEED_WORDS, CONNECTOR_SMART_WORDS } from '../../../data/seedData'
import { getSavedPhrases, deleteSavedPhrase } from '../../../lib/storage'
import PhraseDisplay from './PhraseDisplay'

type WordsState = ReturnType<typeof useWords>

const CONTEXT_META: { id: QuickTapContext; label: string; emoji: string }[] = [
  { id: 'eating_drinking', label: 'Eating & Drinking', emoji: '🍽️' },
  { id: 'shopping',        label: 'Shopping',          emoji: '🛍️' },
  { id: 'getting_around',  label: 'Getting Around',    emoji: '🗺️' },
  { id: 'hotel',           label: 'Hotel',             emoji: '🏨' },
  { id: 'emergencies',     label: 'Emergencies',       emoji: '🚨' },
]

const CONTEXT_CATEGORIES: Record<QuickTapContext, string[]> = {
  eating_drinking: ['eating_drinking'],
  shopping:        ['shopping'],
  getting_around:  ['travel_directions'],
  hotel:           ['hotel'],
  emergencies:     ['emergencies'],
}

function buildPhrase(
  connector: Connector | null,
  smartItems: SmartItem[],
  selectedWords: Word[],
  selectedSuffixes: SuffixChip[]
): { spanish: string; english: string } {
  if (!connector && smartItems.length === 0 && selectedWords.length === 0 && selectedSuffixes.length === 0) {
    return { spanish: '', english: '' }
  }

  const spanishParts: string[] = []
  const englishParts: string[] = []

  if (connector) {
    spanishParts.push(connector.spanish)
    englishParts.push(connector.english)
  }

  const allItems = [
    ...smartItems.map(s => ({ spanish: s.spanish, english: s.english })),
    ...selectedWords.map(w => ({ spanish: w.spanish, english: w.english })),
  ]

  if (allItems.length > 0) {
    spanishParts.push(allItems.map(i => i.spanish).join(' '))
    englishParts.push(allItems.map(i => i.english).join(', '))
  }

  if (selectedSuffixes.length > 0) {
    spanishParts.push(selectedSuffixes.map(s => s.spanish).join(', '))
    englishParts.push(selectedSuffixes.map(s => s.english).join(', '))
  }

  return {
    spanish: spanishParts.join(' '),
    english: englishParts.join(' '),
  }
}

export default function QuickTapMode({ words, incrementUseCount }: WordsState) {
  const [selectedContext, setSelectedContext] = useState<QuickTapContext>('eating_drinking')
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null)
  const [selectedSmartItems, setSelectedSmartItems] = useState<SmartItem[]>([])
  const [selectedWords, setSelectedWords] = useState<Word[]>([])
  const [selectedSuffixes, setSelectedSuffixes] = useState<SuffixChip[]>([])
  const [showMode, setShowMode] = useState(false)
  const [showAllWords, setShowAllWords] = useState(false)
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>(() => getSavedPhrases())
  const [expandedPhrase, setExpandedPhrase] = useState<SavedPhrase | null>(null)

  // Smart suggestions for the selected connector
  const smartWords = useMemo(() => {
    if (!selectedConnector) return []
    const key = `${selectedContext}:${selectedConnector.spanish}`
    return CONNECTOR_SMART_WORDS[key] ?? []
  }, [selectedContext, selectedConnector])

  // Context words from user dictionary + seed bank
  const contextWords = useMemo(() => {
    const relevantCategories = CONTEXT_CATEGORIES[selectedContext]
    const userContextWords = words.filter(w => relevantCategories.includes(w.category))
    const userIds = new Set(words.map(w => w.id))
    const seedContextWords = SEED_WORDS.filter(
      sw => relevantCategories.includes(sw.category) && !userIds.has(sw.id)
    )
    const combined: Word[] = [...userContextWords]
    for (const sw of seedContextWords) {
      if (!combined.find(w => w.id === sw.id)) combined.push(sw)
    }
    return combined
  }, [selectedContext, words])

  const connectors = CONNECTORS[selectedContext]

  const builtPhrase = useMemo(
    () => buildPhrase(selectedConnector, selectedSmartItems, selectedWords, selectedSuffixes),
    [selectedConnector, selectedSmartItems, selectedWords, selectedSuffixes]
  )

  const handleContextChange = useCallback((ctx: QuickTapContext) => {
    setSelectedContext(ctx)
    setSelectedConnector(null)
    setSelectedSmartItems([])
    setSelectedWords([])
    setSelectedSuffixes([])
    setShowAllWords(false)
  }, [])

  const handleConnectorTap = useCallback((connector: Connector) => {
    const isSame = selectedConnector?.spanish === connector.spanish
    setSelectedConnector(isSame ? null : connector)
    setSelectedSmartItems([])
    setSelectedWords([])
    setShowAllWords(false)
  }, [selectedConnector])

  const handleSmartItemTap = useCallback((item: SmartItem) => {
    setSelectedSmartItems(prev => {
      const exists = prev.find(s => s.id === item.id)
      return exists ? prev.filter(s => s.id !== item.id) : [...prev, item]
    })
  }, [])

  const handleWordTap = useCallback((word: Word) => {
    setSelectedWords(prev => {
      const exists = prev.find(w => w.id === word.id)
      if (exists) return prev.filter(w => w.id !== word.id)
      incrementUseCount(word.id)
      return [...prev, word]
    })
  }, [incrementUseCount])

  const handleSuffixTap = useCallback((suffix: SuffixChip) => {
    setSelectedSuffixes(prev => {
      const exists = prev.find(s => s.spanish === suffix.spanish)
      return exists ? prev.filter(s => s.spanish !== suffix.spanish) : [...prev, suffix]
    })
  }, [])

  const handleClear = useCallback(() => {
    setSelectedConnector(null)
    setSelectedSmartItems([])
    setSelectedWords([])
    setSelectedSuffixes([])
    setShowAllWords(false)
  }, [])

  const handlePhraseSaved = useCallback(() => {
    setSavedPhrases(getSavedPhrases())
  }, [])

  const handleDeleteSavedPhrase = useCallback((id: string) => {
    const updated = deleteSavedPhrase(id)
    setSavedPhrases(updated)
    if (expandedPhrase?.id === id) setExpandedPhrase(null)
  }, [expandedPhrase])

  const hasPhrase = builtPhrase.spanish.length > 0
  const showSmartSuggestions = selectedConnector !== null && smartWords.length > 0

  return (
    <div className="flex flex-col h-full overflow-hidden relative">

      {/* Context tabs */}
      <div className="px-4 pt-3 pb-3 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CONTEXT_META.map(ctx => (
            <button
              key={ctx.id}
              onClick={() => handleContextChange(ctx.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 press-active transition-all duration-200',
                selectedContext === ctx.id
                  ? 'bg-accent text-bg-primary shadow-glow-accent'
                  : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:border-accent/30 hover:text-accent'
              )}
            >
              <span>{ctx.emoji}</span>
              <span>{ctx.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">

        {/* Connector Phrases */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            Start with...
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {connectors.map((connector, i) => {
              const isActive = selectedConnector?.spanish === connector.spanish
              return (
                <button
                  key={i}
                  onClick={() => handleConnectorTap(connector)}
                  className={clsx(
                    'flex items-center justify-between px-4 py-3 rounded-xl text-left press-active transition-all duration-200 border',
                    isActive
                      ? 'bg-accent/15 border-accent/40'
                      : 'bg-bg-elevated border-border-subtle hover:border-accent/20 hover:text-text-primary'
                  )}
                >
                  <div>
                    <p className={clsx('text-sm font-semibold', isActive ? 'text-accent' : 'text-text-primary')}>
                      {connector.spanish}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{connector.english}</p>
                  </div>
                  {isActive && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 ml-2" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Smart suggestions — shown when a connector is selected */}
        {showSmartSuggestions && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
              Suggested next words
            </h3>
            <div className="flex flex-wrap gap-2">
              {smartWords.map(item => {
                const isSelected = selectedSmartItems.some(s => s.id === item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSmartItemTap(item)}
                    className={clsx(
                      'px-3.5 py-2 rounded-xl text-sm font-medium press-active transition-all duration-200 border',
                      isSelected
                        ? 'bg-accent/20 border-accent/50 text-accent'
                        : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/20 hover:text-text-primary'
                    )}
                  >
                    <span className={isSelected ? 'text-accent' : ''}>{item.spanish}</span>
                    <span className="text-xs ml-1.5 opacity-50">{item.english}</span>
                  </button>
                )
              })}
            </div>

            {/* Toggle to show full dictionary words */}
            {contextWords.length > 0 && (
              <button
                onClick={() => setShowAllWords(v => !v)}
                className="mt-3 text-xs text-text-muted hover:text-accent transition-colors press-active"
              >
                {showAllWords ? '− Hide dictionary words' : '+ Show my dictionary words'}
              </button>
            )}
          </div>
        )}

        {/* Dictionary word chips — shown when no connector, or when "show all" toggled */}
        {(!showSmartSuggestions || showAllWords) && contextWords.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
              {showSmartSuggestions ? 'My dictionary words' : 'Add words'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {contextWords.map(word => {
                const isSelected = selectedWords.some(w => w.id === word.id)
                return (
                  <button
                    key={word.id}
                    onClick={() => handleWordTap(word)}
                    className={clsx(
                      'px-3.5 py-2 rounded-xl text-sm font-medium press-active transition-all duration-200 border',
                      isSelected
                        ? 'bg-accent/20 border-accent/50 text-accent'
                        : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/20 hover:text-text-primary'
                    )}
                  >
                    <span className={isSelected ? 'text-accent' : ''}>{word.spanish}</span>
                    <span className="text-xs ml-1.5 opacity-50">{word.english}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state when no connector and no context words */}
        {!showSmartSuggestions && contextWords.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-bg-elevated rounded-2xl border border-border-subtle mb-5">
            <span className="text-3xl mb-2">📚</span>
            <p className="text-text-muted text-sm">No words in this category</p>
            <p className="text-text-muted text-xs mt-1">Add words in the Dictionary tab</p>
          </div>
        )}

        {/* Suffix chips */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            Add to the end
          </h3>
          <div className="flex flex-wrap gap-2">
            {SUFFIX_CHIPS.map((suffix, i) => {
              const isSelected = selectedSuffixes.some(s => s.spanish === suffix.spanish)
              return (
                <button
                  key={i}
                  onClick={() => handleSuffixTap(suffix)}
                  className={clsx(
                    'px-3.5 py-2 rounded-xl text-sm font-medium press-active transition-all duration-200 border',
                    isSelected
                      ? 'bg-success/15 border-success/30 text-success'
                      : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-success/20 hover:text-text-primary'
                  )}
                >
                  <span className={isSelected ? 'text-success' : ''}>{suffix.spanish}</span>
                  <span className="text-xs ml-1.5 opacity-50">{suffix.english}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Saved Phrases */}
        {savedPhrases.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
              Saved phrases
            </h3>
            <div className="space-y-2">
              {savedPhrases.map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 bg-bg-elevated border border-border-subtle rounded-xl px-3 py-2.5"
                >
                  <button
                    className="flex-1 text-left press-active"
                    onClick={() => setExpandedPhrase(p)}
                  >
                    <p className="text-sm font-medium text-text-primary leading-snug">{p.spanish}</p>
                    {p.english && <p className="text-xs text-text-muted mt-0.5">{p.english}</p>}
                  </button>
                  <button
                    onClick={() => handleDeleteSavedPhrase(p.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors flex-shrink-0"
                    aria-label="Delete saved phrase"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spacer for phrase panel */}
        <div className={clsx('transition-all duration-300', hasPhrase ? 'h-32' : 'h-0')} />
      </div>

      {/* Phrase Display Panel */}
      <PhraseDisplay
        phrase={builtPhrase}
        onClear={handleClear}
        onShowMode={() => setShowMode(true)}
        onPhraseSaved={handlePhraseSaved}
      />

      {/* Show Mode overlay */}
      {showMode && hasPhrase && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary px-8"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
          onClick={() => setShowMode(false)}
        >
          <div className="text-center max-w-[380px]">
            <p className="text-5xl font-bold text-text-primary leading-tight tracking-tight mb-6">
              {builtPhrase.spanish}
            </p>
            <p className="text-xl text-text-secondary font-light">
              {builtPhrase.english}
            </p>
            <p className="mt-12 text-sm text-text-muted">Tap anywhere to dismiss</p>
          </div>
        </div>
      )}

      {/* Saved phrase detail overlay */}
      {expandedPhrase && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary px-8"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
          onClick={() => setExpandedPhrase(null)}
        >
          <div className="text-center max-w-[380px]" onClick={e => e.stopPropagation()}>
            <p className="text-5xl font-bold text-text-primary leading-tight tracking-tight mb-6">
              {expandedPhrase.spanish}
            </p>
            <p className="text-xl text-text-secondary font-light mb-12">
              {expandedPhrase.english}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(expandedPhrase.spanish)
                    toast.success('Copied!')
                  } catch { toast.error('Could not copy') }
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-semibold press-active hover:bg-accent hover:text-bg-primary transition-all duration-200"
              >
                <Copy size={15} />
                Copy
              </button>
              <button
                onClick={() => handleDeleteSavedPhrase(expandedPhrase.id)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold press-active hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                <X size={15} />
                Delete
              </button>
            </div>
            <p className="mt-8 text-sm text-text-muted">Tap outside to dismiss</p>
          </div>
        </div>
      )}
    </div>
  )
}
