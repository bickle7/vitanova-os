import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Exercise, WorkoutTemplate } from '../../../types/fitness'
import { saveWorkoutTemplate } from '../../../lib/fitnessStorage'

interface Props {
  onClose: () => void
  onSave: (templates: WorkoutTemplate[]) => void
}

export default function WorkoutTemplateModal({ onClose, onSave }: Props) {
  const [name, setName]           = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([{ name: '' }])
  const [estCals, setEstCals]     = useState('')

  const addExercise = () => setExercises(prev => [...prev, { name: '' }])
  const removeExercise = (i: number) => setExercises(prev => prev.filter((_, j) => j !== i))
  const updateExercise = (i: number, field: keyof Exercise, value: string | number) => {
    setExercises(prev => prev.map((ex, j) => j === i ? { ...ex, [field]: value } : ex))
  }

  const canSave = name.trim() && exercises.some(e => e.name.trim())

  const handleSave = () => {
    if (!canSave) return
    const cleaned = exercises.filter(e => e.name.trim())
    const updated = saveWorkoutTemplate({
      name: name.trim(),
      exercises: cleaned,
      estimatedCalories: estCals ? Number(estCals) : undefined,
    })
    onSave(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-primary" style={{ animation: 'slideUp 0.25s ease-out' }}>
      <div className="flex items-center justify-between px-5 pt-10 pb-4 border-b border-border-subtle">
        <h2 className="text-lg font-bold text-text-primary">New Template</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center press-active">
          <X size={16} className="text-text-muted" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-5">
        <div>
          <label className="label-sm">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Push Day, Morning Run..."
            className="input-base"
          />
        </div>

        <div>
          <label className="label-sm">Estimated Calories Burned</label>
          <input
            type="number"
            value={estCals}
            onChange={e => setEstCals(e.target.value)}
            placeholder="Optional"
            className="input-base"
            min="0"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label-sm">Exercises</label>
            <button
              onClick={addExercise}
              className="text-xs text-accent font-semibold press-active flex items-center gap-1"
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {exercises.map((ex, i) => (
              <div key={i} className="card px-3 py-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ex.name}
                    onChange={e => updateExercise(i, 'name', e.target.value)}
                    placeholder="Exercise name"
                    className="input-base flex-1 text-sm"
                  />
                  {exercises.length > 1 && (
                    <button
                      onClick={() => removeExercise(i)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 press-active transition-colors flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={ex.sets ?? ''}
                    onChange={e => updateExercise(i, 'sets', Number(e.target.value))}
                    placeholder="Sets"
                    className="input-base text-sm text-center"
                    min="1"
                  />
                  <input
                    type="number"
                    value={ex.reps ?? ''}
                    onChange={e => updateExercise(i, 'reps', Number(e.target.value))}
                    placeholder="Reps"
                    className="input-base text-sm text-center"
                    min="1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-safe pt-4 border-t border-border-subtle">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all"
        >
          Save Template
        </button>
      </div>
    </div>
  )
}
