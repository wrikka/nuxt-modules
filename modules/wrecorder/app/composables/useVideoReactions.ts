export interface Reaction {
	id: string;
	type: "like" | "love" | "wow" | "laugh" | "applause" | "fire" | "thumbs_up" | "thumbs_down";
	userId?: string;
	timestamp: number;
	x?: number;
	y?: number;
}

export interface ReactionState {
	reactions: Reaction[];
	isEnabled: boolean;
	displayDuration: number;
}

export const useVideoReactions = () => {
	const state = reactive<ReactionState>({
		reactions: [],
		isEnabled: true,
		displayDuration: 3000,
	});

	const reactionEmojis: Record<Reaction["type"], string> = {
		like: "❤️",
		love: "💖",
		wow: "😮",
		laugh: "😂",
		applause: "👏",
		fire: "🔥",
		thumbs_up: "👍",
		thumbs_down: "👎",
	};

	let cleanupInterval: ReturnType<typeof setInterval> | null = null;

	const startCleanup = () => {
		if (cleanupInterval) return;
		
		cleanupInterval = setInterval(() => {
			const now = Date.now();
			state.reactions = state.reactions.filter(
				r => now - r.timestamp < state.displayDuration
			);
		}, 1000);
	};

	const stopCleanup = () => {
		if (cleanupInterval) {
			clearInterval(cleanupInterval);
			cleanupInterval = null;
		}
	};

	const sendReaction = (
		type: Reaction["type"],
		userId?: string,
		x?: number,
		y?: number
	): string => {
		const id = `reaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		
		const reaction: Reaction = {
			id,
			type,
			userId,
			timestamp: Date.now(),
			x,
			y,
		};

		state.reactions.push(reaction);
		
		// Auto remove after display duration
		setTimeout(() => {
			state.reactions = state.reactions.filter(r => r.id !== id);
		}, state.displayDuration);

		return id;
	};

	const sendRandomReaction = (userId?: string): string => {
		const types = Object.keys(reactionEmojis) as Reaction["type"][];
		const randomType = types[Math.floor(Math.random() * types.length)];
		return sendReaction(randomType, userId);
	};

	const sendReactionAtPosition = (
		type: Reaction["type"],
		x: number,
		y: number,
		userId?: string
	): string => {
		return sendReaction(type, userId, x, y);
	};

	const setDisplayDuration = (duration: number) => {
		state.displayDuration = duration;
	};

	const enable = () => {
		state.isEnabled = true;
		startCleanup();
	};

	const disable = () => {
		state.isEnabled = false;
		stopCleanup();
		state.reactions = [];
	};

	const getReactionCount = (type?: Reaction["type"]): number => {
		if (!type) return state.reactions.length;
		return state.reactions.filter(r => r.type === type).length;
	};

	const getReactionStats = (): Record<Reaction["type"], number> => {
		const stats: Record<string, number> = {};
		
		Object.keys(reactionEmojis).forEach(type => {
			stats[type] = state.reactions.filter(r => r.type === type).length;
		});
		
		return stats as Record<Reaction["type"], number>;
	};

	const clearAll = () => {
		state.reactions = [];
	};

	// วาด reactions บน canvas
	const drawReactions = (ctx: CanvasRenderingContext2D) => {
		if (!state.isEnabled) return;

		const now = Date.now();
		
		state.reactions.forEach(reaction => {
			const age = now - reaction.timestamp;
			const progress = age / state.displayDuration;
			
			// Fade out as it ages
			const opacity = 1 - progress;
			
			// Floating animation
			const floatY = -progress * 50;
			
			ctx.save();
			ctx.globalAlpha = opacity;
			ctx.font = "24px serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			
			const x = reaction.x ?? Math.random() * ctx.canvas.width;
			const y = (reaction.y ?? ctx.canvas.height - 50) + floatY;
			
			ctx.fillText(reactionEmojis[reaction.type], x, y);
			ctx.restore();
		});
	};

	onMounted(() => {
		if (state.isEnabled) {
			startCleanup();
		}
	});

	onUnmounted(() => {
		stopCleanup();
	});

	return {
		state: readonly(state),
		reactions: computed(() => state.reactions),
		reactionEmojis: readonly(reactionEmojis),
		sendReaction,
		sendRandomReaction,
		sendReactionAtPosition,
		setDisplayDuration,
		enable,
		disable,
		getReactionCount,
		getReactionStats,
		clearAll,
		drawReactions,
	};
};
