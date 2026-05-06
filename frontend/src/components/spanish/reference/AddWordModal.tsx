import { useState, useEffect, useRef } from 'react'
import { X, Volume2, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { Category } from '../../../types/spanish'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'greetings',      label: 'Greetings & Basics', emoji: '👋' },
  { id: 'cafe',           label: 'In a Café',           emoji: '☕' },
  { id: 'restaurant',     label: 'In a Restaurant',     emoji: '🍽️' },
  { id: 'shop',           label: 'In a Shop',           emoji: '🛍️' },
  { id: 'hotel',          label: 'In a Hotel',          emoji: '🏨' },
  { id: 'getting_around', label: 'Getting Around',      emoji: '🧭' },
  { id: 'emergencies',    label: 'Emergencies',         emoji: '🚨' },
  { id: 'general',        label: 'General',             emoji: '📝' },
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
  const [translating, setTranslating] = useState(false)
  const [translated, setTranslated] = useState<{ spanish: string; pronunciation: string } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = english.trim()
    if (!trimmed) {
      setTranslated(null)
      setTranslating(false)
      return
    }
    setTranslating(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ english: trimmed }),
        })
        if (!res.ok) throw new Error('Translation failed')
        const data = await res.json()
        if (data.spanish) {
          setTranslated({ spanish: data.spanish, pronunciation: data.pronunciation ?? '' })
        }
      } catch {
        // silently fail — user can type manually via fallback inputs
      } finally {
        setTranslating(false)
      }
    }, 800)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [english])

  const handleSpeak = () => {
    const text = translated?.spanish ?? spanish.trim()
    if (!text || !window.speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalSpanish = translated?.spanish ?? spanish.trim()
    const finalPronunciation = translated?.pronunciation ?? pronunciation.trim()
    if (!english.trim() || !finalSpanish) {
      toast.error('English and Spanish are required')
      return
    }
    onAdd({
      english: english.trim(),
      spanish: finalSpanish,
      category,
      pronunciation: finalPronunciation || undefined,
      source: 'custom',
    })
    toast.success('Word added!')
  }

  const finalSpanish = translated?.spanish ?? spanish.trim()

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet pb-safe" onClick={e => e.stopPropagation()}>
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

          {/* Spanish — auto-translated via backend */}
          <div>
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Spanish
            </label>
            <div className="flex items-center gap-2">
              <div className={`flex-1 min-h-[48px] px-4 py-3 rounded-xl border flex items-center ${
                translated ? 'bg-accent/5 border-accent/30' : 'bg-bg-elevated border-border-subtle'
              }`}>
                {translating ? (
                  <div className="flex items-center gap-2 text-text-muted">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-sm">Translating...</span>
                  </div>
                ) : translated ? (
                  <div>
                    <p className="text-sm font-semibold text-accent">{translated.spanish}</p>
                    {translated.pronunciation && (
                      <p className="text-xs text-text-muted mt-0.5">{translated.pronunciation}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-text-muted">Type English above to translate</span>
                )}
              </div>
              {translated && (
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="w-11 h-11 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:border-accent/40 hover:text-accent press-active transition-all duration-200 flex-shrink-0"
                  aria-label="Hear pronunciation"
                >
                  <Volume2 size={17} />
                </button>
              )}
            </div>
          </div>

          {/* Manual Spanish + pronunciation — fallback when translation hasn't returned */}
          {!translated && !translating && (
            <>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Spanish (manual)
                </label>
                <input
                  type="text"
                  value={spanish}
                  onChange={e => setSpanish(e.target.value)}
                  placeholder="e.g. La playa"
                  className="input-base"
                />
              </div>
              {spanish.trim() && (
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
              )}
            </>
          )}

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
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium press-active transition-all duration-150 text-left ${
                    category === cat.id
                      ? 'bg-accent/15 border border-accent/30 text-accent'
                      : 'bg-bg-elevated border border-border-subtle text-text-secondary hover:border-border-subtle/80'
                  }`}
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
            disabled={!english.trim() || !finalSpanish}
            className="w-full py-3.5 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          >
            Save Word
          </button>
        </form>
      </div>
    </div>
  )
}
