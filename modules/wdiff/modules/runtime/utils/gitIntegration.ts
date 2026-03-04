import type { DiffChunk, DiffLine } from '../types'

export interface GitProviderConfig {
  provider: 'github' | 'gitlab' | 'bitbucket' | 'gitea'
  baseUrl: string
  token: string
  owner: string
  repo: string
}

export interface GitDiffOptions {
  base?: string
  head?: string
  path?: string
}

export interface GitFile {
  path: string
  status: 'added' | 'deleted' | 'modified' | 'renamed' | 'copied'
  additions: number
  deletions: number
  patch?: string
  previousPath?: string
}

export interface GitCommit {
  sha: string
  message: string
  author: string
  date: string
  stats: {
    additions: number
    deletions: number
  }
}

/**
 * GitHub integration
 */
export class GitHubIntegration {
  private config: GitProviderConfig

  constructor(config: GitProviderConfig) {
    this.config = config
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.config.baseUrl}/repos/${this.config.owner}/${this.config.repo}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getPullRequestDiff(prNumber: number): Promise<GitFile[]> {
    const files = await this.request<GitFile[]>(`/pulls/${prNumber}/files`)
    return files
  }

  async getCommitDiff(sha: string): Promise<GitFile[]> {
    const files = await this.request<GitFile[]>(`/commits/${sha}`)
    return (files as unknown as { files: GitFile[] }).files || []
  }

  async compareCommits(base: string, head: string): Promise<{ files: GitFile[]; commits: GitCommit[] }> {
    const result = await this.request<{ files: GitFile[]; commits: GitCommit[] }>(`/compare/${base}...${head}`)
    return result
  }

  async getFileContent(path: string, ref: string = 'HEAD'): Promise<string> {
    const result = await this.request<{ content: string; encoding: string }>(`/contents/${path}?ref=${ref}`)
    
    if (result.encoding === 'base64') {
      return atob(result.content)
    }
    
    return result.content
  }

