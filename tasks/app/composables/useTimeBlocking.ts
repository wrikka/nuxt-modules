/**
 * Composable for Time Blocking Calendar
 */
export const useTimeBlocking = () => {
	const { $toast } = useNuxtApp()

	const timeBlocks = useState<{
		id: string
		title: string
		start: string
		end: string
		type: "focus" | "meeting" | "break"
		taskId?: string
	}[]>("time-blocks", () => [])

	const connectedCalendars = useState<string[]>("connected-calendars", () => [])
	const isSyncing = useState<boolean>("calendar-syncing", () => false)

	/**
	 * Create time block
	 */
	const createTimeBlock = (block: Omit<typeof timeBlocks.value[0], "id">) => {
		const newBlock = {
			...block,
			id: crypto.randomUUID(),
		}
		timeBlocks.value.push(newBlock)
		return newBlock
	}

	/**
	 * Delete time block
	 */
	const deleteTimeBlock = (blockId: string) => {
		timeBlocks.value = timeBlocks.value.filter(b => b.id !== blockId)
	}

	/**
	 * Connect external calendar
	 */
	const connectCalendar = async (provider: "google" | "outlook" | "apple") => {
		const { data, error } = await useFetch<string>(`/api/calendar/${provider}/connect`)

		if (error.value || !data.value) {
			$toast.error(`Failed to connect ${provider} calendar`)
			return false
		}

		// Redirect to OAuth flow
		window.location.href = data.value
		return true
	}

	/**
	 * Sync with connected calendars
	 */
	const syncCalendars = async () => {
		if (connectedCalendars.value.length === 0) {
			$toast.info("No calendars connected")
			return
		}

		isSyncing.value = true

		try {
			const { data, error } = await useFetch<{
				events: { title: string; start: string; end: string }[]
			}>("/api/calendar/sync")

			if (!error.value && data.value) {
				// Import events as time blocks
				for (const event of data.value.events) {
					createTimeBlock({
						title: event.title,
						start: event.start,
						end: event.end,
						type: "meeting",
					})
				}
				$toast.success("Calendar synced")
			}
		} finally {
			isSyncing.value = false
		}
	}

	/**
	 * Export time blocks to calendar
	 */
	const exportToCalendar = async (calendarId: string) => {
		const { error } = await useFetch(`/api/calendar/${calendarId}/export`, {
			method: "POST",
			body: { blocks: timeBlocks.value },
		})

		if (error.value) {
			$toast.error("Failed to export to calendar")
			return false
		}

		$toast.success("Time blocks exported")
		return true
	}

	/**
	 * Get focus time for date
	 */
	const getFocusTimeForDate = (date: Date): number => {
		const dateStr = date.toISOString().split("T")[0]
		let focusMinutes = 0

		for (const block of timeBlocks.value) {
			if (block.type === "focus" && block.start.startsWith(dateStr)) {
				const start = new Date(block.start)
				const end = new Date(block.end)
				focusMinutes += (end.getTime() - start.getTime()) / (1000 * 60)
			}
		}

		return Math.round(focusMinutes)
	}

	/**
	 * Find free time slots
	 */
	const findFreeSlots = (date: Date, durationMinutes: number): { start: string; end: string }[] => {
		// Simplified: assumes 9 AM - 5 PM workday
		const workStart = new Date(date)
		workStart.setHours(9, 0, 0, 0)

		const workEnd = new Date(date)
		workEnd.setHours(17, 0, 0, 0)

		const slots: { start: string; end: string }[] = []
		let current = new Date(workStart)

		while (current < workEnd) {
			const slotEnd = new Date(current.getTime() + durationMinutes * 60000)

			// Check if this slot overlaps with any time block
			const overlaps = timeBlocks.value.some(block => {
				const blockStart = new Date(block.start)
				const blockEnd = new Date(block.end)
				return current < blockEnd && slotEnd > blockStart
			})

			if (!overlaps && slotEnd <= workEnd) {
				slots.push({
					start: current.toISOString(),
					end: slotEnd.toISOString(),
				})
			}

			current = new Date(current.getTime() + 30 * 60000) // Check every 30 min
		}

		return slots
	}

	return {
		timeBlocks: readonly(timeBlocks),
		connectedCalendars,
		isSyncing,
		createTimeBlock,
		deleteTimeBlock,
		connectCalendar,
		syncCalendars,
		exportToCalendar,
		getFocusTimeForDate,
		findFreeSlots,
	}
}
