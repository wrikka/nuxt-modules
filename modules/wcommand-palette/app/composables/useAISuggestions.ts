import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Command, SuggestionItem } from '../types'

export interface UseAISuggestionsReturn {
	/** AI suggestions */
	suggestions: Ref<SuggestionItem[]>
	/** Loading state */
	isLoading: Ref<boolean>
	/** Get AI suggestions for query */
	getSuggestions: (query: string, commands: Command[]) => SuggestionItem[]
	/** Analyze usage patterns and suggest */
	getSmartSuggestions: (recentCommands: string[], frequentCommands: string[]) => SuggestionItem[]
	/** Natural language processing */
	parseNaturalLanguage: (input: string) => { intent: string; args: Record<string, string> } | null
	/** Match natural language to command */
	matchNaturalLanguage: (input: string, commands: Command[]) => Command | null
}

export function useAISuggestions(): UseAISuggestionsReturn {
	const suggestions = ref<SuggestionItem[]>([])
	const isLoading = ref(false)

	// Common command patterns for NLP matching
	const patterns: { regex: RegExp; intent: string; extractArgs: (match: RegExpMatchArray) => Record<string, string> }[] = [
		{
			regex: /go\s+(?:to\s+)?(.+)/i,
			intent: 'navigate',
			extractArgs: (m) => ({ destination: m[1] }),
		},
		{
			regex: /open\s+(.+)/i,
			intent: 'open',
			extractArgs: (m) => ({ target: m[1] }),
		},
		{
			regex: /create\s+(?:new\s+)?(.+)/i,
			intent: 'create',
			extractArgs: (m) => ({ type: m[1] }),
		},
		{
			regex: /search\s+(?:for\s+)?(.+)/i,
			intent: 'search',
			extractArgs: (m) => ({ query: m[1] }),
		},
		{
			regex: /delete\s+(?:the\s+)?(.+)/i,
			intent: 'delete',
			extractArgs: (m) => ({ target: m[1] }),
		},
		{
			regex: /set\s+(?:the\s+)?(.+?)\s+(?:to\s+)?(.+)/i,
			intent: 'set',
			extractArgs: (m) => ({ property: m[1], value: m[2] }),
		},
		{
			regex: /show\s+(?:me\s+)?(?:all\s+)?(.+)/i,
			intent: 'list',
			extractArgs: (m) => ({ type: m[1] }),
		},
		{
			regex: /enable|turn on|activate\s+(.+)/i,
			intent: 'enable',
			extractArgs: (m) => ({ feature: m[1] }),
		},
		{
			regex: /disable|turn off|deactivate\s+(.+)/i,
			intent: 'disable',
			extractArgs: (m) => ({ feature: m[1] }),
		},
	]

	const parseNaturalLanguage = (input: string): { intent: string; args: Record<string, string> } | null => {
		for (const pattern of patterns) {
			const match = input.match(pattern.regex)
			if (match) {
				return {
					intent: pattern.intent,
					args: pattern.extractArgs(match),
				}
			}
		}
		return null
	}

	const matchNaturalLanguage = (input: string, commands: Command[]): Command | null => {
		const parsed = parseNaturalLanguage(input)
		if (!parsed) return null

		// Score commands based on match
		let bestMatch: Command | null = null
		let bestScore = 0

		for (const cmd of commands) {
			let score = 0

			// Check if command keywords match intent
			const cmdKeywords = [
				cmd.name.toLowerCase(),
				cmd.title.toLowerCase(),
				...(cmd.keywords?.map(k => k.toLowerCase()) || []),
			]

			// Intent match
			if (cmdKeywords.some(k => k.includes(parsed.intent))) {
				score += 10
			}

			// Argument matches
			for (const [key, value] of Object.entries(parsed.args)) {
				const valueLower = value.toLowerCase()
				if (cmdKeywords.some(k => k.includes(valueLower))) {
					score += 5
				}
				if (cmd.name.toLowerCase().includes(valueLower) ||
					cmd.title.toLowerCase().includes(valueLower)) {
					score += 8
				}
			}

			if (score > bestScore) {
				bestScore = score
				bestMatch = cmd
			}
		}

		return bestScore >= 10 ? bestMatch : null
	}

	const getSuggestions = (query: string, commands: Command[]): SuggestionItem[] => {
		if (!query.trim()) return []

		const items: SuggestionItem[] = []
		const queryLower = query.toLowerCase()

		// Check for natural language match first
		const nlMatch = matchNaturalLanguage(query, commands)
		if (nlMatch) {
			items.push({
				id: `nl-${nlMatch.id}`,
				type: 'ai',
				title: `Execute: ${nlMatch.title}`,
				description: `AI matched your query to this command`,
				icon: '🤖',
				command: nlMatch,
			})
		}

		// Find related commands based on fuzzy matching
		const relatedCommands = commands.filter(cmd => {
			const text = `${cmd.name} ${cmd.title} ${cmd.description || ''} ${cmd.keywords?.join(' ') || ''}`.toLowerCase()
			return text.includes(queryLower)
		})

		for (const cmd of relatedCommands.slice(0, 3)) {
			items.push({
				id: `suggest-${cmd.id}`,
				type: 'command',
				title: cmd.title,
				description: cmd.description,
				icon: cmd.icon,
				command: cmd,
			})
		}

		return items
	}

	const getSmartSuggestions = (recentCommands: string[], frequentCommands: string[]): SuggestionItem[] => {
		const items: SuggestionItem[] = []

		// Suggest based on time patterns (e.g., morning routines)
		const hour = new Date().getHours()
		if (hour >= 9 && hour <= 10) {
			items.push({
				id: 'ai-morning',
				type: 'ai',
				title: 'Morning routine',
				description: 'Start your day with common morning tasks',
				icon: '🌅',
			})
		}

		// Suggest based on recent usage patterns
		if (recentCommands.length > 0) {
			items.push({
				id: 'ai-recent',
				type: 'ai',
				title: 'Continue where you left off',
				description: `You recently used: ${recentCommands[0]}`,
				icon: '🔄',
			})
		}

		// Suggest frequent commands
		if (frequentCommands.length > 0) {
			items.push({
				id: 'ai-frequent',
				type: 'ai',
				title: 'Quick access',
				description: `Your most used: ${frequentCommands.slice(0, 3).join(', ')}`,
				icon: '⚡',
			})
		}

		return items
	}

	return {
		suggestions,
		isLoading,
		getSuggestions,
		getSmartSuggestions,
		parseNaturalLanguage,
		matchNaturalLanguage,
	}
}
