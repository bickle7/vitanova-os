import { useState, useCallback, useMemo, useRef } from 'react'
import { Plus, Trash2, Loader2, Zap, Flame, TrendingDown, TrendingUp, Dumbbell, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import clsx from 'clsx'
import type { UserStats, FoodEntry, ActivityEntry, WeightEntry } from '../../../types/fitness'
import {
  calcBMR, addFoodEntry, deleteFoodEntry,
  getFoodEntriesForDate, getActivitiesForDate, getWeightEntries, getFoodEntries,
  todayStr,
} from '../../../lib/fitnessStorage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface Props {
  stats: UserStats
  onEditStats: () => void
}

function fmt(n: number) { return n.toLocaleString() }

function offsetDate(base: string, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatDateLabel(dateStr: string): string {
  const today = todayStr()
  const yesterday = offsetDate(today, -1)
  if (dateStr === today) return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  if (dateStr === yesterday) return 'Yesterday'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Build quick-add suggestions: recent unique foods, sorted by frequency then recency
function buildSuggestions(allEntries: FoodEntry[], currentEntries: FoodEntry[]): { description: string; calories: number }[] {
  const currentDescs = new Set(currentEntries.map(e => e.description.toLowerCase()))
  const freq: Record<string, { description: string; calories: number; count: number; lastDate: string }> = {}
  for (const e of allEntries) {
    const key = e.description.toLowerCase()
    if (currentDescs.has(key)) continue
    if (!freq[key]) freq[key] = { description: e.description, calories: e.calories, count: 0, lastDate: e.date }
    freq[key].count++
    if (e.date > freq[key].lastDate) {
      freq[key].lastDate = e.date
      freq[key].calories = e.calories // use most recent calorie value
    }
  }
  return Object.values(freq)
    .sort((a, b) => b.count - a.count || b.lastDate.localeCompare(a.lastDate))
    .slice(0, 12)
}

export default function TodayTab({ stats, onEditStats }: Props) {
  const today = todayStr()
  const [selectedDate, setSelectedDate] = useState(today)
  const [foodEntries, setFoodEntries]   = useState<FoodEntry[]>(() => getFoodEntriesForDate(selectedDate))
  const [activities]                    = useState<ActivityEntry[]>(() => getActivitiesForDate(selectedDate))
  const [weightEntries]                 = useState<WeightEntry[]>(() => getWeightEntries())
  const [input, setInput]               = useState('')
  const [estimating, setEstimating]     = useState(false)
  const [estimateError, setEstimateError] = useState('')
  const [searchMode, setSearchMode]     = useState(false)
  const [searching, setSearching]       = useState(false)
  const [searchResults, setSearchResults] = useState<{ name: string; brand: string; servingSize: string; calories: number }[]>([])
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isPast   = selectedDate < today
  const isToday  = selectedDate === today

  // Quick-add suggestions from all-time food history
  const allFoodEntries = useMemo(() => getFoodEntries(), [foodEntries])
  const suggestions    = useMemo(() => buildSuggestions(allFoodEntries, foodEntries), [allFoodEntries, foodEntries])

  const navigateDate = (dir: -1 | 1) => {
    const newDate = offsetDate(selectedDate, dir)
    if (newDate > today) return // can't go to future
    setSelectedDate(newDate)
    setFoodEntries(getFoodEntriesForDate(newDate))
  }

  const bmr              = calcBMR(stats)
  const activityCalories = activities.reduce((s, a) => s + a.caloriesBurned, 0)
  const totalBurned      = bmr + activityCalories
  const consumed         = foodEntries.reduce((s, f) => s + f.calories, 0)
  const net              = totalBurned - consumed
  const isDeficit        = net >= 0
  const target           = stats.dailyCalorieTarget
  const consumedPct      = Math.min(100, Math.round((consumed / target) * 100))

  const latestWeight   = weightEntries[0]?.weight ?? stats.weight
  const weightToLose   = Math.max(0, latestWeight - stats.targetWeight)
  const totalToLose    = Math.max(0.1, stats.weight - stats.targetWeight)
  const weightProgress = Math.min(100, Math.round(((stats.weight - latestWeight) / totalToLose) * 100))

  const addEntry = useCallback((description: string, calories: number) => {
    const updated = addFoodEntry({ description, calories, date: selectedDate })
    setFoodEntries(updated.filter(e => e.date === selectedDate))
  }, [selectedDate])

  const handleSearchInput = useCallback((val: string) => {
    setInput(val)
    if (!searchMode) return
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (!val.trim()) { setSearchResults([]); return }
    searchTimer.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`${API_URL}/api/food-search?q=${encodeURIComponent(val.trim())}`)
        const data = await res.json()
        setSearchResults(data.results ?? [])
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 500)
  }, [searchMode])

  const handleSearchSelect = useCallback((item: { name: string; brand: string; servingSize: string; calories: number }) => {
    const desc = item.brand ? `${item.name} (${item.brand})` : item.name
    addEntry(desc, item.calories)
    setInput('')
    setSearchResults([])
  }, [addEntry])

  const handleEstimate = useCallback(async () => {
    if (!input.trim()) return
    setEstimating(true)
    setEstimateError('')
    try {
      const res = await fetch(`${API_URL}/api/estimate-calories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      addEntry(input.trim(), data.calories)
      setInput('')
    } catch {
      setEstimateError('Could not estimate — try again')
    } finally {
      setEstimating(false)
    }
  }, [input, addEntry])

  const handleDelete = (id: string) => {
    const updated = deleteFoodEntry(id)
    setFoodEntries(updated.filter(e => e.date === selectedDate))
  }

  const dateLabel = formatDateLabel(selectedDate)

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
      {/* Date header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate(-1)}
            className="w-7 h-7 rounded-full bg-bg-elevated flex items-center justify-center press-active text-text-muted hover:text-accent transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
              {isToday ? 'Today' : isPast ? 'Past Day' : 'Date'}
            </p>
            <p className="text-base font-bold text-text-primary">{dateLabel}</p>
          </div>
          <button
            onClick={() => navigateDate(1)}
            disabled={isToday}
            className="w-7 h-7 rounded-full bg-bg-elevated flex items-center justify-center press-active text-text-muted hover:text-accent disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
        <button
          onClick={onEditStats}
          className="text-xs text-text-muted hover:text-accent press-active transition-colors"
        >
          Edit stats
        </button>
      </div>

      {/* Past day banner */}
      {isPast && (
        <div className="card px-3 py-2 mb-3 flex items-center gap-2 border-amber-500/20">
          <span className="text-amber-400 text-xs">📅</span>
          <p className="text-xs text-amber-400 font-medium">Viewing a past day — changes will be saved to this date</p>
        </div>
      )}

      {/* Calorie summary cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="card px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap size={11} className="text-accent" />
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Eaten</p>
          </div>
          <p className="text-lg font-bold text-text-primary">{fmt(consumed)}</p>
          <p className="text-[10px] text-text-muted">kcal</p>
        </div>
        <div className="card px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame size={11} className="text-orange-400" />
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Burned</p>
          </div>
          <p className="text-lg font-bold text-text-primary">{fmt(totalBurned)}</p>
          <p className="text-[10px] text-text-muted">kcal</p>
        </div>
        <div className={clsx('card px-3 py-3 text-center', isDeficit ? 'border-green-500/20' : 'border-red-500/20')}>
          <div className="flex items-center justify-center gap-1 mb-1">
            {isDeficit
              ? <TrendingDown size={11} className="text-green-400" />
              : <TrendingUp size={11} className="text-red-400" />}
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Net</p>
          </div>
          <p className={clsx('text-lg font-bold', isDeficit ? 'text-green-400' : 'text-red-400')}>
            {isDeficit ? '-' : '+'}{fmt(Math.abs(net))}
          </p>
          <p className={clsx('text-[10px] font-semibold', isDeficit ? 'text-green-400/70' : 'text-red-400/70')}>
            {isDeficit ? 'deficit' : 'surplus'}
          </p>
        </div>
      </div>

      {/* BMR breakdown + calorie target progress */}
      <div className="card px-4 py-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-text-secondary">
            {fmt(consumed)} / {fmt(target)} kcal target
          </p>
          <p className="text-xs text-text-muted">{consumedPct}%</p>
        </div>
        <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-500', consumedPct >= 100 ? 'bg-red-400' : 'bg-accent')}
            style={{ width: `${consumedPct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-text-muted">
          <span>BMR: {fmt(bmr)} kcal</span>
          {activityCalories > 0 && <span>Activity: +{fmt(activityCalories)} kcal</span>}
        </div>
      </div>

      {/* Weight progress — only show on today's view */}
      {isToday && latestWeight !== stats.targetWeight && (
        <div className="card px-4 py-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-text-secondary">Weight Progress</p>
            <p className="text-xs text-text-muted">{latestWeight} kg → {stats.targetWeight} kg</p>
          </div>
          <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, weightProgress)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-text-muted">
            <span>{weightProgress}% to goal</span>
            <span>{weightToLose > 0 ? `${weightToLose.toFixed(1)} kg to go` : 'Goal reached!'}</span>
          </div>
        </div>
      )}

      {/* Food log */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Food Log</p>

        {/* Quick-add suggestions */}
        {suggestions.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => addEntry(s.description, s.calories)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-elevated border border-border-subtle text-xs text-text-secondary press-active hover:border-accent/30 hover:text-accent transition-all"
              >
                <span className="truncate max-w-[120px]">{s.description}</span>
                <span className="text-text-muted font-semibold">{fmt(s.calories)}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex gap-1 mb-2 p-1 bg-bg-elevated rounded-xl border border-border-subtle">
          <button
            onClick={() => { setSearchMode(false); setSearchResults([]); setInput('') }}
            className={clsx('flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all press-active', !searchMode ? 'bg-accent text-bg-primary shadow-glow-accent' : 'text-text-muted')}
          >
            <Plus size={11} /> AI Estimate
          </button>
          <button
            onClick={() => { setSearchMode(true); setEstimateError(''); setInput('') }}
            className={clsx('flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all press-active', searchMode ? 'bg-accent text-bg-primary shadow-glow-accent' : 'text-text-muted')}
          >
            <Search size={11} /> Search DB
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-1">
          <input
            type="text"
            value={input}
            onChange={e => handleSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && input.trim() && !searchMode) handleEstimate() }}
            placeholder={searchMode ? 'Search food database...' : 'e.g. scrambled eggs, coffee, toast...'}
            className="input-base flex-1 text-sm"
          />
          {!searchMode && (
            <button
              onClick={handleEstimate}
              disabled={!input.trim() || estimating}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-bg-primary text-xs font-semibold press-active shadow-glow-accent disabled:opacity-40 transition-all"
            >
              {estimating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              {estimating ? 'Estimating...' : 'AI Add'}
            </button>
          )}
          {searchMode && searching && (
            <div className="flex items-center pr-1">
              <Loader2 size={16} className="animate-spin text-text-muted" />
            </div>
          )}
        </div>

        {/* Search results */}
        {searchMode && searchResults.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSearchSelect(r)}
                className="w-full card px-3 py-2.5 flex items-center gap-3 text-left press-active hover:border-accent/30 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{r.name}</p>
                  <p className="text-[10px] text-text-muted">{r.brand}{r.brand && r.servingSize ? ' · ' : ''}{r.servingSize}</p>
                </div>
                <span className="text-sm font-bold text-accent flex-shrink-0">{fmt(r.calories)}<span className="text-[10px] font-normal text-text-muted ml-0.5">kcal</span></span>
              </button>
            ))}
          </div>
        )}

        {searchMode && input.trim() && !searching && searchResults.length === 0 && (
          <p className="text-xs text-text-muted mb-3">No results — try AI Estimate instead</p>
        )}

        {estimateError && (
          <p className="text-xs text-red-400 mb-2">{estimateError}</p>
        )}

        {foodEntries.length === 0 ? (
          <div className="text-center py-6 text-text-muted text-sm">
            No food logged {isToday ? 'yet' : 'for this day'} — type above and tap AI Add
          </div>
        ) : (
          <div className="space-y-2">
            {foodEntries.map(entry => (
              <div key={entry.id} className="card px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{entry.description}</p>
                </div>
                <span className="text-sm font-semibold text-accent flex-shrink-0">{fmt(entry.calories)}</span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <p className="text-xs font-semibold text-text-muted">
                Total: <span className="text-accent">{fmt(consumed)} kcal</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Activities */}
      {activities.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
            {isToday ? "Today's Activity" : "Activity"}
          </p>
          <div className="space-y-2">
            {activities.map(a => (
              <div key={a.id} className="card px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={14} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{a.name}</p>
                  <p className="text-xs text-text-muted">{a.durationMinutes} min</p>
                </div>
                {a.caloriesBurned > 0 && (
                  <span className="text-sm font-semibold text-orange-400 flex-shrink-0">
                    -{fmt(a.caloriesBurned)} kcal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
