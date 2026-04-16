import type { Word } from '../types/spanish'

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

export function isFirstLoad(): boolean {
  return localStorage.getItem(VERSION_KEY) === null
}

export function markInitialized(): void {
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
}

export function generateId(): string {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
