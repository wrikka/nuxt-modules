import type { ReferralFunnel, RetargetingCampaign, RetargetingEvent } from "../types/new-features"

export function useReferralRetargeting() {
	const userFunnels = useState<Record<string, ReferralFunnel[]>>("user-funnels", () => ({}))
	const activeCampaigns = useState<RetargetingCampaign[]>("active-retargeting-campaigns", () => [])
	const retargetingEvents = useState<Record<string, RetargetingEvent[]>>("retargeting-events", () => ({}))

	async function trackFunnelProgress(
		userId: string,
		referralCode: string,
		stage: "link_clicked" | "landing_viewed" | "signup_started" | "signup_completed" | "purchase_made",
	): Promise<void> {
		await $fetch("/api/user-acquisition/retargeting/funnel/progress", {
			method: "POST",
			body: { userId, referralCode, stage },
		})

		const funnels = userFunnels.value[userId] || []
		const existingFunnel = funnels.find((f) => f.referralCode === referralCode)

		if (existingFunnel) {
			const stageIndex = existingFunnel.stages.findIndex((s) => s.stage === stage)
			if (stageIndex !== -1) {
				existingFunnel.stages[stageIndex].completed = true
				existingFunnel.stages[stageIndex].completedAt = new Date()
			}
			existingFunnel.currentStage = stageIndex
			existingFunnel.lastActivityAt = new Date()
		}
	}

	async function trackFunnelAbandonment(
		userId: string,
		referralCode: string,
		abandonedStage: string,
	): Promise<void> {
		await $fetch("/api/user-acquisition/retargeting/funnel/abandon", {
			method: "POST",
			body: { userId, referralCode, abandonedStage },
		})

		const funnels = userFunnels.value[userId] || []
		const existingFunnel = funnels.find((f) => f.referralCode === referralCode)

		if (existingFunnel) {
			const stageIndex = existingFunnel.stages.findIndex((s) => s.stage === abandonedStage)
			if (stageIndex !== -1) {
				existingFunnel.stages[stageIndex].abandonedAt = new Date()
			}
			existingFunnel.status = "abandoned"
		}
	}

	async function fetchUserFunnels(userId: string): Promise<ReferralFunnel[]> {
		const response = await $fetch<ReferralFunnel[]>(
			`/api/user-acquisition/retargeting/funnels/${userId}`,
		)
		userFunnels.value[userId] = response
		return response
	}

	async function createRetargetingCampaign(
		params: Omit<RetargetingCampaign, "id" | "metrics" | "createdAt">,
	): Promise<RetargetingCampaign> {
		const response = await $fetch<RetargetingCampaign>("/api/user-acquisition/retargeting/campaigns", {
			method: "POST",
			body: params,
		})
		activeCampaigns.value.push(response)
		return response
	}

	async function fetchActiveCampaigns(): Promise<RetargetingCampaign[]> {
		const response = await $fetch<RetargetingCampaign[]>(
			"/api/user-acquisition/retargeting/campaigns/active",
		)
		activeCampaigns.value = response
		return response
	}

	async function triggerRetargeting(
		campaignId: string,
		userId: string,
		funnelId: string,
	): Promise<void> {
		await $fetch(`/api/user-acquisition/retargeting/campaigns/${campaignId}/trigger`, {
			method: "POST",
			body: { userId, funnelId },
		})
	}

	async function trackRetargetingEvent(event: {
		campaignId: string
		userId: string
		funnelId: string
		stage: string
		eventType: "sent" | "opened" | "clicked" | "converted" | "bounced"
	}): Promise<void> {
		await $fetch("/api/user-acquisition/retargeting/events", {
			method: "POST",
			body: event,
		})

		if (!retargetingEvents.value[event.campaignId]) {
			retargetingEvents.value[event.campaignId] = []
		}

		retargetingEvents.value[event.campaignId].push({
			id: `re_${Date.now()}`,
			...event,
			createdAt: new Date(),
		})
	}

	function getAbandonedFunnels(userId: string, hoursAgo = 24): ReferralFunnel[] {
		const funnels = userFunnels.value[userId] || []
		const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)

		return funnels.filter(
			(f) =>
				f.status === "in_progress" &&
				f.lastActivityAt < cutoff &&
				f.currentStage < 3,
		)
	}

	function getFunnelConversionRate(referralCode: string): number {
		const allFunnels = Object.values(userFunnels.value).flat()
		const codeFunnels = allFunnels.filter((f) => f.referralCode === referralCode)

		if (codeFunnels.length === 0) return 0

		const converted = codeFunnels.filter((f) => f.status === "converted").length
		return Math.round((converted / codeFunnels.length) * 100)
	}

	async function getCampaignMetrics(campaignId: string): Promise<{
		sent: number
		opened: number
		clicked: number
		converted: number
		openRate: number
		clickRate: number
		conversionRate: number
	}> {
		const response = await $fetch<{
			sent: number
			opened: number
			clicked: number
			converted: number
			openRate: number
			clickRate: number
			conversionRate: number
		}>(`/api/user-acquisition/retargeting/campaigns/${campaignId}/metrics`)

		const campaign = activeCampaigns.value.find((c) => c.id === campaignId)
		if (campaign) {
			campaign.metrics = {
				sent: response.sent,
				opened: response.opened,
				clicked: response.clicked,
				converted: response.converted,
			}
		}

		return response
	}

	function getBestRetargetingTime(userId: string): { hour: number; day: number } {
		const events = Object.values(retargetingEvents.value).flat()
		const userEvents = events.filter((e) => e.userId === userId)

		if (userEvents.length === 0) {
			return { hour: 10, day: 2 }
		}

		const hourCounts = new Array(24).fill(0)
		const dayCounts = new Array(7).fill(0)

		for (const event of userEvents) {
			const date = new Date(event.createdAt)
			hourCounts[date.getHours()]++
			dayCounts[date.getDay()]++
		}

		const bestHour = hourCounts.indexOf(Math.max(...hourCounts))
		const bestDay = dayCounts.indexOf(Math.max(...dayCounts))

		return { hour: bestHour, day: bestDay }
	}

	async function pauseCampaign(campaignId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/retargeting/campaigns/${campaignId}/pause`, {
			method: "POST",
		})

		const campaign = activeCampaigns.value.find((c) => c.id === campaignId)
		if (campaign) {
			campaign.status = "paused"
		}
	}

	async function resumeCampaign(campaignId: string): Promise<void> {
		await $fetch(`/api/user-acquisition/retargeting/campaigns/${campaignId}/resume`, {
			method: "POST",
		})

		const campaign = activeCampaigns.value.find((c) => c.id === campaignId)
		if (campaign) {
			campaign.status = "active"
		}
	}

	return {
		userFunnels: readonly(userFunnels),
		activeCampaigns: readonly(activeCampaigns),
		retargetingEvents: readonly(retargetingEvents),
		trackFunnelProgress,
		trackFunnelAbandonment,
		fetchUserFunnels,
		createRetargetingCampaign,
		fetchActiveCampaigns,
		triggerRetargeting,
		trackRetargetingEvent,
		getAbandonedFunnels,
		getFunnelConversionRate,
		getCampaignMetrics,
		getBestRetargetingTime,
		pauseCampaign,
		resumeCampaign,
	}
}
