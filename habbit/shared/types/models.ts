export interface Habit {
  id: string
  name: string
  color: string
  icon: string
  targetDays: number
  createdAt: string
}

export interface HabitEntry {
  id: string
  habitId: string
  date: string
  completed: boolean
  notes?: string
}

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[]
}

export interface HabitStats {
  totalEntries: number
  completedEntries: number
  completionRate: number
  currentStreak: number
  longestStreak: number
}

// Database operation types
export interface NewHabit extends Omit<Habit, 'id' | 'createdAt'> {}
export interface NewHabitEntry extends Omit<HabitEntry, 'id'> {}
