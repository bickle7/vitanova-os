import type {
  UserStats, FoodEntry, WorkoutTemplate, ActivityEntry, WeightEntry, ActivityLevel,
} from '../types/fitness'

// ─── Keys ────────────────────────────────────────────────────────────────────
const STATS_KEY      = 'vitanova_fitness_stats'
const FOOD_KEY       = 'vitanova_fitness_food'
const TEMPLATES_KEY  = 'vitanova_fitness_templates'
const ACTIVITIES_KEY = 'vitanova_fitness_activities'
const WEIGHT_KEY     = 'vitanova_fitness_weight'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
function genId() { return `fit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }

// ─── BMR / TDEE / Calorie Target ─────────────────────────────────────────────

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light:     1.375,
  moderate:  1.55,
  active:    1.725,
}

export function calcBMR(stats: Pick<UserStats, 'weight' | 'height' | 'age' | 'sex'>): number {
  // Mifflin-St Jeor
  const base = 10 * stats.weight + 6.25 * stats.height - 5 * stats.age
  return Math.round(stats.sex === 'male' ? base + 5 : base - 161)
}

export function calcTDEE(stats: UserStats): number {
  return Math.round(calcBMR(stats) * ACTIVITY_MULTIPLIERS[stats.activityLevel])
}

export function calcCalorieTarget(stats: Omit<UserStats, 'dailyCalorieTarget' | 'updatedAt'>): number {
  const tdee = Math.round(calcBMR(stats) * ACTIVITY_MULTIPLIERS[stats.activityLevel])
  if (stats.goal === 'lose_weight' || stats.goal === 'both') return Math.max(1200, tdee - 500)
  return tdee
}

// ─── User Stats ───────────────────────────────────────────────────────────────
// Stored as UserStats[] — newest first. Never overwrites old entries.

export function getUserStats(): UserStats | null {
  const history = read<UserStats[]>(STATS_KEY, [])
  // Support legacy single-object format from before v0.7.1
  if (!Array.isArray(history)) return history as UserStats | null
  return history[0] ?? null
}

export function getUserStatsHistory(): UserStats[] {
  const history = read<UserStats[]>(STATS_KEY, [])
  if (!Array.isArray(history)) return history ? [history as UserStats] : []
  return history
}

export function saveUserStats(stats: UserStats): void {
  const history = getUserStatsHistory()
  write(STATS_KEY, [stats, ...history])
}

// ─── Food Entries ─────────────────────────────────────────────────────────────

export function getFoodEntries(): FoodEntry[] {
  return read<FoodEntry[]>(FOOD_KEY, [])
}

export function addFoodEntry(entry: Omit<FoodEntry, 'id' | 'createdAt'>): FoodEntry[] {
  const entries = getFoodEntries()
  const newEntry: FoodEntry = { ...entry, id: genId(), createdAt: new Date().toISOString() }
  const updated = [newEntry, ...entries]
  write(FOOD_KEY, updated)
  return updated
}

export function deleteFoodEntry(id: string): FoodEntry[] {
  const updated = getFoodEntries().filter(e => e.id !== id)
  write(FOOD_KEY, updated)
  return updated
}

export function getTodayFoodEntries(): FoodEntry[] {
  return getFoodEntriesForDate(todayStr())
}

export function getFoodEntriesForDate(date: string): FoodEntry[] {
  return getFoodEntries().filter(e => e.date === date)
}

// ─── Workout Templates ────────────────────────────────────────────────────────

export function getWorkoutTemplates(): WorkoutTemplate[] {
  return read<WorkoutTemplate[]>(TEMPLATES_KEY, [])
}

export function saveWorkoutTemplate(template: Omit<WorkoutTemplate, 'id' | 'createdAt'>): WorkoutTemplate[] {
  const templates = getWorkoutTemplates()
  const newT: WorkoutTemplate = { ...template, id: genId(), createdAt: new Date().toISOString() }
  const updated = [newT, ...templates]
  write(TEMPLATES_KEY, updated)
  return updated
}

export function deleteWorkoutTemplate(id: string): WorkoutTemplate[] {
  const updated = getWorkoutTemplates().filter(t => t.id !== id)
  write(TEMPLATES_KEY, updated)
  return updated
}

// ─── Activity Entries ─────────────────────────────────────────────────────────

export function getActivityEntries(): ActivityEntry[] {
  return read<ActivityEntry[]>(ACTIVITIES_KEY, [])
}

export function addActivityEntry(entry: Omit<ActivityEntry, 'id' | 'createdAt'>): ActivityEntry[] {
  const entries = getActivityEntries()
  const newEntry: ActivityEntry = { ...entry, id: genId(), createdAt: new Date().toISOString() }
  const updated = [newEntry, ...entries]
  write(ACTIVITIES_KEY, updated)
  return updated
}

export function deleteActivityEntry(id: string): ActivityEntry[] {
  const updated = getActivityEntries().filter(e => e.id !== id)
  write(ACTIVITIES_KEY, updated)
  return updated
}

export function getTodayActivities(): ActivityEntry[] {
  return getActivitiesForDate(todayStr())
}

export function getActivitiesForDate(date: string): ActivityEntry[] {
  return getActivityEntries().filter(a => a.date === date)
}

// ─── Weight Entries ───────────────────────────────────────────────────────────

export function getWeightEntries(): WeightEntry[] {
  return read<WeightEntry[]>(WEIGHT_KEY, [])
}

export function addWeightEntry(weight: number): WeightEntry[] {
  const entries = getWeightEntries()
  const today = todayStr()
  // Replace today's entry if it exists
  const filtered = entries.filter(e => e.date !== today)
  const newEntry: WeightEntry = { id: genId(), weight, date: today, createdAt: new Date().toISOString() }
  const updated = [newEntry, ...filtered].sort((a, b) => b.date.localeCompare(a.date))
  write(WEIGHT_KEY, updated)
  return updated
}

export function deleteWeightEntry(id: string): WeightEntry[] {
  const updated = getWeightEntries().filter(e => e.id !== id)
  write(WEIGHT_KEY, updated)
  return updated
}

// ─── Weekly stats helpers ─────────────────────────────────────────────────────

export function getCurrentWeekDays(): string[] {
  // Returns Mon–Sun of the current week (ISO week)
  const today = new Date()
  const dow = today.getDay() // 0=Sun, 1=Mon...
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export function getWeeklyCalories(): { consumed: number; burned: number; deficitDays: number } {
  const days = last7Days()
  const food = getFoodEntries()
  const activities = getActivityEntries()
  const stats = getUserStats()
  const bmr = stats ? calcBMR(stats) : 2000

  let consumed = 0
  let burned = 0
  let deficitDays = 0

  for (const day of days) {
    const dayFood = food.filter(f => f.date === day).reduce((s, f) => s + f.calories, 0)
    const dayActivity = activities.filter(a => a.date === day).reduce((s, a) => s + a.caloriesBurned, 0)
    const dayBurned = bmr + dayActivity
    consumed += dayFood
    burned += dayBurned
    if (dayFood > 0 && dayBurned > dayFood) deficitDays++
  }
  return { consumed, burned, deficitDays }
}

export function getDeficitStreak(): number {
  const allDays = last30Days()
  const food = getFoodEntries()
  const activities = getActivityEntries()
  const stats = getUserStats()
  const bmr = stats ? calcBMR(stats) : 2000

  let streak = 0
  for (const day of allDays) {
    const dayFood = food.filter(f => f.date === day).reduce((s, f) => s + f.calories, 0)
    if (dayFood === 0) break  // no log = streak ends
    const dayActivity = activities.filter(a => a.date === day).reduce((s, a) => s + a.caloriesBurned, 0)
    if (bmr + dayActivity > dayFood) streak++
    else break
  }
  return streak
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })
}

function last30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().slice(0, 10)
  })
}
