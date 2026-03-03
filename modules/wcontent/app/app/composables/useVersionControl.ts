import type { ContentVersion, RollbackResult, VersionHistory } from "../../shared/types/version-control";

export function useVersionControl() {
	const createVersion = async (
		contentPath: string,
		content: string,
		metadata: Record<string, any>,
		authorId: string,
		authorName: string,
		changeDescription?: string,
	): Promise<ContentVersion> => {
		const response = await $fetch("/api/version-control/create", {
			method: "POST",
			body: {
				contentPath,
				content,
				metadata,
				authorId,
				authorName,
				changeDescription,
			},
		});
		return response as ContentVersion;
	};

	const getVersionHistory = async (contentPath: string): Promise<VersionHistory> => {
		const response = await $fetch("/api/version-control/history", {
			method: "GET",
			query: { path: contentPath },
		});
		return response as VersionHistory;
	};

	const getVersion = async (contentPath: string, versionNumber?: number): Promise<ContentVersion> => {
		const response = await $fetch("/api/version-control/version", {
			method: "GET",
			query: { path: contentPath, version: versionNumber },
		});
		return response as ContentVersion;
	};

	const rollback = async (contentPath: string, versionNumber: number): Promise<RollbackResult> => {
		const response = await $fetch("/api/version-control/rollback", {
			method: "POST",
			body: { contentPath, versionNumber },
		});
		return response as RollbackResult;
	};

	return {
		createVersion,
		getVersionHistory,
		getVersion,
		rollback,
	};
}
