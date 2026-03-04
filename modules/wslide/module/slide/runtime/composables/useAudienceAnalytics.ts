import { ref, computed, onMounted, onUnmounted } from "vue";
import type { PresenterState } from "#wslide/types";

export interface AudienceMember {
	id: string;
	name: string;
	joinedAt: Date;
	isActive: boolean;
	lastActivity: Date;
}

export interface EngagementMetrics {
	attentionScore: number;
	interactionRate: number;
	responseTime: number;
	participationLevel: "high" | "medium" | "low";
}

export interface SlideAnalytics {
	slideIndex: number;
	viewCount: number;
	avgTimeSpent: number;
	engagementScore: number;
	exitPoints: number;
}

export function useAudienceAnalytics() {
	const audienceMembers = ref<AudienceMember[]>([]);
	const currentEngagement = ref<EngagementMetrics>({
		attentionScore: 0,
		interactionRate: 0,
		responseTime: 0,
		participationLevel: "low",
	});
	const slideStats = ref<SlideAnalytics[]>([]);
	const isTracking = ref(false);
	const wsConnection = ref<WebSocket | null>(null);

	const totalAudience = computed(() => audienceMembers.value.length);
	const activeAudience = computed(() => 
		audienceMembers.value.filter(m => m.isActive).length
	);
	const avgEngagement = computed(() => 
		slideStats.value.reduce((sum, s) => sum + s.engagementScore, 0) / 
		(slideStats.value.length || 1)
	);

	function startTracking(sessionId: string) {
		isTracking.value = true;
		connectWebSocket(sessionId);
		startHeartbeat();
	}

	function connectWebSocket(sessionId: string) {
		const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/wslide/analytics?session=${sessionId}`;
		
		wsConnection.value = new WebSocket(wsUrl);
		
		wsConnection.value.onmessage = (event) => {
			const data = JSON.parse(event.data);
			handleAnalyticsData(data);
		};
	}

	function handleAnalyticsData(data: unknown) {
		if (typeof data !== "object" || data === null) return;
		
		const d = data as { 
			type: string; 
			member?: AudienceMember; 
			metrics?: EngagementMetrics;
			slideStats?: SlideAnalytics;
		};
		
		switch (d.type) {
			case "member_joined":
				if (d.member) addMember(d.member);
				break;
			case "member_left":
				if (d.member) removeMember(d.member.id);
				break;
			case "engagement_update":
				if (d.metrics) updateEngagement(d.metrics);
				break;
			case "slide_analytics":
				if (d.slideStats) recordSlideStats(d.slideStats);
				break;
		}
	}

	function addMember(member: AudienceMember) {
		const exists = audienceMembers.value.find(m => m.id === member.id);
		if (!exists) {
			audienceMembers.value.push({
				...member,
				joinedAt: new Date(member.joinedAt),
				lastActivity: new Date(member.lastActivity),
			});
		}
	}

	function removeMember(memberId: string) {
		const index = audienceMembers.value.findIndex(m => m.id === memberId);
		if (index > -1) {
			audienceMembers.value.splice(index, 1);
		}
	}

	function updateEngagement(metrics: EngagementMetrics) {
		currentEngagement.value = metrics;
	}

	function recordSlideStats(stats: SlideAnalytics) {
		const existing = slideStats.value.find(s => s.slideIndex === stats.slideIndex);
		if (existing) {
			Object.assign(existing, stats);
		} else {
			slideStats.value.push(stats);
		}
	}

	function trackSlideView(slideIndex: number) {
		if (!isTracking.value) return;
		
		wsConnection.value?.send(JSON.stringify({
			type: "slide_view",
			slideIndex,
			timestamp: Date.now(),
			audienceCount: activeAudience.value,
		}));
	}

	function trackInteraction(type: string, data?: Record<string, unknown>) {
		if (!isTracking.value) return;
		
		wsConnection.value?.send(JSON.stringify({
			type: "interaction",
			interactionType: type,
			data,
			timestamp: Date.now(),
		}));
	}

	let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
	
	function startHeartbeat() {
		heartbeatInterval = setInterval(() => {
			audienceMembers.value.forEach(member => {
				const inactiveTime = Date.now() - new Date(member.lastActivity).getTime();
				member.isActive = inactiveTime < 30000;
			});
		}, 10000);
	}

	function stopTracking() {
		isTracking.value = false;
		wsConnection.value?.close();
		if (heartbeatInterval) {
			clearInterval(heartbeatInterval);
			heartbeatInterval = null;
		}
	}

	function getHeatmapData(): number[] {
		return slideStats.value.map(s => s.engagementScore);
	}

	function getTopEngagedSlides(limit = 5): SlideAnalytics[] {
		return [...slideStats.value]
			.sort((a, b) => b.engagementScore - a.engagementScore)
			.slice(0, limit);
	}

	function exportAnalytics(): Record<string, unknown> {
		return {
			audienceCount: totalAudience.value,
			activeAudience: activeAudience.value,
			avgEngagement: avgEngagement.value,
			slideStats: slideStats.value,
			engagement: currentEngagement.value,
			exportedAt: new Date().toISOString(),
		};
	}

	onUnmounted(() => {
		stopTracking();
	});

	return {
		audienceMembers: readonly(audienceMembers),
		currentEngagement: readonly(currentEngagement),
		slideStats: readonly(slideStats),
		isTracking: readonly(isTracking),
		totalAudience,
		activeAudience,
		avgEngagement,
		startTracking,
		stopTracking,
		trackSlideView,
		trackInteraction,
		getHeatmapData,
		getTopEngagedSlides,
		exportAnalytics,
	};
}

function readonly<T>(ref: { value: T }) {
	return computed(() => ref.value);
}
