import type { GanttData, ChartData } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Gantt chart utilities and data generation
 */

/**
 * Generate Gantt chart data from tasks
 */
export function generateGanttData(
	tasks: Array<{
		id: string;
		name: string;
		start: Date;
		end: Date;
		progress?: number;
		dependencies?: string[];
		color?: string;
		category?: string;
	}>,
	options: {
		title?: string;
		showProgress?: boolean;
		showDependencies?: boolean;
		sortByStartDate?: boolean;
		groupByCategory?: boolean;
	} = {},
): GanttData {
	const {
		title,
		showProgress = true,
		showDependencies = false,
		sortByStartDate = true,
		groupByCategory = false,
	} = options;

	// Sort tasks by start date if requested
	let sortedTasks = tasks;
	if (sortByStartDate) {
		sortedTasks = [...tasks].sort(
			(a, b) => a.start.getTime() - b.start.getTime(),
		);
	}

	// Group by category if requested
	if (groupByCategory) {
		const groupedTasks: Record<string, typeof tasks> = {};
		sortedTasks.forEach((task) => {
			const category = task.category || "General";
			if (!groupedTasks[category]) {
				groupedTasks[category] = [];
			}
			groupedTasks[category].push(task);
		});

		// Convert grouped tasks to series
		const series = Object.entries(groupedTasks).map(
			([category, categoryTasks], categoryIndex) => ({
				name: category,
				data: categoryTasks.map((task, taskIndex) => ({
					x: task.name,
					y: [task.start.getTime(), task.end.getTime()], // Use timestamps for range
					label:
						showProgress && task.progress ? `${task.progress}%` : undefined,
					color: task.color || getSeriesColor(categoryIndex * 3 + taskIndex),
				})),
				type: "gantt" as const,
			}),
		);

		return {
			title,
			series,
			tasks: sortedTasks,
		};
	}

	// Single Gantt chart
	const chartData: ChartData = {
		title,
		series: [
			{
				name: "Tasks",
				data: sortedTasks.map((task, index) => ({
					x: task.name,
					y: [task.start.getTime(), task.end.getTime()],
					label:
						showProgress && task.progress !== undefined
							? `${task.progress}%`
							: undefined,
					color: task.color || getSeriesColor(index),
				})),
				type: "gantt",
			},
		],
	};

	return {
		...chartData,
		tasks: sortedTasks,
	};
}

/**
 * Generate Gantt chart from simplified task data
 */
export function generateGanttFromSimpleTasks(
	tasks: Array<{
		name: string;
		startDate: string;
		endDate: string;
		progress?: number;
		color?: string;
	}>,
	options: {
		title?: string;
		showProgress?: boolean;
	} = {},
): GanttData {
	const { title, showProgress = true } = options;

	const ganttTasks = tasks.map((task) => ({
		id: task.name.replace(/\s+/g, "-").toLowerCase(),
		name: task.name,
		start: new Date(task.startDate),
		end: new Date(task.endDate),
		progress: task.progress,
		color: task.color,
	}));

	return generateGanttData(ganttTasks, { title, showProgress });
}

/**
 * Calculate project timeline from Gantt tasks
 */
export function calculateProjectTimeline(
	tasks: Array<{ start: Date; end: Date }>,
): {
	projectStart: Date;
	projectEnd: Date;
	totalDays: number;
	workingDays: number;
} {
	if (tasks.length === 0) {
		const now = new Date();
		return {
			projectStart: now,
			projectEnd: now,
			totalDays: 0,
			workingDays: 0,
		};
	}

	const starts = tasks.map((t) => t.start);
	const ends = tasks.map((t) => t.end);

	const projectStart = new Date(Math.min(...starts.map((d) => d.getTime())));
	const projectEnd = new Date(Math.max(...ends.map((d) => d.getTime())));

	const totalDays = Math.ceil(
		(projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24),
	);

	// Calculate working days (excluding weekends)
	let workingDays = 0;
	for (
		let d = new Date(projectStart);
		d <= projectEnd;
		d.setDate(d.getDate() + 1)
	) {
		const dayOfWeek = d.getDay();
		if (dayOfWeek !== 0 && dayOfWeek !== 6) {
			// Not Saturday or Sunday
			workingDays++;
		}
	}

	return {
		projectStart,
		projectEnd,
		totalDays,
		workingDays,
	};
}

/**
 * Validate task dependencies
 */
