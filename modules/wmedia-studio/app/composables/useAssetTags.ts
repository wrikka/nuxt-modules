import type { LibraryAsset as Asset } from "./useAssetLibrary";

export function useAssetTags(assets: Ref<Asset[]>) {
	const allTags = computed(() => {
		const tags = new Set<string>();
		assets.value.forEach(asset => {
			asset.tags.forEach(tag => tags.add(tag));
		});
		return Array.from(tags).sort();
	});

	const popularTags = computed(() => {
		const tagCounts = new Map<string, number>();
		assets.value.forEach(asset => {
			asset.tags.forEach(tag => {
				tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
			});
		});
		return Array.from(tagCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 20)
			.map(([tag]) => tag);
	});

	const getAssetsByTag = (tag: string) => {
		return assets.value.filter(a => a.tags.includes(tag));
	};

	const getTagCount = (tag: string) => {
		return assets.value.filter(a => a.tags.includes(tag)).length;
	};

	const addTagToAsset = async (assetId: string, tag: string) => {
		const asset = assets.value.find(a => a.id === assetId);
		if (!asset || asset.tags.includes(tag)) return false;

		try {
			await $fetch(`/api/assets/${assetId}/tags`, {
				method: "POST",
				body: { tag },
			});
			asset.tags.push(tag);
			return true;
		} catch {
			return false;
		}
	};

	const removeTagFromAsset = async (assetId: string, tag: string) => {
		const asset = assets.value.find(a => a.id === assetId);
		if (!asset) return false;

		try {
			await $fetch(`/api/assets/${assetId}/tags/${tag}`, {
				method: "DELETE",
			});
			asset.tags = asset.tags.filter(t => t !== tag);
			return true;
		} catch {
			return false;
		}
	};

	const renameTag = async (oldTag: string, newTag: string) => {
		const promises = assets.value
			.filter(a => a.tags.includes(oldTag))
			.map(asset => {
				asset.tags = asset.tags.map(t => t === oldTag ? newTag : t);
				return $fetch(`/api/assets/${asset.id}/tags/${oldTag}`, {
					method: "PATCH",
					body: { newTag },
				});
			});
		await Promise.all(promises);
	};

	const deleteTag = async (tag: string) => {
		const promises = assets.value
			.filter(a => a.tags.includes(tag))
			.map(asset => {
				asset.tags = asset.tags.filter(t => t !== tag);
				return $fetch(`/api/assets/${asset.id}/tags/${tag}`, {
					method: "DELETE",
				});
			});
		await Promise.all(promises);
	};

	return {
		allTags,
		popularTags,
		getAssetsByTag,
		getTagCount,
		addTagToAsset,
		removeTagFromAsset,
		renameTag,
		deleteTag,
	};
}
