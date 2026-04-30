import { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, Loader2, Plus, X, Sparkles, Film, Tv } from 'lucide-react'
import clsx from 'clsx'
import type { MediaItem, Recommendation } from '../../../types/library'
import { getRecommendations, saveRecommendations, dismissRecommendation } from '../../../lib/libraryStorage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface Props {
  mediaItems: MediaItem[]
  onClose: () => void
  onAddToLibrary: (title: string, type: 'movie' | 'tv') => void
}

export default function RecommendedPage({ mediaItems, onClose, onAddToLibrary }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() =>
    getRecommendations().filter(r => !r.dismissed)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-load if no cached recommendations
  useEffect(() => {
    if (recommendations.length === 0) {
      fetchRecommendations()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRecommendations = async () => {
    const watched   = mediaItems.filter(m => m.status === 'watched').map(m => m.title)
    const favourites = mediaItems.filter(m => m.status === 'favourite').map(m => m.title)

    if (watched.length === 0 && favourites.length === 0) {
      setError('Add some watched or favourite titles first to get recommendations.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched, favourites }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      const recs: Recommendation[] = (data.recommendations ?? []).map((r: Omit<Recommendation, 'id' | 'dismissed'>, i: number) => ({
        ...r,
        id: `rec_${Date.now()}_${i}`,
        dismissed: false,
      }))
      saveRecommendations(recs)
      setRecommendations(recs)
    } catch {
      setError('Failed to load recommendations. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = (id: string) => {
    dismissRecommendation(id)
    setRecommendations(prev => prev.filter(r => r.id !== id))
  }

  const handleAdd = (rec: Recommendation) => {
    onAddToLibrary(rec.title, rec.type as 'movie' | 'tv')
    handleDismiss(rec.id)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-bg-primary flex flex-col"
      style={{ animation: 'slideUp 0.3s cubic-bezier(0.32,0.72,0,1)' }}
    >
      {/* Header */}
      <div className="px-4 pt-safe flex-shrink-0">
        <div className="flex items-center justify-between h-14">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary press-active transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-accent" />
            <span className="text-sm font-bold text-text-primary">Recommended</span>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-accent press-active transition-colors disabled:opacity-40"
            aria-label="Refresh recommendations"
          >
            <RefreshCw size={16} className={clsx(loading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-safe">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="text-accent animate-spin" />
            <p className="text-text-secondary text-sm">Finding recommendations for you...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Sparkles size={32} className="text-accent/30 mb-4" />
            <p className="text-text-secondary text-sm">{error}</p>
            {mediaItems.filter(m => m.status === 'watched' || m.status === 'favourite').length > 0 && (
              <button
                onClick={fetchRecommendations}
                className="mt-4 px-4 py-2.5 rounded-xl bg-accent text-bg-primary text-sm font-semibold press-active"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Sparkles size={32} className="text-accent/30 mb-4" />
            <p className="text-text-secondary font-medium">All caught up</p>
            <p className="text-text-muted text-sm mt-1">Tap refresh for new recommendations</p>
            <button
              onClick={fetchRecommendations}
              className="mt-4 px-4 py-2.5 rounded-xl bg-accent text-bg-primary text-sm font-semibold press-active"
            >
              Refresh
            </button>
          </div>
        )}

        {!loading && recommendations.length > 0 && (
          <div className="pt-2 pb-8 space-y-3">
            <p className="text-xs text-text-muted pb-1">
              {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} based on your library
            </p>
            {recommendations.map(rec => (
              <div
                key={rec.id}
                className="card px-4 py-4 flex items-start gap-3"
              >
                {/* Type icon */}
                <div className={clsx(
                  'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                  rec.type === 'tv' ? 'bg-blue-500/15' : 'bg-purple-500/15'
                )}>
                  {rec.type === 'tv'
                    ? <Tv size={16} className="text-blue-400" />
                    : <Film size={16} className="text-purple-400" />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold text-text-primary">{rec.title}</span>
                    {rec.year && <span className="text-xs text-text-muted">{rec.year}</span>}
                  </div>
                  {rec.genre && (
                    <span className={clsx(
                      'inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5',
                      rec.type === 'tv' ? 'bg-blue-500/15 text-blue-400' : 'bg-purple-500/15 text-purple-400'
                    )}>
                      {rec.genre}
                    </span>
                  )}
                  <p className="text-xs text-accent mt-1.5 italic leading-snug">{rec.reason}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleAdd(rec)}
                    className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-bg-primary press-active transition-all"
                    aria-label="Add to library"
                  >
                    <Plus size={15} />
                  </button>
                  <button
                    onClick={() => handleDismiss(rec.id)}
                    className="w-8 h-8 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-secondary press-active transition-colors"
                    aria-label="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
