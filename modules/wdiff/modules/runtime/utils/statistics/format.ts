import type { DiffStatistics } from "../../types/diff-statistics";

export function formatStatistics(stats: DiffStatistics): string {
	return `
Diff Statistics:
- Additions: ${stats.additions}
- Deletions: ${stats.deletions}
- Updates: ${stats.updates}
- Total Changes: ${stats.totalChanges}
- Affected Paths: ${stats.affectedPaths.length}
- Changed Types: ${stats.changedTypes.join(", ")}
`.trim();
}













