import { useState, useCallback } from 'react'
import { Scale, Flame, TrendingDown, Zap, Sparkles, Loader2, Smartphone } from 'lucide-react'
import clsx from 'clsx'
import type { UserStats, WeightEntry } from '../../../types/fitness'
import {
  getWeightEntries, getWeeklyCalories, getDeficitStreak, calcBMR,
  getCurrentWeekDays, getFoodEntriesForDate,
} from '../../../lib/fitnessStorage'
import WeightLogModal from './WeightLogModal'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface Props {
  stats: UserStats
  onEditStats: () => void
}

function fmt(n: number) { return n.toLocaleString() }

// Simple SVG line chart for weight history
function WeightChart({ entries, target }: { entries: WeightEntry[]; target: number }) {
  if (entries.length < 2) return null

  const sorted  = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-30)
  const weights  = sorted.map(e => e.weight)
  const allVals  = [...weights, target]
  const minW     = Math.min(...allVals) - 1
  const maxW     = Math.max(...allVals) + 1
  const W = 300, H = 100

  const x = (i: number) => (i / (sorted.length - 1)) * W
  const y = (w: number) => H - ((w - minW) / (maxW - minW)) * H

  const path = sorted.map((e, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(e.weight).toFixed(1)}`).join(' ')
  const targetY = y(target).toFixed(1)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-24" preserveAspectRatio="none">
      {/* Target line */}
      <line x1="0" y1={targetY} x2={W} y2={targetY} stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
      {/* Weight line */}
      <path d={path} fill="none" stroke="rgb(var(--color-accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {sorted.map((e, i) => (
        <circle key={e.id} cx={x(i).toFixed(1)} cy={y(e.weight).toFixed(1)} r="3" fill="rgb(var(--color-accent))" />
      ))}
    </svg>
  )
}

export default function ProgressTab({ stats, onEditStats }: Props) {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => getWeightEntries())
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [summary, setSummary]                 = useState('')
  const [loadingSummary, setLoadingSummary]   = useState(false)

  const weekly      = getWeeklyCalories()
  const streak      = getDeficitStreak()
  const bmr         = calcBMR(stats)
  const weekDays    = getCurrentWeekDays()
  const today       = new Date().toISOString().slice(0, 10)
  const latestW   = weightEntries[0]?.weight ?? stats.weight
  const weightToLose = Math.max(0, latestW - stats.targetWeight)
  const totalToLose  = Math.max(0.1, stats.weight - stats.targetWeight)
  const progress     = Math.min(100, Math.round(((stats.weight - latestW) / totalToLose) * 100))

  // Oldest and newest for change calc
  const last30 = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date)).slice(-30)
  const weightChange = last30.length >= 2
    ? +(last30[last30.length - 1].weight - last30[0].weight).toFixed(1)
    : undefined

  const handleAISummary = useCallback(async () => {
    setLoadingSummary(true)
    setSummary('')
    try {
      const res = await fetch(`${API_URL}/api/fitness-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consumed: weekly.consumed,
          burned: weekly.burned,
          deficitDays: weekly.deficitDays,
          streak,
          weightChange,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setSummary(data.summary)
    } catch {
      setSummary('Could not generate summary — try again later.')
    } finally {
      setLoadingSummary(false)
    }
  }, [weekly, streak, weightChange])

  // Age benchmarking
  const ageBand = stats.age < 30 ? '20s' : stats.age < 40 ? '30s' : stats.age < 50 ? '40s' : '50s+'
  const benchmarkBMR: Record<string, number> = { '20s': 1900, '30s': 1800, '40s': 1750, '50s+': 1650 }
  const bmrVsBench = bmr - (benchmarkBMR[ageBand] ?? 1800)

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
      {/* Weight progress */}
      <div className="card px-4 py-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-secondary">Weight Progress</p>
          <button
            onClick={() => setShowWeightModal(true)}
            className="text-xs text-accent font-semibold press-active flex items-center gap-1"
          >
            <Scale size={11} /> Log
          </button>
        </div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-text-primary">{latestW} kg</p>
            <p className="text-xs text-text-muted">Current</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-text-secondary">{stats.targetWeight} kg</p>
            <p className="text-xs text-text-muted">Target</p>
          </div>
        </div>
        <WeightChart entries={weightEntries} target={stats.targetWeight} />
        <div className="mt-3">
          <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, progress)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-text-muted">
            <span>{progress}% to goal</span>
            <span>{weightToLose > 0 ? `${weightToLose.toFixed(1)} kg to go` : 'Goal reached!'}</span>
          </div>
        </div>
        {weightChange !== undefined && (
          <div className="mt-3 pt-3 border-t border-border-subtle">
            <p className="text-xs text-text-muted">
              30-day change:&nbsp;
              <span className={clsx('font-semibold', weightChange <= 0 ? 'text-green-400' : 'text-red-400')}>
                {weightChange > 0 ? '+' : ''}{weightChange} kg
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Week view */}
      <div className="card px-4 py-3 mb-3">
        <p className="text-xs font-semibold text-text-secondary mb-3">This Week</p>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => {
            const dayConsumed = getFoodEntriesForDate(day).reduce((s, e) => s + e.calories, 0)
            const isToday     = day === today
            const isFuture    = day > today
            const hasData     = dayConsumed > 0
            const overTarget  = hasData && dayConsumed > stats.dailyCalorieTarget
            const pct         = hasData ? Math.min(100, Math.round((dayConsumed / stats.dailyCalorieTarget) * 100)) : 0
            const dayLabel    = new Date(day + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short' }).slice(0, 1)
            return (
              <div key={day} className="flex flex-col items-center gap-1">
                <p className={clsx('text-[9px] font-semibold uppercase', isToday ? 'text-accent' : 'text-text-muted')}>{dayLabel}</p>
                <div className="w-full h-12 bg-bg-elevated rounded-lg overflow-hidden flex flex-col justify-end relative">
                  {!isFuture && hasData && (
                    <div
                      className={clsx('w-full rounded-lg transition-all duration-500', overTarget ? 'bg-red-400' : 'bg-green-400')}
                      style={{ height: `${Math.max(8, pct)}%` }}
                    />
                  )}
                  {isToday && (
                    <div className="absolute inset-0 border border-accent/40 rounded-lg pointer-events-none" />
                  )}
                </div>
                <p className={clsx('text-[9px] font-semibold', hasData && !isFuture ? (overTarget ? 'text-red-400' : 'text-green-400') : 'text-text-muted')}>
                  {hasData && !isFuture ? `${Math.round(dayConsumed / 100) * 100}` : '—'}
                </p>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Under target</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Over target</span>
        </div>
      </div>

      {/* Weekly calorie stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="card px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap size={10} className="text-accent" />
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Eaten</p>
          </div>
          <p className="text-base font-bold text-text-primary">{fmt(weekly.consumed)}</p>
          <p className="text-[10px] text-text-muted">this week</p>
        </div>
        <div className="card px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame size={10} className="text-orange-400" />
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Burned</p>
          </div>
          <p className="text-base font-bold text-text-primary">{fmt(weekly.burned)}</p>
          <p className="text-[10px] text-text-muted">this week</p>
        </div>
        <div className="card px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingDown size={10} className="text-green-400" />
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Deficit</p>
          </div>
          <p className="text-base font-bold text-text-primary">{weekly.deficitDays}/7</p>
          <p className="text-[10px] text-text-muted">days</p>
        </div>
      </div>

      {/* Streak */}
      <div className="card px-4 py-3 mb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-400/10 flex items-center justify-center flex-shrink-0">
          <Flame size={16} className="text-orange-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">Deficit Streak</p>
          <p className="text-xs text-text-muted">Consecutive days in calorie deficit</p>
        </div>
        <p className="text-xl font-bold text-orange-400">{streak}</p>
      </div>

      {/* BMR / age benchmarking */}
      <div className="card px-4 py-3 mb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-secondary">Your Metabolism</p>
          <button onClick={onEditStats} className="text-xs text-text-muted hover:text-accent press-active transition-colors">
            Edit stats
          </button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-text-primary">BMR</p>
          <p className="text-sm font-bold text-accent">{fmt(bmr)} kcal/day</p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-text-primary">Average for {ageBand}</p>
          <p className="text-sm font-semibold text-text-secondary">{fmt(benchmarkBMR[ageBand])} kcal/day</p>
        </div>
        <div className="pt-2 border-t border-border-subtle">
          <p className="text-xs text-text-muted">
            Your BMR is&nbsp;
            <span className={clsx('font-semibold', bmrVsBench >= 0 ? 'text-green-400' : 'text-red-400')}>
              {bmrVsBench >= 0 ? '+' : ''}{bmrVsBench} kcal
            </span>
            &nbsp;vs the average for your age group
          </p>
        </div>
      </div>

      {/* Apple Health placeholder */}
      <div className="card px-4 py-3 mb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0">
          <Smartphone size={16} className="text-text-muted" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">Apple Health Metrics</p>
          <p className="text-xs text-text-muted">Steps, HRV, sleep sync coming soon</p>
        </div>
        <span className="text-[10px] font-semibold text-text-muted border border-border-subtle rounded-full px-2 py-0.5">
          Soon
        </span>
      </div>

      {/* AI weekly summary */}
      <div className="card px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-secondary">AI Weekly Summary</p>
          <button
            onClick={handleAISummary}
            disabled={loadingSummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent text-bg-primary text-xs font-semibold press-active shadow-glow-accent disabled:opacity-40 transition-all"
          >
            {loadingSummary ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
            {loadingSummary ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {summary ? (
          <p className="text-sm text-text-primary leading-relaxed">{summary}</p>
        ) : (
          <p className="text-sm text-text-muted">
            Tap Generate for a personalised summary of your week.
          </p>
        )}
      </div>

      {showWeightModal && (
        <WeightLogModal
          currentWeight={latestW}
          onClose={() => setShowWeightModal(false)}
          onSave={setWeightEntries}
        />
      )}
    </div>
  )
}
