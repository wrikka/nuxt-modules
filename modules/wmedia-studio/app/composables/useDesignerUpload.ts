import { ref } from "vue";

export interface UseDesignerUploadOptions {
	onUploadSuccess?: (url: string) => void;
	onUploadError?: (error: string) => void;
}

export const useDesignerUpload = (options: UseDesignerUploadOptions = {}) => {
	const selectedFile = ref<File | null>(null);
	const imageUrl = ref("");
	const isUploading = ref(false);
	const fileInputRef = ref<HTMLInputElement | null>(null);

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
	};

	const handleFileSelect = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			selectedFile.value = file;
			imageUrl.value = "";
		}
	};

	const clearSelectedFile = () => {
		selectedFile.value = null;
		if (fileInputRef.value) {
			fileInputRef.value.value = "";
		}
	};

	const uploadImage = async (file: File): Promise<string> => {
		const formData = new FormData();
		formData.append("file", file);

		const response = await $fetch<{ success: boolean; url: string }>("/api/designer/image-upload", {
			method: "POST",
			body: formData,
		});

		if (!response.success || !response.url) {
			throw new Error("Failed to upload image");
		}

		return response.url;
	};

	const handleAddImage = async (): Promise<string | null> => {
		if (selectedFile.value) {
			try {
				isUploading.value = true;
				const url = await uploadImage(selectedFile.value);
				options.onUploadSuccess?.(url);
				clearSelectedFile();
				imageUrl.value = "";
				return url;
			} catch (err) {
				console.error("Failed to upload image:", err);
				options.onUploadError?.("Failed to upload image. Please try again.");
				return null;
			} finally {
				isUploading.value = false;
			}
		} else if (imageUrl.value.trim()) {
			try {
				options.onUploadSuccess?.(imageUrl.value.trim());
				const url = imageUrl.value.trim();
				imageUrl.value = "";
				return url;
			} catch (err) {
				console.error("Failed to add image:", err);
				options.onUploadError?.("Failed to load image. Please check the URL and try again.");
				return null;
			}
		}
		return null;
	};

	const isDragging = ref(false);

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		isDragging.value = true;
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		isDragging.value = false;
	};

	const handleDrop = async (e: DragEvent): Promise<string | null> => {
		e.preventDefault();
		isDragging.value = false;

		const files = e.dataTransfer?.files;
		if (!files || files.length === 0) return null;

		const file = files[0];
		if (!file || !file.type.startsWith("image/")) {
			options.onUploadError?.("Please drop an image file");
			return null;
		}

		try {
			isUploading.value = true;
			const url = await uploadImage(file);
			options.onUploadSuccess?.(url);
			return url;
		} catch (err) {
			console.error("Failed to upload dropped image:", err);
			options.onUploadError?.("Failed to upload image. Please try again.");
			return null;
		} finally {
			isUploading.value = false;
		}
	};

	return {
		selectedFile,
		imageUrl,
		isUploading,
		fileInputRef,
		isDragging,
		formatFileSize,
		handleFileSelect,
		clearSelectedFile,
		uploadImage,
		handleAddImage,
		handleDragOver,
		handleDragLeave,
		handleDrop,
	};
};
