import type { AppMode } from '../../types/spanish'
import { useWords } from '../../hooks/useWords'
import ReferenceMode from './reference/ReferenceMode'
import QuickTapMode from './quicktap/QuickTapMode'

interface Props {
  activeTab: AppMode
  onTabChange: (tab: AppMode) => void
}

export default function SpanishFeature({ activeTab }: Props) {
  const wordState = useWords()

  return (
    <div className="flex flex-col h-full">
      {activeTab === 'dictionary' && (
        <ReferenceMode {...wordState} favouritesOnly={false} />
      )}
      {activeTab === 'phrasebuilder' && (
        <QuickTapMode {...wordState} />
      )}
      {activeTab === 'favourites' && (
        <ReferenceMode {...wordState} favouritesOnly={true} />
      )}
    </div>
  )
}
