import { useState } from 'react'
import { ChevronRight, Target, Flame } from 'lucide-react'
import clsx from 'clsx'
import type { ActivityLevel, FitnessGoal, UserStats } from '../../../types/fitness'
import { calcCalorieTarget, saveUserStats } from '../../../lib/fitnessStorage'

interface Props {
  onComplete: (stats: UserStats) => void
  existingStats?: UserStats | null
}

const ACTIVITY_OPTIONS: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: 'sedentary', label: 'Sedentary',  desc: 'Desk job, little exercise' },
  { id: 'light',     label: 'Light',      desc: '1–3 light workouts/week' },
  { id: 'moderate',  label: 'Moderate',   desc: '3–5 workouts/week' },
  { id: 'active',    label: 'Active',     desc: '6–7 intense workouts/week' },
]

const GOAL_OPTIONS: { id: FitnessGoal; label: string; emoji: string }[] = [
  { id: 'lose_weight', label: 'Lose Weight',  emoji: '⚖️' },
  { id: 'get_fitter',  label: 'Get Fitter',   emoji: '💪' },
  { id: 'both',        label: 'Both',         emoji: '🏆' },
]

export default function OnboardingModal({ onComplete, existingStats }: Props) {
  const [age, setAge]               = useState(existingStats ? String(existingStats.age) : '')
  const [weight, setWeight]         = useState(existingStats ? String(existingStats.weight) : '')
  const [height, setHeight]         = useState(existingStats ? String(existingStats.height) : '')
  const [sex, setSex]               = useState<'male' | 'female'>(existingStats?.sex ?? 'male')
  const [activityLevel, setActivity] = useState<ActivityLevel>(existingStats?.activityLevel ?? 'moderate')
  const [targetWeight, setTarget]   = useState(existingStats ? String(existingStats.targetWeight) : '')
  const [goal, setGoal]             = useState<FitnessGoal>(existingStats?.goal ?? 'lose_weight')

  const canSubmit = age && weight && height && targetWeight &&
    Number(age) > 0 && Number(weight) > 0 && Number(height) > 0 && Number(targetWeight) > 0

  const handleSave = () => {
    if (!canSubmit) return
    const partial = {
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      sex,
      activityLevel,
      targetWeight: Number(targetWeight),
      goal,
    }
    const dailyCalorieTarget = calcCalorieTarget(partial)
    const stats: UserStats = { ...partial, dailyCalorieTarget, updatedAt: new Date().toISOString() }
    saveUserStats(stats)
    onComplete(stats)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg-primary"
      style={{ animation: 'slideUp 0.25s ease-out' }}
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-10 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-4 shadow-glow-accent">
            <Flame size={22} className="text-bg-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            {existingStats ? 'Update Stats' : 'Set up Fitness'}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {existingStats
              ? 'Your previous stats are kept in history'
              : 'Your stats help calculate your calorie target and BMR'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Sex */}
          <div>
            <label className="label-sm">Sex</label>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className={clsx(
                    'flex-1 py-3 rounded-xl text-sm font-semibold border transition-all press-active capitalize',
                    sex === s
                      ? 'bg-accent/15 border-accent/40 text-accent'
                      : 'bg-bg-elevated border-border-subtle text-text-secondary'
                  )}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Age / Weight / Height */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label-sm">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)}
                placeholder="30" className="input-base text-center" min="10" max="100" />
            </div>
            <div>
              <label className="label-sm">Weight (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                placeholder="80" className="input-base text-center" min="30" max="300" />
            </div>
            <div>
              <label className="label-sm">Height (cm)</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)}
                placeholder="178" className="input-base text-center" min="100" max="250" />
            </div>
          </div>

          {/* Target weight */}
          <div>
            <label className="label-sm">Target Weight (kg)</label>
            <input type="number" value={targetWeight} onChange={e => setTarget(e.target.value)}
              placeholder="75" className="input-base" min="30" max="300" />
          </div>

          {/* Activity level */}
          <div>
            <label className="label-sm">Activity Level</label>
            <div className="space-y-2">
              {ACTIVITY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setActivity(opt.id)}
                  className={clsx(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all press-active',
                    activityLevel === opt.id
                      ? 'bg-accent/15 border-accent/40'
                      : 'bg-bg-elevated border-border-subtle'
                  )}
                >
                  <div>
                    <p className={clsx('text-sm font-semibold', activityLevel === opt.id ? 'text-accent' : 'text-text-primary')}>{opt.label}</p>
                    <p className="text-xs text-text-muted">{opt.desc}</p>
                  </div>
                  {activityLevel === opt.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="label-sm">Goal</label>
            <div className="flex gap-2">
              {GOAL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={clsx(
                    'flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all press-active',
                    goal === opt.id
                      ? 'bg-accent/15 border-accent/40 text-accent'
                      : 'bg-bg-elevated border-border-subtle text-text-secondary'
                  )}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview calorie target */}
          {canSubmit && (
            <div className="rounded-2xl bg-accent/5 border border-accent/20 px-4 py-4 flex items-center gap-3">
              <Target size={20} className="text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Daily calorie target: <span className="text-accent">{calcCalorieTarget({
                    age: Number(age), weight: Number(weight), height: Number(height),
                    sex, activityLevel, targetWeight: Number(targetWeight), goal,
                  }).toLocaleString()} kcal</span>
                </p>
                <p className="text-xs text-text-muted mt-0.5">Based on your stats and goal</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-safe pt-4 border-t border-border-subtle">
        <button
          onClick={handleSave}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all"
        >
          {existingStats ? 'Update Stats' : 'Get Started'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
