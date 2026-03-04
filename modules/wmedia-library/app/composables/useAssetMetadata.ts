import type { LibraryAsset as Asset } from "./useAssetLibrary";

export interface AssetMetadata {
	id: string;
	assetId: string;
	key: string;
	value: string | number | boolean | Record<string, unknown>;
	type: "string" | "number" | "boolean" | "json";
	createdAt: Date;
	updatedAt: Date;
}

export function useAssetMetadata(assets: Ref<Asset[]>) {
	const metadata = ref<AssetMetadata[]>([]);
	const isLoading = ref(false);

	const getMetadata = (assetId: string) => {
		return metadata.value.filter(m => m.assetId === assetId);
	};

	const getMetadataByKey = (assetId: string, key: string) => {
		return metadata.value.find(m => m.assetId === assetId && m.key === key);
	};

	const getMetadataValue = <T = string>(assetId: string, key: string, defaultValue?: T): T => {
		const meta = getMetadataByKey(assetId, key);
		if (!meta) return defaultValue as T;
		return meta.value as T;
	};

	const setMetadata = async (
		assetId: string,
		key: string,
		value: string | number | boolean | Record<string, unknown>,
	) => {
		const existing = getMetadataByKey(assetId, key);

		try {
			if (existing) {
				const result = await $fetch<{ metadata: AssetMetadata }>(`/api/assets/${assetId}/metadata/${existing.id}`, {
					method: "PATCH",
					body: { value },
				});
				const index = metadata.value.findIndex(m => m.id === existing.id);
				if (index >= 0) {
					metadata.value[index] = result.metadata;
				}
			} else {
				const result = await $fetch<{ metadata: AssetMetadata }>(`/api/assets/${assetId}/metadata`, {
					method: "POST",
					body: { key, value },
				});
				metadata.value.push(result.metadata);
			}

			const asset = assets.value.find(a => a.id === assetId);
			if (asset) {
				if (!asset.metadata) {
					asset.metadata = {};
				}
				asset.metadata[key] = value;
			}

			return true;
		} catch {
			return false;
		}
	};

	const deleteMetadata = async (metadataId: string) => {
		try {
			await $fetch(`/api/assets/metadata/${metadataId}`, {
				method: "DELETE",
			});

			const meta = metadata.value.find(m => m.id === metadataId);
			if (meta) {
				const asset = assets.value.find(a => a.id === meta.assetId);
				if (asset && asset.metadata) {
					delete asset.metadata[meta.key];
				}
			}

			metadata.value = metadata.value.filter(m => m.id !== metadataId);
			return true;
		} catch {
			return false;
		}
	};

	const loadMetadata = async (assetId: string) => {
		isLoading.value = true;
		try {
			const data = await $fetch<{ metadata: AssetMetadata[] }>(`/api/assets/${assetId}/metadata`);
			metadata.value = data.metadata || [];
		} catch {
			metadata.value = [];
		} finally {
			isLoading.value = false;
		}
	};

	const getExifData = (assetId: string) => {
		const meta = getMetadataByKey(assetId, "exif");
		return meta ? (meta.value as Record<string, unknown>) : null;
	};

	const getColorPalette = (assetId: string) => {
		const meta = getMetadataByKey(assetId, "colorPalette");
		return meta && Array.isArray(meta.value) ? (meta.value as string[]) : [];
	};

	const getDimensions = (assetId: string) => {
		const widthMeta = getMetadataByKey(assetId, "width");
		const heightMeta = getMetadataByKey(assetId, "height");
		return {
			width: widthMeta ? Number(widthMeta.value) : undefined,
			height: heightMeta ? Number(heightMeta.value) : undefined,
		};
	};

	const getAltText = (assetId: string) => {
		return getMetadataValue<string>(assetId, "altText", "");
	};

	const setAltText = (assetId: string, altText: string) => {
		return setMetadata(assetId, "altText", altText);
	};

	const getCaption = (assetId: string) => {
		return getMetadataValue<string>(assetId, "caption", "");
	};

	const setCaption = (assetId: string, caption: string) => {
		return setMetadata(assetId, "caption", caption);
	};

	const getCopyright = (assetId: string) => {
		return getMetadataValue<string>(assetId, "copyright", "");
	};

	const setCopyright = (assetId: string, copyright: string) => {
		return setMetadata(assetId, "copyright", copyright);
	};

	const getAuthor = (assetId: string) => {
		return getMetadataValue<string>(assetId, "author", "");
	};

	const setAuthor = (assetId: string, author: string) => {
		return setMetadata(assetId, "author", author);
	};

	return {
		metadata,
		isLoading,
		getMetadata,
		getMetadataByKey,
		getMetadataValue,
		setMetadata,
		deleteMetadata,
		loadMetadata,
		getExifData,
		getColorPalette,
		getDimensions,
		getAltText,
		setAltText,
		getCaption,
		setCaption,
		getCopyright,
		setCopyright,
		getAuthor,
		setAuthor,
	};
}
