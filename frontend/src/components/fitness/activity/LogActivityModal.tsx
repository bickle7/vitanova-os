import { useState } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import type { ActivityType, ActivityEntry, WorkoutTemplate } from '../../../types/fitness'
import { addActivityEntry, todayStr } from '../../../lib/fitnessStorage'

interface Props {
  templates: WorkoutTemplate[]
  onClose: () => void
  onLog: (entries: ActivityEntry[]) => void
}

const ACTIVITY_TYPES: { id: ActivityType; label: string; emoji: string }[] = [
  { id: 'workout',  label: 'Workout',  emoji: '🏋️' },
  { id: 'run',      label: 'Run',      emoji: '🏃' },
  { id: 'walk',     label: 'Walk',     emoji: '🚶' },
  { id: 'cycle',    label: 'Cycle',    emoji: '🚴' },
  { id: 'swim',     label: 'Swim',     emoji: '🏊' },
  { id: 'other',    label: 'Other',    emoji: '⚡' },
]

export default function LogActivityModal({ templates, onClose, onLog }: Props) {
  const [type, setType]         = useState<ActivityType>('workout')
  const [name, setName]         = useState('')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [templateId, setTemplateId] = useState<string | undefined>()

  const handleTemplateSelect = (t: WorkoutTemplate) => {
    setTemplateId(t.id)
    setName(t.name)
    if (t.estimatedCalories) setCalories(String(t.estimatedCalories))
  }

  const canLog = name.trim() && duration && Number(duration) > 0

  const handleLog = () => {
    if (!canLog) return
    const updated = addActivityEntry({
      type,
      name: name.trim(),
      durationMinutes: Number(duration),
      caloriesBurned: calories ? Number(calories) : 0,
      date: todayStr(),
      templateId,
    })
    onLog(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-primary" style={{ animation: 'slideUp 0.25s ease-out' }}>
      <div className="flex items-center justify-between px-5 pt-10 pb-4 border-b border-border-subtle">
        <h2 className="text-lg font-bold text-text-primary">Log Activity</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center press-active">
          <X size={16} className="text-text-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-5">
        {/* Activity type */}
        <div>
          <label className="label-sm">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {ACTIVITY_TYPES.map(at => (
              <button
                key={at.id}
                onClick={() => setType(at.id)}
                className={clsx(
                  'flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all press-active',
                  type === at.id
                    ? 'bg-accent/15 border-accent/40 text-accent'
                    : 'bg-bg-elevated border-border-subtle text-text-secondary'
                )}
              >
                <span className="text-lg">{at.emoji}</span>
                {at.label}
              </button>
            ))}
          </div>
        </div>

        {/* Use template */}
        {type === 'workout' && templates.length > 0 && (
          <div>
            <label className="label-sm">Use Template (optional)</label>
            <div className="space-y-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleTemplateSelect(t)}
                  className={clsx(
                    'w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all press-active',
                    templateId === t.id
                      ? 'bg-accent/15 border-accent/40'
                      : 'bg-bg-elevated border-border-subtle'
                  )}
                >
                  <div>
                    <p className={clsx('text-sm font-semibold', templateId === t.id ? 'text-accent' : 'text-text-primary')}>
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted">{t.exercises.length} exercises</p>
                  </div>
                  {templateId === t.id && <div className="w-2 h-2 rounded-full bg-accent" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="label-sm">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Morning Run, Chest & Tris..."
            className="input-base"
          />
        </div>

        {/* Duration + Calories */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-sm">Duration (min)</label>
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="45"
              className="input-base text-center"
              min="1"
            />
          </div>
          <div>
            <label className="label-sm">Calories burned</label>
            <input
              type="number"
              value={calories}
              onChange={e => setCalories(e.target.value)}
              placeholder="Optional"
              className="input-base text-center"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-safe pt-4 border-t border-border-subtle">
        <button
          onClick={handleLog}
          disabled={!canLog}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all"
        >
          Log Activity
        </button>
      </div>
    </div>
  )
}