  async createPullRequestComment(
    prNumber: number,
    body: string,
    commitId: string,
    path: string,
    line?: number
  ): Promise<void> {
    const endpoint = `/pulls/${prNumber}/comments`
    
    const payload: Record<string, unknown> = {
      body,
      commit_id: commitId,
      path,
    }

    if (line) {
      payload.line = line
      payload.side = 'RIGHT'
    }

    await fetch(`${this.config.baseUrl}/repos/${this.config.owner}/${this.config.repo}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  async getRepositoryInfo(): Promise<{ defaultBranch: string; private: boolean }> {
    const result = await this.request<{ default_branch: string; private: boolean }>('')
    return {
      defaultBranch: result.default_branch,
      private: result.private,
    }
  }
}

/**
 * GitLab integration
 */
export class GitLabIntegration {
  private config: GitProviderConfig

  constructor(config: GitProviderConfig) {
    this.config = config
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.config.baseUrl}/api/v4/projects/${encodeURIComponent(`${this.config.owner}/${this.config.repo}`)}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Private-Token': this.config.token,
      },
    })

    if (!response.ok) {
      throw new Error(`GitLab API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getMergeRequestDiff(mrNumber: number): Promise<GitFile[]> {
    const changes = await this.request<Array<{ old_path: string; new_path: string; diff: string }>>(`/merge_requests/${mrNumber}/changes`)
    
    return changes.map((change) => ({
      path: change.new_path,
      previousPath: change.old_path,
      status: this.detectStatus(change),
      additions: 0,
      deletions: 0,
      patch: change.diff,
    }))
  }

  async getCommitDiff(sha: string): Promise<GitFile[]> {
    const diffs = await this.request<Array<{ old_path: string; new_path: string; diff: string }>>(`/repository/commits/${sha}/diff`)
    
    return diffs.map((diff) => ({
      path: diff.new_path,
      previousPath: diff.old_path,
      status: this.detectStatus(diff),
      additions: 0,
      deletions: 0,
      patch: diff.diff,
    }))
  }

  async compareCommits(sourceBranch: string, targetBranch: string): Promise<{ files: GitFile[] }> {
    const result = await this.request<{ diffs: Array<{ old_path: string; new_path: string; diff: string }> }>(`/repository/compare?from=${targetBranch}&to=${sourceBranch}`)
    
    return {
      files: result.diffs.map((diff) => ({
        path: diff.new_path,
        previousPath: diff.old_path,
        status: this.detectStatus(diff),
        additions: 0,
        deletions: 0,
        patch: diff.diff,
      })),
    }
  }

  async getFileContent(path: string, ref: string = 'HEAD'): Promise<string> {
    const result = await this.request<{ content: string }>(`/repository/files/${encodeURIComponent(path)}/raw?ref=${ref}`)
    return result.content || String(result)
  }

  private detectStatus(change: { old_path: string; new_path: string }): GitFile['status'] {
    if (change.old_path === change.new_path) {
      return 'modified'
    } else if (change.old_path === '/dev/null') {
      return 'added'
    } else if (change.new_path === '/dev/null') {
      return 'deleted'
    } else {
      return 'renamed'
    }
  }
}

/**
 * Generic Git integration factory
 */
export const createGitIntegration = (config: GitProviderConfig) => {
  switch (config.provider) {
    case 'github':
      return new GitHubIntegration(config)
    case 'gitlab':
      return new GitLabIntegration(config)
    default:
      throw new Error(`Unsupported provider: ${config.provider}`)
  }
}

/**
 * Convert Git patch to DiffChunk format
 */
export const parseGitPatch = (patch: string, oldPath: string, newPath: string): DiffChunk[] => {
  const chunks: DiffChunk[] = []
  const lines = patch.split('\n')
  
  let currentChunk: DiffChunk | null = null
  
  for (const line of lines) {
    // Chunk header
    const chunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/)
    
    if (chunkMatch) {
      if (currentChunk) {
        chunks.push(currentChunk)
      }
      
      const oldStart = parseInt(chunkMatch[1], 10)
      const oldLines = parseInt(chunkMatch[2] || '1', 10)
      const newStart = parseInt(chunkMatch[3], 10)
      const newLines = parseInt(chunkMatch[4] || '1', 10)
      
      currentChunk = {
        oldStart,
        oldLines,
        newStart,
        newLines,
        lines: [],
      }
      
      continue
    }
    
    if (!currentChunk) continue
    
    // Line changes
    if (line.startsWith('+')) {
      currentChunk.lines.push({
        oldLineNumber: null,
        newLineNumber: currentChunk.newStart + currentChunk.lines.filter((l) => l.type === 'added').length,
        type: 'added',
        content: line.slice(1),
      })
    } else if (line.startsWith('-')) {
      currentChunk.lines.push({
        oldLineNumber: currentChunk.oldStart + currentChunk.lines.filter((l) => l.type === 'deleted').length,
        newLineNumber: null,
        type: 'deleted',
        content: line.slice(1),
      })
    } else if (line.startsWith(' ')) {
      currentChunk.lines.push({
        oldLineNumber: currentChunk.oldStart + currentChunk.lines.filter((l) => l.type === 'unchanged').length,
        newLineNumber: currentChunk.newStart + currentChunk.lines.filter((l) => l.type === 'unchanged').length,
        type: 'unchanged',
        content: line.slice(1),
      })
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk)
  }
  
  return chunks
}

/**
 * Webhook handler for Git events
 */
export interface GitWebhookPayload {
  event: 'push' | 'pull_request' | 'merge_request' | 'commit_comment'
  repository: string
  ref?: string
  commits?: GitCommit[]
  pullRequest?: {
    number: number
    title: string
    sourceBranch: string
    targetBranch: string
  }
  sender: string
}

export const parseGitWebhook = (headers: Headers, body: unknown): GitWebhookPayload => {
  const event = headers.get('x-github-event') || headers.get('x-gitlab-event') || 'unknown'
  const payload = body as Record<string, unknown>
  
  if (event === 'pull_request' || event === 'Merge Request Hook') {
    return {
      event: 'pull_request',
      repository: (payload.repository as { full_name: string })?.full_name || '',
      pullRequest: {
        number: (payload.pull_request as { number: number })?.number || (payload.object_attributes as { iid: number })?.iid || 0,
        title: (payload.pull_request as { title: string })?.title || (payload.object_attributes as { title: string })?.title || '',
        sourceBranch: (payload.pull_request as { head: { ref: string } })?.head?.ref || (payload.object_attributes as { source_branch: string })?.source_branch || '',
        targetBranch: (payload.pull_request as { base: { ref: string } })?.base?.ref || (payload.object_attributes as { target_branch: string })?.target_branch || '',
      },
      sender: (payload.sender as { login: string })?.login || (payload.user as { username: string })?.username || '',
    }
  }
  
  if (event === 'push' || event === 'Push Hook') {
    return {
      event: 'push',
      repository: (payload.repository as { full_name: string })?.full_name || '',
      ref: (payload as { ref: string }).ref,
      commits: ((payload as { commits: unknown[] }).commits || []).map((commit) => ({
        sha: (commit as { id: string }).id || (commit as { sha: string }).sha || '',
        message: (commit as { message: string }).message || '',
        author: (commit as { author: { name: string } }).author?.name || '',
        date: (commit as { timestamp: string }).timestamp || new Date().toISOString(),
        stats: { additions: 0, deletions: 0 },
      })),
      sender: (payload.pusher as { name: string })?.name || (payload.user_name as string) || '',
    }
  }
  
  return {
    event: 'push',
    repository: '',
    sender: '',
  }
}

/**
 * Diff status calculator
 */
export const calculateDiffStats = (chunks: DiffChunk[]): { additions: number; deletions: number; changes: number } => {
  let additions = 0
  let deletions = 0
  
  for (const chunk of chunks) {
    for (const line of chunk.lines) {
      if (line.type === 'added') additions++
      if (line.type === 'deleted') deletions++
    }
  }
  
  return {
    additions,
    deletions,
    changes: additions + deletions,
  }
}

/**
 * Generate review summary
 */
export const generateReviewSummary = (files: GitFile[]): {
  totalFiles: number
  totalAdditions: number
  totalDeletions: number
  filesByStatus: Record<string, number>
} => {
  const filesByStatus: Record<string, number> = {}
  let totalAdditions = 0
  let totalDeletions = 0
  
  for (const file of files) {
    filesByStatus[file.status] = (filesByStatus[file.status] || 0) + 1
    totalAdditions += file.additions
    totalDeletions += file.deletions
  }
  
  return {
    totalFiles: files.length,
    totalAdditions,
    totalDeletions,
    filesByStatus,
  }
}
