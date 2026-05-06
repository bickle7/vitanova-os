import { useState, useCallback } from 'react'
import { Plus, Trash2, Loader2, Zap, Flame, TrendingDown, TrendingUp, Dumbbell } from 'lucide-react'
import clsx from 'clsx'
import type { UserStats, FoodEntry, ActivityEntry, WeightEntry } from '../../../types/fitness'
import {
  calcBMR, addFoodEntry, deleteFoodEntry,
  getTodayFoodEntries, getTodayActivities, getWeightEntries,
  todayStr,
} from '../../../lib/fitnessStorage'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface Props {
  stats: UserStats
  onEditStats: () => void
}

function fmt(n: number) { return n.toLocaleString() }

export default function TodayTab({ stats, onEditStats }: Props) {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(() => getTodayFoodEntries())
  const [activities]                  = useState<ActivityEntry[]>(() => getTodayActivities())
  const [weightEntries]               = useState<WeightEntry[]>(() => getWeightEntries())
  const [input, setInput]             = useState('')
  const [estimating, setEstimating]   = useState(false)
  const [estimateError, setEstimateError] = useState('')

  const bmr             = calcBMR(stats)
  const activityCalories = activities.reduce((s, a) => s + a.caloriesBurned, 0)
  const totalBurned     = bmr + activityCalories
  const consumed        = foodEntries.reduce((s, f) => s + f.calories, 0)
  const net             = totalBurned - consumed  // positive = deficit (good)
  const isDeficit       = net >= 0
  const target          = stats.dailyCalorieTarget
  const consumedPct     = Math.min(100, Math.round((consumed / target) * 100))

  const latestWeight    = weightEntries[0]?.weight ?? stats.weight
  const weightToLose    = Math.max(0, latestWeight - stats.targetWeight)
  const totalToLose     = Math.max(0.1, stats.weight - stats.targetWeight)
  const weightProgress  = Math.min(100, Math.round(((stats.weight - latestWeight) / totalToLose) * 100))

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
      const updated = addFoodEntry({ description: input.trim(), calories: data.calories, date: todayStr() })
      setFoodEntries(updated.filter(e => e.date === todayStr()))
      setInput('')
    } catch {
      setEstimateError('Could not estimate — try again or add manually')
    } finally {
      setEstimating(false)
    }
  }, [input])

  const handleDelete = (id: string) => {
    const updated = deleteFoodEntry(id)
    setFoodEntries(updated.filter(e => e.date === todayStr()))
  }

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
      {/* Date header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Today</p>
          <p className="text-base font-bold text-text-primary">{today}</p>
        </div>
        <button
          onClick={onEditStats}
          className="text-xs text-text-muted hover:text-accent press-active transition-colors"
        >
          Edit stats
        </button>
      </div>

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

      {/* Weight progress */}
      {latestWeight !== stats.targetWeight && (
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

        {/* Quick add */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && input.trim()) handleEstimate() }}
            placeholder="e.g. scrambled eggs, coffee, toast..."
            className="input-base flex-1 text-sm"
          />
          <button
            onClick={handleEstimate}
            disabled={!input.trim() || estimating}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-accent text-bg-primary text-xs font-semibold press-active shadow-glow-accent disabled:opacity-40 transition-all"
          >
            {estimating ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            {estimating ? 'Estimating...' : 'AI Add'}
          </button>
        </div>

        {estimateError && (
          <p className="text-xs text-red-400 mb-2">{estimateError}</p>
        )}

        {foodEntries.length === 0 ? (
          <div className="text-center py-6 text-text-muted text-sm">
            No food logged yet — type above and tap AI Add
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

      {/* Today's activities */}
      {activities.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
            Today's Activity
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
                <span className="text-sm font-semibold text-orange-400 flex-shrink-0">
                  -{fmt(a.caloriesBurned)} kcal
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
