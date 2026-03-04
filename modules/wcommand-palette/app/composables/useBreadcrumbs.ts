import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Command } from '../types'

export interface UseBreadcrumbsReturn {
	/** Breadcrumb stack */
	breadcrumbs: Ref<{ id: string; title: string }[]>
	/** Push new breadcrumb */
	push: (id: string, title: string) => void
	/** Pop breadcrumb */
	pop: () => void
	/** Go to specific breadcrumb level */
	goTo: (index: number) => void
	/** Clear all breadcrumbs */
	clear: () => void
	/** Current depth */
	depth: Ref<number>
	/** Whether in nested view */
	isNested: Ref<boolean>
	/** Get parent command context */
	getParentContext: () => string | undefined
}

export function useBreadcrumbs(): UseBreadcrumbsReturn {
	const breadcrumbs = ref<{ id: string; title: string }[]>([])
	const depth = ref(0)
	const isNested = ref(false)

	const push = (id: string, title: string) => {
		breadcrumbs.value.push({ id, title })
		depth.value = breadcrumbs.value.length
		isNested.value = depth.value > 0
	}

	const pop = () => {
		breadcrumbs.value.pop()
		depth.value = breadcrumbs.value.length
		isNested.value = depth.value > 0
	}

	const goTo = (index: number) => {
		if (index < 0) {
			breadcrumbs.value = []
		} else {
			breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
		}
		depth.value = breadcrumbs.value.length
		isNested.value = depth.value > 0
	}

	const clear = () => {
		breadcrumbs.value = []
		depth.value = 0
		isNested.value = false
	}

	const getParentContext = (): string | undefined => {
		if (breadcrumbs.value.length === 0) return undefined
		return breadcrumbs.value[breadcrumbs.value.length - 1].id
	}

	return {
		breadcrumbs,
		push,
		pop,
		goTo,
		clear,
		depth,
		isNested,
		getParentContext,
	}
}
