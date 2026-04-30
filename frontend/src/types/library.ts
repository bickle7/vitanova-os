export type MediaType = 'movie' | 'tv'
export type MediaStatus = 'watchlist' | 'watch_next' | 'watched' | 'favourite'
export type LibraryTab = 'movies' | 'music' | 'places'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  status: MediaStatus
  notes?: string
  createdAt: string
}

export interface Recommendation {
  id: string
  title: string
  type: MediaType
  year?: string
  genre?: string
  reason: string
  dismissed: boolean
}

export interface MusicItem {
  id: string
  artist: string
  album?: string
  genre?: string
  createdAt: string
}

export interface Place {
  id: string
  name: string
  notes?: string
  monthYear?: string
  visited: boolean
  createdAt: string
}
