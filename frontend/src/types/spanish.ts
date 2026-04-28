export type Category =
  | 'greetings'
  | 'eating_drinking'
  | 'travel_directions'
  | 'shopping'
  | 'hotel'
  | 'emergencies'
  | 'general'

export type QuickTapContext =
  | 'eating_drinking'
  | 'shopping'
  | 'getting_around'
  | 'hotel'
  | 'emergencies'

export interface Word {
  id: string
  english: string
  spanish: string
  category: Category
  pronunciation?: string
  is_favourite: boolean
  use_count: number
  source: 'custom' | 'discovery'
  created_at: string
}

export interface Connector {
  english: string
  spanish: string
}

export interface SuffixChip {
  english: string
  spanish: string
}

export interface SmartItem {
  id: string
  english: string
  spanish: string
}

export interface BuiltPhrase {
  spanish: string
  english: string
}

export interface QuickTapState {
  selectedContext: QuickTapContext
  selectedConnector: Connector | null
  selectedWords: Word[]
  selectedSuffixes: SuffixChip[]
  builtPhrase: BuiltPhrase
}

// Dictionary | Phrase Builder | Favourites
export type AppMode = 'dictionary' | 'phrasebuilder' | 'favourites'

export type DirectionToggle = 'EN_ES' | 'ES_EN'

export interface CategoryMeta {
  id: Category | 'all' | 'favourites'
  label: string
  emoji: string
}

export interface QuickTapContextMeta {
  id: QuickTapContext
  label: string
  emoji: string
}
