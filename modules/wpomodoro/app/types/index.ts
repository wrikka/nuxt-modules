export interface PomodoroSettings {
	workDuration: number
	shortBreakDuration: number
	longBreakDuration: number
	longBreakInterval: number
	autoStartBreaks: boolean
	autoStartPomodoros: boolean
	enableAudio: boolean
	enableNotifications: boolean
	volume: number
}

export type TimerState = "idle" | "running" | "paused" | "completed"
export type TimerPhase = "work" | "shortBreak" | "longBreak"

export interface PomodoroSession {
	id: string
	taskId?: string
	taskName?: string
	phase: TimerPhase
	startedAt: Date
	completedAt?: Date
	duration: number
	completed: boolean
}

export interface PomodoroStats {
	totalPomodoros: number
	totalFocusTime: number
	currentStreak: number
	longestStreak: number
	dailyGoal: number
	weeklyGoal: number
	dailyProgress: number
	weeklyProgress: number
}

export interface DailyStats {
	date: string
	pomodoros: number
	focusTime: number
	tasks: string[]
}

export interface Soundscape {
	id: string
	name: string
	icon: string
	src: string
}

export interface KeyboardShortcut {
	key: string
	action: string
	description: string
}

export interface Task {
	id: string
	name: string
	pomodorosEstimated: number
	pomodorosCompleted: number
}
