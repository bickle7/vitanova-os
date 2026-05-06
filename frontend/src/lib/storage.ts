import type { Word, SavedPhrase } from '../types/spanish'

const STORAGE_KEY = 'vitanova_spanish_words'
const VERSION_KEY = 'vitanova_storage_version'
const CURRENT_VERSION = '1'

export function getWords(): Word[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Word[]
  } catch {
    return []
  }
}

export function saveWords(words: Word[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words))
  } catch (e) {
    console.error('Failed to save words to localStorage', e)
  }
}

export function addWord(word: Word): Word[] {
  const words = getWords()
  // Prevent duplicates by id
  if (words.find(w => w.id === word.id)) {
    return words
  }
  const updated = [word, ...words]
  saveWords(updated)
  return updated
}

export function updateWord(id: string, updates: Partial<Word>): Word[] {
  const words = getWords()
  const updated = words.map(w => w.id === id ? { ...w, ...updates } : w)
  saveWords(updated)
  return updated
}

export function deleteWord(id: string): Word[] {
  const words = getWords()
  const updated = words.filter(w => w.id !== id)
  saveWords(updated)
  return updated
}

export function toggleFavourite(id: string): Word[] {
  const words = getWords()
  const updated = words.map(w =>
    w.id === id ? { ...w, is_favourite: !w.is_favourite } : w
  )
  saveWords(updated)
  return updated
}

export function incrementUseCount(id: string): Word[] {
  const words = getWords()
  const updated = words.map(w =>
    w.id === id ? { ...w, use_count: w.use_count + 1 } : w
  )
  saveWords(updated)
  return updated
}

// Migrate old topic-based categories to new situation-based ones
const CATEGORY_MIGRATION: Record<string, string> = {
  eating_drinking:   'restaurant',
  travel_directions: 'getting_around',
  shopping:          'shop',
}

export function migrateCategories(): void {
  const words = getWords()
  let changed = false
  const updated = words.map(w => {
    const newCat = CATEGORY_MIGRATION[w.category]
    if (newCat) { changed = true; return { ...w, category: newCat } }
    return w
  })
  if (changed) saveWords(updated as Word[])
}

export function isFirstLoad(): boolean {
  return localStorage.getItem(VERSION_KEY) === null
}

export function markInitialized(): void {
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
}

export function generateId(): string {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

const ONBOARDING_KEY = 'vitanova_onboarded'

export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true'
}

export function markOnboardingComplete(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true')
}

// ─── Saved Phrases ─────────────────────────────────────────────────────────

const SAVED_PHRASES_KEY = 'vitanova_saved_phrases'

export function getSavedPhrases(): SavedPhrase[] {
  try {
    const raw = localStorage.getItem(SAVED_PHRASES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedPhrase[]
  } catch {
    return []
  }
}

export function addSavedPhrase(phrase: SavedPhrase): SavedPhrase[] {
  const phrases = getSavedPhrases()
  const updated = [phrase, ...phrases]
  localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated))
  return updated
}

export function deleteSavedPhrase(id: string): SavedPhrase[] {
  const updated = getSavedPhrases().filter(p => p.id !== id)
  localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(updated))
  return updated
}

export function reorderSavedPhrases(orderedIds: string[]): SavedPhrase[] {
  const phrases = getSavedPhrases()
  const map = new Map(phrases.map(p => [p.id, p]))
  const reordered = orderedIds.map(id => map.get(id)).filter(Boolean) as SavedPhrase[]
  localStorage.setItem(SAVED_PHRASES_KEY, JSON.stringify(reordered))
  return reordered
}
