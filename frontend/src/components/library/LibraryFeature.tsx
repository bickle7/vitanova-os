import type { LibraryTab } from '../../types/library'
import MoviesTab from './movies/MoviesTab'
import MusicTab from './music/MusicTab'
import PlacesTab from './places/PlacesTab'

interface Props {
  activeTab: LibraryTab
}

export default function LibraryFeature({ activeTab }: Props) {
  return (
    <div className="flex flex-col h-full">
      {activeTab === 'movies' && <MoviesTab />}
      {activeTab === 'music'  && <MusicTab />}
      {activeTab === 'places' && <PlacesTab />}
    </div>
  )
}
