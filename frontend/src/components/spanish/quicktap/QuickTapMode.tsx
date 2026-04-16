import { useState, useMemo, useCallback } from 'react'
import clsx from 'clsx'
import type { Word, QuickTapContext, Connector, SuffixChip } from '../../../types/spanish'
import type { useWords } from '../../../hooks/useWords'
import { CONNECTORS, SUFFIX_CHIPS, SEED_WORDS } from '../../../data/seedData'
import PhraseDisplay from './PhraseDisplay'

type WordsState = ReturnType<typeof useWords>

const CONTEXT_META: { id: QuickTapContext; label: string; emoji: string }[] = [
  { id: 'eating_drinking', label: 'Eating & Drinking', emoji: '🍽️' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'getting_around', label: 'Getting Around', emoji: '🗺️' },
  { id: 'hotel', label: 'Hotel', emoji: '🏨' },
  { id: 'emergencies', label: 'Emergencies', emoji: '🚨' },
]

const CONTEXT_CATEGORIES: Record<QuickTapContext, string[]> = {
  eating_drinking: ['eating_drinking'],
  shopping: ['shopping'],
  getting_around: ['travel_directions'],
  hotel: ['hotel'],
  emergencies: ['emergencies', 'greetings'],
}

function buildPhrase(
  connector: Connector | null,
  selectedWords: Word[],
  selectedSuffixes: SuffixChip[]
): { spanish: string; english: string } {
  if (!connector && selectedWords.length === 0 && selectedSuffixes.length === 0) {
    return { spanish: '', english: '' }
  }

  const spanishParts: string[] = []
  const englishParts: string[] = []

  if (connector) {
    spanishParts.push(connector.spanish)
    englishParts.push(connector.english)
  }

  if (selectedWords.length > 0) {
    spanishParts.push(selectedWords.map(w => w.spanish).join(' '))
    englishParts.push(selectedWords.map(w => w.english).join(', '))
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
  const [selectedWords, setSelectedWords] = useState<Word[]>([])
  const [selectedSuffixes, setSelectedSuffixes] = useState<SuffixChip[]>([])
  const [showMode, setShowMode] = useState(false)

  // Context words: user's words + seed words for this context
  const contextWords = useMemo(() => {
    const relevantCategories = CONTEXT_CATEGORIES[selectedContext]

    // Words from user's personal list
    const userContextWords = words.filter(w => relevantCategories.includes(w.category))

    // Get IDs already in user list
    const userIds = new Set(words.map(w => w.id))

    // Seed words not in user list
    const seedContextWords = SEED_WORDS.filter(
      sw => relevantCategories.includes(sw.category) && !userIds.has(sw.id)
    )

    // Combine, deduplicate
    const combined: Word[] = [...userContextWords]
    for (const sw of seedContextWords) {
      if (!combined.find(w => w.id === sw.id)) {
        combined.push(sw)
      }
    }

    return combined
  }, [selectedContext, words])

  const connectors = CONNECTORS[selectedContext]

  const builtPhrase = useMemo(
    () => buildPhrase(selectedConnector, selectedWords, selectedSuffixes),
    [selectedConnector, selectedWords, selectedSuffixes]
  )

  const handleContextChange = useCallback((ctx: QuickTapContext) => {
    setSelectedContext(ctx)
    setSelectedConnector(null)
    setSelectedWords([])
    setSelectedSuffixes([])
  }, [])

  const handleConnectorTap = useCallback((connector: Connector) => {
    setSelectedConnector(prev =>
      prev?.spanish === connector.spanish ? null : connector
    )
  }, [])

  const handleWordTap = useCallback((word: Word) => {
    setSelectedWords(prev => {
      const exists = prev.find(w => w.id === word.id)
      if (exists) {
        return prev.filter(w => w.id !== word.id)
      }
      incrementUseCount(word.id)
      return [...prev, word]
    })
  }, [incrementUseCount])

  const handleSuffixTap = useCallback((suffix: SuffixChip) => {
    setSelectedSuffixes(prev => {
      const exists = prev.find(s => s.spanish === suffix.spanish)
      if (exists) return prev.filter(s => s.spanish !== suffix.spanish)
      return [...prev, suffix]
    })
  }, [])

  const handleClear = useCallback(() => {
    setSelectedConnector(null)
    setSelectedWords([])
    setSelectedSuffixes([])
  }, [])

  const hasPhrase = builtPhrase.spanish.length > 0

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Context tabs */}
      <div className="px-4 pt-1 pb-3 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CONTEXT_META.map(ctx => (
            <button
              key={ctx.id}
              onClick={() => handleContextChange(ctx.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 press-active transition-all duration-200',
                selectedContext === ctx.id
                  ? 'bg-accent-warm text-white shadow-glow-warm'
                  : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:border-accent-warm/30 hover:text-accent-warm'
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
                      ? 'bg-accent-warm/15 border-accent-warm/40 text-accent-warm'
                      : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-border-subtle/60 hover:text-text-primary'
                  )}
                >
                  <div>
                    <p className={clsx('text-sm font-semibold', isActive ? 'text-accent-warm' : 'text-text-primary')}>
                      {connector.spanish}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {connector.english}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-accent-warm flex-shrink-0 ml-2" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Word Chips */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            Add words
          </h3>
          {contextWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-bg-elevated rounded-2xl border border-border-subtle">
              <span className="text-3xl mb-2">📚</span>
              <p className="text-text-muted text-sm">No words in this category yet</p>
              <p className="text-text-muted text-xs mt-1">Add words in Reference mode</p>
            </div>
          ) : (
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
                        ? 'bg-accent/20 border-accent/40 text-accent shadow-glow-accent/30'
                        : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/20 hover:text-text-primary'
                    )}
                  >
                    <span className={isSelected ? 'text-accent' : ''}>{word.spanish}</span>
                    <span className="text-xs ml-1.5 opacity-60">{word.english}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Suffix chips */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5">
            Add suffix
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
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-bg-elevated border-border-subtle text-text-secondary hover:border-emerald-500/20 hover:text-text-primary'
                  )}
                >
                  <span className={isSelected ? 'text-emerald-400' : ''}>{suffix.spanish}</span>
                  <span className="text-xs ml-1.5 opacity-60">{suffix.english}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Spacer for phrase panel */}
        <div className={clsx('transition-all duration-300', hasPhrase ? 'h-36' : 'h-0')} />
      </div>

      {/* Phrase Display Panel */}
      <PhraseDisplay
        phrase={builtPhrase}
        onClear={handleClear}
        onShowMode={() => setShowMode(true)}
      />

      {/* Show Mode overlay */}
      {showMode && hasPhrase && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary px-8"
          style={{ animation: 'fadeIn 0.25s ease-out' }}
          onClick={() => setShowMode(false)}
        >
          <div className="text-center max-w-[380px]">
            <p className="text-5xl font-bold text-white leading-tight tracking-tight mb-6">
              {builtPhrase.spanish}
            </p>
            <p className="text-xl text-text-secondary font-light">
              {builtPhrase.english}
            </p>
            <p className="mt-10 text-sm text-text-muted">
              Tap anywhere to dismiss
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
