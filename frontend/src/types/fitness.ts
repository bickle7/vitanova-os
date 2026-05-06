export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active'
export type FitnessGoal = 'lose_weight' | 'get_fitter' | 'both'
export type FitnessTab = 'today' | 'activity' | 'progress'
export type ActivityType = 'workout' | 'run' | 'walk' | 'cycle' | 'swim' | 'other'

export interface UserStats {
  age: number
  weight: number        // kg
  height: number        // cm
  sex: 'male' | 'female'
  activityLevel: ActivityLevel
  targetWeight: number  // kg
  goal: FitnessGoal
  dailyCalorieTarget: number
  updatedAt: string
}

export interface FoodEntry {
  id: string
  description: string
  calories: number
  date: string          // YYYY-MM-DD
  createdAt: string
}

export interface Exercise {
  name: string
  sets?: number
  reps?: number
  durationSeconds?: number
  notes?: string
}

export interface WorkoutTemplate {
  id: string
  name: string
  exercises: Exercise[]
  estimatedCalories?: number
  createdAt: string
}

export interface ActivityEntry {
  id: string
  type: ActivityType
  name: string
  durationMinutes: number
  caloriesBurned: number
  date: string          // YYYY-MM-DD
  templateId?: string
  notes?: string
  createdAt: string
}

export interface WeightEntry {
  id: string
  weight: number        // kg
  date: string          // YYYY-MM-DD
  createdAt: string
}
