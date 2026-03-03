<script setup lang="ts">
import { useGitIntegration } from "../../composables/useGitIntegration"
import type { GitHubCommit, GitHubPR } from "../../../shared/types/integration"

const props = defineProps<{
	taskId: string
}>()

const { linkedRepos, fetchCommits, fetchPRs, linkCommitToTask, linkPRToTask } = useGitIntegration()

const showLinkRepo = ref(false)
const selectedRepo = ref("")
const commits = ref<GitHubCommit[]>([])
const pullRequests = ref<GitHubPR[]>([])
const activeTab = ref<"commits" | "prs">("commits")

async function loadRepoData(repo: string) {
	selectedRepo.value = repo
	const [commitData, prData] = await Promise.all([
		fetchCommits("github", repo),
		fetchPRs("github", repo),
	])
	commits.value = commitData
	pullRequests.value = prData
}

async function linkCommit(commit: GitHubCommit) {
	await linkCommitToTask(props.taskId, commit.sha, "github", selectedRepo.value)
}

async function linkPR(pr: GitHubPR) {
	await linkPRToTask(props.taskId, pr.number, "github", selectedRepo.value)
}

function getPRStateColor(state: string): string {
	const colors: Record<string, string> = {
		open: "text-green-500",
		closed: "text-red-500",
		merged: "text-purple-500",
	}
	return colors[state] || "text-gray-500"
}
</script>

<template>
	<div class="git-integration-panel">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-semibold">
				<span class="i-simple-icons-github mr-2" />
				Git Integration
			</h3>
			<button
				class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
				@click="showLinkRepo = true"
			>
				Link Repository
			</button>
		</div>

		<div v-if="linkedRepos.length === 0" class="text-gray-500 text-center py-8">
			No repositories linked
		</div>

		<div v-else class="space-y-4">
			<div class="flex gap-2 mb-4">
				<button
					v-for="repo in linkedRepos"
					:key="repo.repository"
					class="px-3 py-1 text-sm rounded"
					:class="selectedRepo === repo.repository ? 'bg-blue-500 text-white' : 'bg-gray-100'"
					@click="loadRepoData(repo.repository)"
				>
					{{ repo.provider }}/{{ repo.repository }}
				</button>
			</div>

			<div class="flex gap-2 border-b mb-4">
				<button
					class="px-4 py-2"
					:class="activeTab === 'commits' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'"
					@click="activeTab = 'commits'"
				>
					Commits
				</button>
				<button
					class="px-4 py-2"
					:class="activeTab === 'prs' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'"
					@click="activeTab = 'prs'"
				>
					Pull Requests
				</button>
			</div>

			<div v-if="activeTab === 'commits'" class="space-y-2">
				<div
					v-for="commit in commits"
					:key="commit.sha"
					class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
				>
					<div class="flex-1 min-w-0">
						<p class="font-medium truncate">{{ commit.message }}</p>
						<p class="text-sm text-gray-500">
							{{ commit.author }} · {{ commit.sha.slice(0, 7) }}
						</p>
					</div>
					<button
						class="ml-2 text-blue-500 hover:text-blue-700"
						@click="linkCommit(commit)"
					>
						Link
					</button>
				</div>
			</div>

			<div v-else class="space-y-2">
				<div
					v-for="pr in pullRequests"
					:key="pr.id"
					class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
				>
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span :class="getPRStateColor(pr.state)">
								<span v-if="pr.state === 'open'" class="i-lucide-git-pull-request" />
								<span v-else-if="pr.state === 'merged'" class="i-lucide-git-merge" />
								<span v-else class="i-lucide-git-pull-request-closed" />
							</span>
							<p class="font-medium truncate">#{{ pr.number }} {{ pr.title }}</p>
						</div>
						<p class="text-sm text-gray-500">
							{{ pr.author }} · {{ pr.branch }} → {{ pr.baseBranch }}
						</p>
					</div>
					<button
						class="ml-2 text-blue-500 hover:text-blue-700"
						@click="linkPR(pr)"
					>
						Link
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
