import { nanoid } from 'nanoid'

export function generateHabitId(): string {
  return `habit_${nanoid()}`
}

export function generateHabitEntryId(): string {
  return `entry_${nanoid()}`
}
