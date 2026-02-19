import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { provider, repo, state } = query

	// TODO: Fetch from Git provider API
	const mockPRs = [
		{
			id: 1,
			number: 1,
			title: "feat: add new feature",
			state: "open",
			author: "user",
			branch: "feature-branch",
			baseBranch: "main",
			url: `https://github.com/${repo}/pull/1`,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	]

	return mockPRs
})
