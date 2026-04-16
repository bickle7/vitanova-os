import { useState, useCallback, useEffect } from 'react'
import type { Word, Category } from '../types/spanish'
import { SEED_WORDS, STARTER_WORD_IDS } from '../data/seedData'
import {
  getWords,
  saveWords,
  addWord as storageAddWord,
  updateWord as storageUpdateWord,
  deleteWord as storageDeleteWord,
  toggleFavourite as storageToggleFavourite,
  incrementUseCount as storageIncrementUseCount,
  generateId,
  isFirstLoad,
  markInitialized,
} from '../lib/storage'

function initializeWords(): Word[] {
  if (isFirstLoad()) {
    // Pre-populate with starter words from seed bank
    const starterWords = SEED_WORDS.filter(w => STARTER_WORD_IDS.includes(w.id)).map(w => ({
      ...w,
      created_at: new Date().toISOString(),
    }))
    saveWords(starterWords)
    markInitialized()
    return starterWords
  }
  return getWords()
}

export function useWords() {
  const [words, setWords] = useState<Word[]>(() => initializeWords())

  // Sync from storage on focus (multi-tab support)
  useEffect(() => {
    const handleFocus = () => {
      setWords(getWords())
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const addWord = useCallback((params: {
    english: string
    spanish: string
    category: Category
    pronunciation?: string
    source?: 'custom' | 'discovery'
    seedId?: string
  }): Word => {
    const word: Word = {
      id: params.seedId ?? generateId(),
      english: params.english.trim(),
      spanish: params.spanish.trim(),
      category: params.category,
      pronunciation: params.pronunciation?.trim() || undefined,
      is_favourite: false,
      use_count: 0,
      source: params.source ?? 'custom',
      created_at: new Date().toISOString(),
    }
    const updated = storageAddWord(word)
    setWords(updated)
    return word
  }, [])

  const addSeedWord = useCallback((seedWord: Word): Word => {
    const wordToAdd = {
      ...seedWord,
      created_at: new Date().toISOString(),
    }
    const updated = storageAddWord(wordToAdd)
    setWords(updated)
    return wordToAdd
  }, [])

  const updateWord = useCallback((id: string, updates: Partial<Word>) => {
    const updated = storageUpdateWord(id, updates)
    setWords(updated)
  }, [])

  const deleteWord = useCallback((id: string) => {
    const updated = storageDeleteWord(id)
    setWords(updated)
  }, [])

  const toggleFavourite = useCallback((id: string) => {
    const updated = storageToggleFavourite(id)
    setWords(updated)
  }, [])

  const incrementUseCount = useCallback((id: string) => {
    const updated = storageIncrementUseCount(id)
    setWords(updated)
  }, [])

  const isWordInList = useCallback((wordId: string) => {
    return words.some(w => w.id === wordId)
  }, [words])

  // Words not yet in user's list (available to discover)
  const discoveryWords = SEED_WORDS.filter(sw => !words.some(w => w.id === sw.id))

  return {
    words,
    discoveryWords,
    addWord,
    addSeedWord,
    updateWord,
    deleteWord,
    toggleFavourite,
    incrementUseCount,
    isWordInList,
  }
}
