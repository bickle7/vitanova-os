import { useState } from 'react'
import { ArrowLeft, X, Upload, Check } from 'lucide-react'
import clsx from 'clsx'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface Props {
  onClose: () => void
  onImport: (titles: string[]) => void
}

type Step = 'paste' | 'preview'

export default function MovieImportModal({ onClose, onImport }: Props) {
  const [step, setStep]           = useState<Step>('paste')
  const [rawText, setRawText]     = useState('')
  const [parsing, setParsing]     = useState(false)
  const [parseError, setParseError] = useState('')
  const [titles, setTitles]       = useState<string[]>([])
  const [selected, setSelected]   = useState<Set<number>>(new Set())

  const handleParse = async () => {
    if (!rawText.trim()) return
    setParsing(true)
    setParseError('')
    try {
      const res = await fetch(`${API_URL}/api/parse-titles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Parse failed')
      const cleaned: string[] = data.titles ?? []
      setTitles(cleaned)
      setSelected(new Set(cleaned.map((_, i) => i)))
      setStep('preview')
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setParsing(false)
    }
  }

  const toggleTitle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const toggleAll = () => {
    setSelected(prev =>
      prev.size === titles.length ? new Set() : new Set(titles.map((_, i) => i))
    )
  }

  const handleImport = () => {
    const toImport = titles.filter((_, i) => selected.has(i))
    if (toImport.length === 0) return
    onImport(toImport)
    onClose()
  }

  const selectedCount = selected.size

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg-primary"
      style={{ animation: 'slideUp 0.25s ease-out' }}
    >
      {/* Header */}
      <header className="glass border-b border-border-subtle flex-shrink-0">
        <div className="px-4 pt-safe">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={step === 'preview' ? () => setStep('paste') : onClose}
              className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary press-active transition-colors"
            >
              {step === 'preview' ? <ArrowLeft size={20} /> : <X size={20} />}
            </button>
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">Import List</p>
              {step === 'preview' && (
                <p className="text-[10px] text-text-muted mt-0.5">{titles.length} titles found</p>
              )}
            </div>
            {step === 'preview' ? (
              <button
                onClick={toggleAll}
                className="text-xs font-semibold text-accent press-active"
              >
                {selected.size === titles.length ? 'None' : 'All'}
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
        </div>
      </header>

      {/* Paste step */}
      {step === 'paste' && (
        <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Paste your list
            </p>
            <p className="text-xs text-text-muted mb-3">
              Paste anything — messy notes, links, strikethroughs. Claude will extract just the titles.
            </p>
            <textarea
              autoFocus
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={"The Godfather\nBreaking Bad - incredible\n~~Kraven the Hunter~~\nhttps://letterboxd.com/...\nOld Henry - cowboy film\nSicario?\nThe Bear"}
              rows={14}
              className="input-base resize-none text-sm font-mono leading-relaxed"
            />
          </div>

          {parseError && (
            <p className="text-xs text-red-400 text-center">{parseError}</p>
          )}

          <button
            onClick={handleParse}
            disabled={!rawText.trim() || parsing}
            className="w-full py-3.5 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            {parsing ? (
              <>
                <span className="w-4 h-4 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin" />
                Cleaning list...
              </>
            ) : (
              <>
                <Upload size={15} />
                Parse List
              </>
            )}
          </button>
        </div>
      )}

      {/* Preview step */}
      {step === 'preview' && (
        <>
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-28">
            {titles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-text-primary font-semibold">No titles found</p>
                <p className="text-text-muted text-sm mt-1">Try adjusting your pasted text</p>
              </div>
            ) : (
              <div className="space-y-2">
                {titles.map((title, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTitle(i)}
                    className={clsx(
                      'card w-full px-4 py-3 flex items-center gap-3 text-left press-active transition-all',
                      !selected.has(i) && 'opacity-40'
                    )}
                  >
                    <div className={clsx(
                      'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all',
                      selected.has(i)
                        ? 'bg-accent border-accent'
                        : 'border-border-subtle bg-bg-elevated'
                    )}>
                      {selected.has(i) && <Check size={12} className="text-bg-primary" strokeWidth={3} />}
                    </div>
                    <p className="text-sm font-medium text-text-primary flex-1">{title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Import button */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-safe pt-3 glass-bottom border-t border-border-subtle">
            <button
              onClick={handleImport}
              disabled={selectedCount === 0}
              className="w-full py-3.5 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all"
            >
              {selectedCount === 0
                ? 'Select titles to import'
                : `Import ${selectedCount} title${selectedCount === 1 ? '' : 's'} to Watchlist`}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
