import { defineEventHandler, getQuery } from "h3"

export default defineEventHandler(async (event) => {
	const query = getQuery(event)
	const { provider, repo, branch } = query

	// TODO: Fetch from Git provider API
	const mockCommits = [
		{
			sha: "abc123",
			message: "feat: initial commit",
			author: "user",
			date: new Date().toISOString(),
			url: `https://github.com/${repo}/commit/abc123`,
		},
	]

	return mockCommits
})
