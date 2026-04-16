import { useState } from 'react'
import type { AppMode } from '../../types/spanish'
import { useWords } from '../../hooks/useWords'
import ModeToggle from './ModeToggle'
import ReferenceMode from './reference/ReferenceMode'
import QuickTapMode from './quicktap/QuickTapMode'

export default function SpanishFeature() {
  const [mode, setMode] = useState<AppMode>('reference')
  const wordState = useWords()

  return (
    <div className="flex flex-col h-full">
      {/* Mode Toggle */}
      <div className="px-4 pt-3 pb-2">
        <ModeToggle mode={mode} onModeChange={setMode} />
      </div>

      {/* Feature content */}
      <div className="flex-1 overflow-hidden">
        {mode === 'reference' ? (
          <ReferenceMode {...wordState} />
        ) : (
          <QuickTapMode {...wordState} />
        )}
      </div>
    </div>
  )
}
