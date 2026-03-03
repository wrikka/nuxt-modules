import { readonly, ref } from "vue"

export interface HabitEntry {
	date: string
	completed: boolean
}

export interface Habit {
	id: string
	name: string
	color: string
	entries: HabitEntry[]
	streak: number
	bestStreak: number
}

export function useHabitStreak() {
	const habits = ref<Habit[]>([])
	const selectedDate = ref(new Date().toISOString().split("T")[0])

	function createHabit(name: string, color: string): Habit {
		return {
			id: crypto.randomUUID(),
			name,
			color,
			entries: [],
			streak: 0,
			bestStreak: 0,
		}
	}

	function toggleHabit(habitId: string, date: string): void {
		const habit = habits.value.find(h => h.id === habitId)
		if (!habit) return

		const entryIndex = habit.entries.findIndex(e => e.date === date)
		if (entryIndex !== -1) {
			habit.entries[entryIndex].completed = !habit.entries[entryIndex].completed
		}
		else {
			habit.entries.push({ date, completed: true })
		}

		recalculateStreak(habit)
	}

	function recalculateStreak(habit: Habit): void {
		const sorted = [...habit.entries]
			.filter(e => e.completed)
			.sort((a, b) => b.date.localeCompare(a.date))

		let currentStreak = 0
		const today = new Date().toISOString().split("T")[0]
		let lastDate = today

		for (const entry of sorted) {
			const entryDate = new Date(entry.date)
			const lastDateObj = new Date(lastDate)
			const diffDays = Math.floor((lastDateObj.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

			if (diffDays <= 1) {
				currentStreak++
				lastDate = entry.date
			}
			else {
				break
			}
		}

		habit.streak = currentStreak
		habit.bestStreak = Math.max(habit.bestStreak, currentStreak)
	}

	function getMonthData(habitId: string, year: number, month: number): Array<{ date: string, completed: boolean, isToday: boolean }> {
		const habit = habits.value.find(h => h.id === habitId)
		if (!habit) return []

		const daysInMonth = new Date(year, month + 1, 0).getDate()
		const today = new Date().toISOString().split("T")[0]

		return Array.from({ length: daysInMonth }, (_, i) => {
			const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`
			const entry = habit.entries.find(e => e.date === date)
			return {
				date,
				completed: entry?.completed || false,
				isToday: date === today,
			}
		})
	}

	function getStreakEmoji(streak: number): string {
		if (streak === 0) return "🔥"
		if (streak < 7) return "🔥"
		if (streak < 30) return "⚡"
		if (streak < 100) return "🏆"
		return "👑"
	}

	return {
		habits: readonly(habits),
		selectedDate: readonly(selectedDate),
		createHabit,
		toggleHabit,
		getMonthData,
		getStreakEmoji,
	}
}
