<script setup lang="ts">
const emit = defineEmits<{
	(e: "close"): void;
	(e: "join", contestId: string): void;
}>();

interface Contest {
	id: string;
	title: string;
	description: string;
	category: string;
	prize: string;
	deadline: Date;
	participants: number;
	submissions: number;
	status: "active" | "upcoming" | "ended";
	thumbnail: string;
	sponsor?: string;
}

const activeTab = ref("active");

const contests = ref<Contest[]>([
	{
		id: "1",
		title: "Holiday Season Templates",
		description:
			"Create stunning templates for Christmas, New Year, and winter holidays. Focus on warm, festive designs.",
		category: "Seasonal",
		prize: "$1,000 + Pro Subscription",
		deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
		participants: 234,
		submissions: 156,
		status: "active",
		thumbnail: "https://picsum.photos/400/250?random=1",
		sponsor: "DesignPro",
	},
	{
		id: "2",
		title: "Minimalist Business Cards",
		description:
			"Design clean, professional business card templates that make a lasting impression.",
		category: "Business",
		prize: "$500",
		deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		participants: 189,
		submissions: 98,
		status: "active",
		thumbnail: "https://picsum.photos/400/250?random=2",
	},
	{
		id: "3",
		title: "Social Media Campaign Kit",
		description:
			"Build a complete 10-post campaign template set for Instagram product launches.",
		category: "Social Media",
		prize: "$750 + Featured Placement",
		deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
		participants: 312,
		submissions: 145,
		status: "active",
		thumbnail: "https://picsum.photos/400/250?random=3",
	},
	{
		id: "4",
		title: "Summer Vibes Poster",
		description:
			"Create eye-catching summer event posters with tropical themes.",
		category: "Events",
		prize: "$300",
		deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		participants: 0,
		submissions: 0,
		status: "upcoming",
		thumbnail: "https://picsum.photos/400/250?random=4",
	},
	{
		id: "5",
		title: "Eco-Friendly Packaging",
		description:
			"Design sustainable packaging templates for eco-conscious brands.",
		category: "Product",
		prize: "$1,500",
		deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
		participants: 567,
		submissions: 342,
		status: "ended",
		thumbnail: "https://picsum.photos/400/250?random=5",
	},
]);

const filteredContests = computed(() => {
	return contests.value.filter(c => c.status === activeTab.value);
});

const userStats = {
	contestsJoined: 3,
	submissions: 5,
	wins: 1,
	rank: 42,
};

const formatDeadline = (date: Date) => {
	const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
	if (days < 0) return "Ended";
	if (days === 0) return "Ends today";
	if (days === 1) return "1 day left";
	return `${days} days left`;
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-trophy text-yellow-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Template Contests
							</h2>
							<p class="text-sm text-gray-500">
								Compete, create, and win prizes
							</p>
						</div>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- User Stats -->
				<div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600">
					<div class="flex items-center justify-center gap-12 text-white">
						<div class="text-center">
							<div class="text-2xl font-bold">
								{{ userStats.contestsJoined }}
							</div>
							<div class="text-sm opacity-80">Contests Joined</div>
						</div>
						<div class="text-center">
							<div class="text-2xl font-bold">{{ userStats.submissions }}</div>
							<div class="text-sm opacity-80">Submissions</div>
						</div>
						<div class="text-center">
							<div class="text-2xl font-bold">{{ userStats.wins }}</div>
							<div class="text-sm opacity-80">Wins</div>
						</div>
						<div class="text-center">
							<div class="text-2xl font-bold">#{{ userStats.rank }}</div>
							<div class="text-sm opacity-80">Your Rank</div>
						</div>
					</div>
				</div>

				<!-- Tabs -->
				<div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
					<div class="flex gap-2">
						<button
							v-for='tab in ["active", "upcoming", "ended"]'
							:key="tab"
							class="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
							:class="activeTab === tab
							? 'bg-blue-600 text-white'
							: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'"
							@click="activeTab = tab"
						>
							{{ tab }}
							<span
								class="ml-1 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs"
							>
								{{ contests.filter(c => c.status === tab).length }}
							</span>
						</button>
					</div>
				</div>

				<!-- Content -->
				<div class="flex-1 overflow-y-auto p-6">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div
							v-for="contest in filteredContests"
							:key="contest.id"
							class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
						>
							<div class="relative">
								<img
									:src="contest.thumbnail"
									class="w-full h-40 object-cover"
								/>
								<div class="absolute top-3 left-3">
									<span
										class="px-2 py-1 bg-white/90 dark:bg-black/70 text-gray-800 dark:text-white text-xs rounded-full font-medium"
									>
										{{ contest.category }}
									</span>
								</div>
								<div v-if="contest.sponsor" class="absolute top-3 right-3">
									<span
										class="px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
									>
										Sponsored by {{ contest.sponsor }}
									</span>
								</div>
							</div>

							<div class="p-5">
								<div class="flex items-center justify-between mb-2">
									<h3 class="font-semibold text-gray-900 dark:text-white">
										{{ contest.title }}
									</h3>
								</div>
								<p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
									{{ contest.description }}
								</p>

								<div class="flex items-center gap-4 mb-4 text-sm">
									<div class="flex items-center gap-1 text-gray-500">
										<i class="i-mdi-account-group" />
										{{ contest.participants }}
									</div>
									<div class="flex items-center gap-1 text-gray-500">
										<i class="i-mdi-file-document" />
										{{ contest.submissions }}
									</div>
									<div
										class="flex items-center gap-1"
										:class="contest.status === 'active'
										? 'text-orange-500'
										: 'text-gray-500'"
									>
										<i class="i-mdi-clock" />
										{{ formatDeadline(contest.deadline) }}
									</div>
								</div>

								<div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl mb-4">
									<div class="flex items-center gap-2">
										<i class="i-mdi-trophy text-yellow-600" />
										<span
											class="font-medium text-yellow-800 dark:text-yellow-400"
										>{{ contest.prize }}</span>
									</div>
								</div>

								<button
									v-if="contest.status === 'active'"
									class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
									@click="emit('join', contest.id)"
								>
									Join Contest
								</button>
								<button
									v-else-if="contest.status === 'upcoming'"
									class="w-full py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium cursor-not-allowed"
									disabled
								>
									Coming Soon
								</button>
								<button
									v-else
									class="w-full py-2.5 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl font-medium"
								>
									View Results
								</button>
							</div>
						</div>
					</div>

					<!-- Empty State -->
					<div v-if="filteredContests.length === 0" class="text-center py-12">
						<i class="i-mdi-trophy-outline text-4xl text-gray-400 mb-4" />
						<p class="text-gray-500">
							No {{ activeTab }} contests at the moment
						</p>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
