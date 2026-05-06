import { useState } from 'react'
import { X } from 'lucide-react'
import type { WeightEntry } from '../../../types/fitness'
import { addWeightEntry } from '../../../lib/fitnessStorage'

interface Props {
  currentWeight: number
  onClose: () => void
  onSave: (entries: WeightEntry[]) => void
}

export default function WeightLogModal({ currentWeight, onClose, onSave }: Props) {
  const [weight, setWeight] = useState(String(currentWeight))

  const canSave = weight && Number(weight) > 0

  const handleSave = () => {
    if (!canSave) return
    const updated = addWeightEntry(Number(weight))
    onSave(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="w-full bg-bg-primary rounded-t-3xl px-5 pt-5 pb-safe"
        style={{ animation: 'slideUp 0.2s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-text-primary">Log Weight</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center press-active">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        <div className="mb-5">
          <label className="label-sm">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="80.5"
            className="input-base text-center text-xl font-bold"
            step="0.1"
            min="30"
            max="300"
            autoFocus
          />
          <p className="text-center text-xs text-text-muted mt-2">Today's entry will replace any existing one</p>
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full flex items-center justify-center py-4 rounded-2xl bg-accent text-bg-primary font-semibold text-sm press-active shadow-glow-accent disabled:opacity-40 transition-all mb-4"
        >
          Save Weight
        </button>
      </div>
    </div>
  )
}
