import type { MediaItem, MusicItem, Place, Recommendation } from '../types/library'

const KEYS = {
  media: 'vitanova_library_media',
  music: 'vitanova_library_music',
  places: 'vitanova_library_places',
  recommendations: 'vitanova_library_recommendations',
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as T[]
  } catch {
    return []
  }
}

function save<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items))
}

// ── Media (Movies & TV) ────────────────────────────────────────────────────

export function getMediaItems(): MediaItem[] {
  return load<MediaItem>(KEYS.media)
}

export function addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem[] {
  const items = getMediaItems()
  const newItem: MediaItem = { ...item, id: generateId('media'), createdAt: new Date().toISOString() }
  const updated = [newItem, ...items]
  save(KEYS.media, updated)
  return updated
}

export function updateMediaItem(id: string, updates: Partial<Omit<MediaItem, 'id' | 'createdAt'>>): MediaItem[] {
  const items = getMediaItems().map(i => i.id === id ? { ...i, ...updates } : i)
  save(KEYS.media, items)
  return items
}

export function deleteMediaItem(id: string): MediaItem[] {
  const items = getMediaItems().filter(i => i.id !== id)
  save(KEYS.media, items)
  return items
}

// ── Recommendations ─────────────────────────────────────────────────────────

export function getRecommendations(): Recommendation[] {
  return load<Recommendation>(KEYS.recommendations)
}

export function saveRecommendations(recs: Recommendation[]): void {
  save(KEYS.recommendations, recs)
}

export function dismissRecommendation(id: string): Recommendation[] {
  const recs = getRecommendations().map(r => r.id === id ? { ...r, dismissed: true } : r)
  save(KEYS.recommendations, recs)
  return recs
}

// ── Music ──────────────────────────────────────────────────────────────────

export function getMusicItems(): MusicItem[] {
  return load<MusicItem>(KEYS.music)
}

export function addMusicItem(item: Omit<MusicItem, 'id' | 'createdAt'>): MusicItem[] {
  const items = getMusicItems()
  const newItem: MusicItem = { ...item, id: generateId('music'), createdAt: new Date().toISOString() }
  const updated = [newItem, ...items]
  save(KEYS.music, updated)
  return updated
}

export function deleteMusicItem(id: string): MusicItem[] {
  const items = getMusicItems().filter(i => i.id !== id)
  save(KEYS.music, items)
  return items
}

// ── Places ─────────────────────────────────────────────────────────────────

export function getPlaces(): Place[] {
  return load<Place>(KEYS.places)
}

export function addPlace(item: Omit<Place, 'id' | 'createdAt'>): Place[] {
  const items = getPlaces()
  const newItem: Place = { ...item, id: generateId('place'), createdAt: new Date().toISOString() }
  const updated = [newItem, ...items]
  save(KEYS.places, updated)
  return updated
}

export function updatePlace(id: string, updates: Partial<Omit<Place, 'id' | 'createdAt'>>): Place[] {
  const items = getPlaces().map(p => p.id === id ? { ...p, ...updates } : p)
  save(KEYS.places, items)
  return items
}

export function deletePlace(id: string): Place[] {
  const items = getPlaces().filter(p => p.id !== id)
  save(KEYS.places, items)
  return items
}
