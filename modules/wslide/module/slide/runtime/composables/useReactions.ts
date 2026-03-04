import { ref, computed } from "vue";

export type EmojiType = "👍" | "❤️" | "🎉" | "🔥" | "👏" | "😮" | "🤔" | "👎";

export interface EmojiReaction {
	id: string;
	emoji: EmojiType;
	userId: string;
	userName: string;
	timestamp: Date;
	position?: { x: number; y: number };
}

export interface ReactionCount {
	emoji: EmojiType;
	count: number;
	recentUsers: string[];
}

export function useReactions() {
	const reactions = ref<EmojiReaction[]>([]);
	const wsConnection = ref<WebSocket | null>(null);
	const isConnected = ref(false);
	const showFloating = ref(true);

	const counts = computed<ReactionCount[]>(() => {
		const map = new Map<EmojiType, ReactionCount>();
		
		for (const reaction of reactions.value) {
			const existing = map.get(reaction.emoji);
			if (existing) {
				existing.count++;
				if (!existing.recentUsers.includes(reaction.userName)) {
					existing.recentUsers.push(reaction.userName);
				}
				if (existing.recentUsers.length > 5) {
					existing.recentUsers.shift();
				}
			} else {
				map.set(reaction.emoji, {
					emoji: reaction.emoji,
					count: 1,
					recentUsers: [reaction.userName],
				});
			}
		}
		
		return Array.from(map.values()).sort((a, b) => b.count - a.count);
	});

	const totalReactions = computed(() => reactions.value.length);

	function connect(sessionId: string) {
		const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/wslide/reactions?session=${sessionId}`;
		
		wsConnection.value = new WebSocket(wsUrl);
		
		wsConnection.value.onopen = () => {
			isConnected.value = true;
		};
		
		wsConnection.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleMessage(data);
		};
		
		wsConnection.value.onclose = () => {
			isConnected.value = false;
		};
	}

	function handleMessage(data: { type: string; reaction?: EmojiReaction; reactions?: EmojiReaction[] }) {
		switch (data.type) {
			case "reactions_list":
				if (data.reactions) reactions.value = data.reactions;
				break;
			case "new_reaction":
				if (data.reaction) {
					reactions.value.push(data.reaction);
					if (showFloating.value) {
						animateFloatingEmoji(data.reaction);
					}
				}
				break;
			case "clear_reactions":
				reactions.value = [];
				break;
		}
	}

	function sendReaction(emoji: EmojiType, position?: { x: number; y: number }): void {
		wsConnection.value?.send(JSON.stringify({
			type: "send_reaction",
			emoji,
			position,
		}));
	}

	function animateFloatingEmoji(reaction: EmojiReaction) {
		// Animation handled by component
		const event = new CustomEvent("wslide:emoji-float", { detail: reaction });
		window.dispatchEvent(event);
	}

	function clearReactions(): void {
		wsConnection.value?.send(JSON.stringify({
			type: "clear_all",
		}));
	}

	function toggleFloating(): void {
		showFloating.value = !showFloating.value;
	}

	function disconnect(): void {
		wsConnection.value?.close();
		wsConnection.value = null;
		isConnected.value = false;
	}

	return {
		reactions: readonly(reactions),
		counts,
		totalReactions,
		isConnected: readonly(isConnected),
		showFloating: readonly(showFloating),
		connect,
		sendReaction,
		clearReactions,
		toggleFloating,
		disconnect,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
