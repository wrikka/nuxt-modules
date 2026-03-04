import simpleGit from 'simple-git'

export async function useGitLastUpdated(path: string): Promise<string | null> {
  try {
    const git = simpleGit()
    const log = await git.log({ file: path, n: 1 })
    return log.latest?.date || null
  } catch {
    return null
  }
}

export function useLastUpdated(date: string | Date | null): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