export function validateTaskDependencies(
	tasks: Array<{ id: string; dependencies?: string[] }>,
): {
	valid: boolean;
	errors: string[];
	warnings: string[];
} {
	const errors: string[] = [];
	const warnings: string[] = [];
	const taskIds = new Set(tasks.map((t) => t.id));

	// Check for invalid dependencies
	tasks.forEach((task) => {
		if (task.dependencies) {
			task.dependencies.forEach((depId) => {
				if (!taskIds.has(depId)) {
					errors.push(`Task "${task.id}" has invalid dependency "${depId}"`);
				}
			});
		}
	});

	// Check for circular dependencies (simplified check)
	const visited = new Set<string>();
	const recursionStack = new Set<string>();

	function hasCircularDependency(taskId: string): boolean {
		if (recursionStack.has(taskId)) return true;
		if (visited.has(taskId)) return false;

		visited.add(taskId);
		recursionStack.add(taskId);

		const task = tasks.find((t) => t.id === taskId);
		if (task?.dependencies) {
			for (const depId of task.dependencies) {
				if (hasCircularDependency(depId)) {
					return true;
				}
			}
		}

		recursionStack.delete(taskId);
		return false;
	}

	tasks.forEach((task) => {
		if (hasCircularDependency(task.id)) {
			errors.push(`Circular dependency detected involving task "${task.id}"`);
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Generate critical path (simplified)
 */
export function calculateCriticalPath(
	tasks: Array<{
		id: string;
		name: string;
		start: Date;
		end: Date;
		dependencies?: string[];
	}>,
): {
	criticalTasks: string[];
	totalDuration: number;
} {
	// Simplified critical path calculation
	// In a real implementation, this would use proper CPM algorithm
	const taskMap = new Map(tasks.map((t) => [t.id, t]));
	const criticalTasks: string[] = [];

	// Find tasks with no dependencies (potential start tasks)
	const startTasks = tasks.filter(
		(t) => !t.dependencies || t.dependencies.length === 0,
	);

	// Simple approach: find the longest path
	let maxEndTime = 0;
	let criticalPath: string[] = [];

	startTasks.forEach((startTask) => {
		const path = [startTask.id];
		let currentEnd = startTask.end.getTime();

		// Follow dependencies
		let currentTask = startTask;
		while (true) {
			const dependentTasks = tasks.filter((t) =>
				t.dependencies?.includes(currentTask.id),
			);

			if (dependentTasks.length === 0) break;

			// For simplicity, pick the first dependent task
			// Real implementation would handle multiple paths
			currentTask = dependentTasks[0];
			path.push(currentTask.id);
			currentEnd = Math.max(currentEnd, currentTask.end.getTime());
		}

		if (currentEnd > maxEndTime) {
			maxEndTime = currentEnd;
			criticalPath = path;
		}
	});

	const totalDuration =
		maxEndTime - Math.min(...startTasks.map((t) => t.start.getTime()));
	const totalDays = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));

	return {
		criticalTasks: criticalPath,
		totalDuration: totalDays,
	};
}

/**
 * Generate Gantt chart with milestones
 */
export function generateGanttWithMilestones(
	tasks: Array<{
		id: string;
		name: string;
		start: Date;
		end: Date;
		progress?: number;
		dependencies?: string[];
		color?: string;
		isMilestone?: boolean;
	}>,
	milestones: Array<{
		name: string;
		date: Date;
		color?: string;
	}>,
	options: {
		title?: string;
		showProgress?: boolean;
	} = {},
): ChartData {
	const { title, showProgress = true } = options;

	const taskSeries = {
		name: "Tasks",
		data: tasks
			.filter((t) => !t.isMilestone)
			.map((task, index) => ({
				x: task.name,
				y: [task.start.getTime(), task.end.getTime()],
				label: showProgress && task.progress ? `${task.progress}%` : undefined,
				color: task.color || getSeriesColor(index),
			})),
		type: "gantt" as const,
	};

	const milestoneSeries = {
		name: "Milestones",
		data: [
			...tasks
				.filter((t) => t.isMilestone)
				.map((task, index) => ({
					x: task.name,
					y: [task.start.getTime(), task.start.getTime()], // Milestones are points in time
					color: task.color || "#FF5722",
				})),
			...milestones.map((milestone, index) => ({
				x: milestone.name,
				y: [milestone.date.getTime(), milestone.date.getTime()],
				color: milestone.color || "#4CAF50",
			})),
		],
		type: "gantt" as const,
	};

	return {
		title,
		series: [taskSeries, milestoneSeries],
	};
}


