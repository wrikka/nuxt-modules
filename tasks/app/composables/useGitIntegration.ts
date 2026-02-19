import type { GitHubCommit, GitHubPR, GitIntegration } from "../../shared/types/integration"
import { readonly, ref } from "vue"

export function useGitIntegration() {
	const linkedRepos = ref<GitIntegration[]>([])
	const isLoading = ref(false)
	const error = ref<Error | null>(null)

	async function linkRepository(provider: "github" | "gitlab" | "bitbucket", repo: string, token: string): Promise<void> {
		isLoading.value = true
		try {
			const response = await $fetch(`/api/integrations/git/link`, {
				method: "POST",
				body: { provider, repository: repo, token },
			})
			linkedRepos.value.push(response as GitIntegration)
		}
		catch (e) {
			error.value = e as Error
			throw e
		}
		finally {
			isLoading.value = false
		}
	}

	async function unlinkRepository(provider: string, repo: string): Promise<void> {
		await $fetch(`/api/integrations/git/unlink`, {
			method: "POST",
			body: { provider, repository: repo },
		})
		linkedRepos.value = linkedRepos.value.filter(r => !(r.provider === provider && r.repository === repo))
	}

	async function fetchCommits(provider: string, repo: string, branch?: string): Promise<GitHubCommit[]> {
		return await $fetch(`/api/integrations/git/${provider}/${repo}/commits`, {
			params: { branch },
		})
	}

	async function fetchPRs(provider: string, repo: string, state?: string): Promise<GitHubPR[]> {
		return await $fetch(`/api/integrations/git/${provider}/${repo}/pulls`, {
			params: { state },
		})
	}

	async function linkCommitToTask(taskId: string, commitSha: string, provider: string, repo: string): Promise<void> {
		await $fetch(`/api/integrations/git/link-commit`, {
			method: "POST",
			body: { taskId, commitSha, provider, repository: repo },
		})
	}

	async function linkPRToTask(taskId: string, prNumber: number, provider: string, repo: string): Promise<void> {
		await $fetch(`/api/integrations/git/link-pr`, {
			method: "POST",
			body: { taskId, prNumber, provider, repository: repo },
		})
	}

	return {
		linkedRepos: readonly(linkedRepos),
		isLoading: readonly(isLoading),
		error: readonly(error),
		linkRepository,
		unlinkRepository,
		fetchCommits,
		fetchPRs,
		linkCommitToTask,
		linkPRToTask,
	}
}
