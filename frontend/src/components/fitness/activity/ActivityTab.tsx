import { useState } from 'react'
import { Plus, Dumbbell, Trash2, ClipboardList, Smartphone } from 'lucide-react'
import clsx from 'clsx'
import type { ActivityEntry, WorkoutTemplate } from '../../../types/fitness'
import {
  getWorkoutTemplates, deleteWorkoutTemplate,
  getActivityEntries, deleteActivityEntry,
  todayStr,
} from '../../../lib/fitnessStorage'
import WorkoutTemplateModal from './WorkoutTemplateModal'
import LogActivityModal from './LogActivityModal'

const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  workout: 'text-accent',
  run:     'text-orange-400',
  walk:    'text-green-400',
  cycle:   'text-sky-400',
  swim:    'text-blue-400',
  other:   'text-purple-400',
}

const ACTIVITY_TYPE_EMOJIS: Record<string, string> = {
  workout: '🏋️', run: '🏃', walk: '🚶', cycle: '🚴', swim: '🏊', other: '⚡',
}

function fmt(n: number) { return n.toLocaleString() }

export default function ActivityTab() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => getWorkoutTemplates())
  const [activities, setActivities] = useState<ActivityEntry[]>(() => getActivityEntries())
  const [showTemplate, setShowTemplate] = useState(false)
  const [showLog, setShowLog]           = useState(false)

  const today = todayStr()
  const todayActivities = activities.filter(a => a.date === today)
  const pastActivities  = activities.filter(a => a.date !== today)

  const handleDeleteTemplate = (id: string) => {
    setTemplates(deleteWorkoutTemplate(id))
  }

  const handleDeleteActivity = (id: string) => {
    setActivities(deleteActivityEntry(id))
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-24">
      {/* Apple Health placeholder */}
      <div className="card px-4 py-3 mb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0">
          <Smartphone size={16} className="text-text-muted" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">Apple Health</p>
          <p className="text-xs text-text-muted">Auto-sync coming soon</p>
        </div>
        <span className="text-[10px] font-semibold text-text-muted border border-border-subtle rounded-full px-2 py-0.5">
          Soon
        </span>
      </div>

      {/* Log activity FAB row */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowLog(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-bg-primary text-sm font-semibold press-active shadow-glow-accent transition-all"
        >
          <Plus size={14} /> Log Activity
        </button>
        <button
          onClick={() => setShowTemplate(true)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border-subtle bg-bg-elevated text-text-secondary text-sm font-semibold press-active transition-all"
        >
          <ClipboardList size={14} /> Template
        </button>
      </div>

      {/* Today's activity */}
      {todayActivities.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Today</p>
          <div className="space-y-2">
            {todayActivities.map(a => (
              <div key={a.id} className="card px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-base">
                  {ACTIVITY_TYPE_EMOJIS[a.type] ?? '⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{a.name}</p>
                  <p className="text-xs text-text-muted">{a.durationMinutes} min</p>
                </div>
                {a.caloriesBurned > 0 && (
                  <span className={clsx('text-sm font-semibold flex-shrink-0', ACTIVITY_TYPE_COLORS[a.type] ?? 'text-accent')}>
                    -{fmt(a.caloriesBurned)} kcal
                  </span>
                )}
                <button
                  onClick={() => handleDeleteActivity(a.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Workout Templates</p>
        {templates.length === 0 ? (
          <div className="card px-4 py-6 text-center text-text-muted text-sm">
            No templates yet — tap Template to create one
          </div>
        ) : (
          <div className="space-y-2">
            {templates.map(t => (
              <div key={t.id} className="card px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={15} className="text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-muted">
                    {t.exercises.length} exercise{t.exercises.length !== 1 ? 's' : ''}
                    {t.estimatedCalories ? ` · ~${fmt(t.estimatedCalories)} kcal` : ''}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteTemplate(t.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past activity history */}
      {pastActivities.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">History</p>
          <div className="space-y-2">
            {pastActivities.map(a => (
              <div key={a.id} className="card px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0 text-base">
                  {ACTIVITY_TYPE_EMOJIS[a.type] ?? '⚡'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{a.name}</p>
                  <p className="text-xs text-text-muted">{a.date} · {a.durationMinutes} min</p>
                </div>
                {a.caloriesBurned > 0 && (
                  <span className="text-sm font-semibold text-text-muted flex-shrink-0">
                    -{fmt(a.caloriesBurned)} kcal
                  </span>
                )}
                <button
                  onClick={() => handleDeleteActivity(a.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTemplate && (
        <WorkoutTemplateModal
          onClose={() => setShowTemplate(false)}
          onSave={setTemplates}
        />
      )}
      {showLog && (
        <LogActivityModal
          templates={templates}
          onClose={() => setShowLog(false)}
          onLog={setActivities}
        />
      )}
    </div>
  )
}
