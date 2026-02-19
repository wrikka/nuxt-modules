import Fuse from 'fuse.js'
import type { Command, SearchResult } from '../types'

export interface SearchEngine {
	search: (query: string, commands: Command[]) => SearchResult[]
	updateIndex: (commands: Command[]) => void
}

export interface SearchOptions {
	keys?: string[]
	threshold?: number
	maxResults?: number
	includeScore?: boolean
}

const defaultOptions: SearchOptions = {
	keys: ['name', 'title', 'description', 'keywords'],
	threshold: 0.3,
	maxResults: 10,
	includeScore: true
}

export function createSearchEngine(options: SearchOptions = {}): SearchEngine {
	const opts = { ...defaultOptions, ...options }
	let fuse: Fuse<Command> | null = null

	const updateIndex = (commands: Command[]): void => {
		fuse = new Fuse(commands, {
			keys: opts.keys!,
			threshold: opts.threshold!,
			includeScore: opts.includeScore!
		})
	}

	const search = (query: string, commands: Command[]): SearchResult[] => {
		if (!query.trim()) {
			return commands.map(cmd => ({ item: cmd, score: 1 }))
		}

		if (!fuse) {
			updateIndex(commands)
		}

		const results = fuse?.search(query) ?? []
		return results.slice(0, opts.maxResults).map(r => ({
			item: r.item,
			score: r.score ?? 1,
			matches: r.matches
		}))
	}

	return {
		search,
		updateIndex
	}
}
