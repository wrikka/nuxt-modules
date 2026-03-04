export interface UploadProvider {
	name: string;
	type: "s3" | "gcs" | "azure" | "custom" | "youtube" | "dropbox" | "googledrive";
	config: Record<string, string>;
}

export interface UploadTask {
	id: string;
	file: Blob;
	filename: string;
	provider: UploadProvider;
	progress: number;
	status: "pending" | "uploading" | "completed" | "failed";
	result?: string;
	error?: string;
	createdAt: number;
	startedAt?: number;
	completedAt?: number;
}

export interface AutoUploadConfig {
	enabled: boolean;
	providers: UploadProvider[];
	afterRecording: boolean;
	compressBeforeUpload: boolean;
	maxRetries: number;
}

export interface AutoUploadState {
	config: AutoUploadConfig;
	tasks: UploadTask[];
	isProcessing: boolean;
	currentTask?: UploadTask;
}

const STORAGE_KEY = "wrecorder-autoupload-config";

export const useAutoUpload = () => {
	const defaultConfig: AutoUploadConfig = {
		enabled: false,
		providers: [],
		afterRecording: true,
		compressBeforeUpload: false,
		maxRetries: 3,
	};

	const state = reactive<AutoUploadState>({
		config: { ...defaultConfig },
		tasks: [],
		isProcessing: false,
	});

	const loadConfig = () => {
		if (typeof window === "undefined") return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				state.config = { ...defaultConfig, ...JSON.parse(stored) };
			} catch {
				state.config = { ...defaultConfig };
			}
		}
	};

	const saveConfig = () => {
		if (typeof window === "undefined") return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
	};

	const addProvider = (provider: UploadProvider) => {
		state.config.providers.push(provider);
		saveConfig();
	};

	const removeProvider = (index: number) => {
		state.config.providers.splice(index, 1);
		saveConfig();
	};

	const setConfig = (config: Partial<AutoUploadConfig>) => {
		Object.assign(state.config, config);
		saveConfig();
	};

	const enable = () => {
		state.config.enabled = true;
		saveConfig();
	};

	const disable = () => {
		state.config.enabled = false;
		saveConfig();
	};

	const queueUpload = (file: Blob, filename: string): string[] => {
		const taskIds: string[] = [];

		state.config.providers.forEach(provider => {
			const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			
			const task: UploadTask = {
				id,
				file,
				filename,
				provider,
				progress: 0,
				status: "pending",
				createdAt: Date.now(),
			};

			state.tasks.push(task);
			taskIds.push(id);
		});

		if (state.config.afterRecording) {
			processQueue();
		}

		return taskIds;
	};

	const processQueue = async () => {
		if (state.isProcessing) return;

		const pending = state.tasks.filter(t => t.status === "pending");
		if (pending.length === 0) return;

		state.isProcessing = true;

		for (const task of pending) {
			state.currentTask = task;
			await processUpload(task);
		}

		state.currentTask = undefined;
		state.isProcessing = false;
	};

	const processUpload = async (task: UploadTask): Promise<boolean> => {
		task.status = "uploading";
		task.startedAt = Date.now();

		try {
			switch (task.provider.type) {
				case "s3":
					return await uploadToS3(task);
				case "custom":
					return await uploadToCustom(task);
				default:
					// สำหรับ providers อื่นๆ ให้จำลอง success
					simulateUpload(task);
					return true;
			}
		} catch (error) {
			task.status = "failed";
			task.error = error instanceof Error ? error.message : "Upload failed";
			return false;
		}
	};

	const simulateUpload = (task: UploadTask) => {
		const interval = setInterval(() => {
			task.progress += 10;
			
			if (task.progress >= 100) {
				clearInterval(interval);
				task.status = "completed";
				task.completedAt = Date.now();
				task.result = `https://example.com/uploads/${task.filename}`;
			}
		}, 200);
	};

	const uploadToS3 = async (task: UploadTask): Promise<boolean> => {
		const { config } = task.provider;
		const { bucket, region, accessKey, secretKey, endpoint } = config;

		if (!bucket || !region) {
			throw new Error("S3 bucket and region are required");
		}

		// สร้าง presigned URL (ในการใช้งานจริงควรทำที่ server)
		const url = `https://${bucket}.s3.${region}.amazonaws.com/${task.filename}`;

		const response = await fetch(url, {
			method: "PUT",
			headers: {
				"Content-Type": task.file.type || "video/webm",
			},
			body: task.file,
		});

		if (response.ok) {
			task.status = "completed";
			task.progress = 100;
			task.completedAt = Date.now();
			task.result = url;
			return true;
		}

		throw new Error(`S3 upload failed: ${response.status}`);
	};

	const uploadToCustom = async (task: UploadTask): Promise<boolean> => {
		const { endpoint } = task.provider.config;
		
		if (!endpoint) {
			throw new Error("Custom endpoint URL is required");
		}

		const formData = new FormData();
		formData.append("file", task.file, task.filename);

		const response = await fetch(endpoint, {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			const result = await response.json();
			task.status = "completed";
			task.progress = 100;
			task.completedAt = Date.now();
			task.result = result.url || result.link;
			return true;
		}

		throw new Error(`Custom upload failed: ${response.status}`);
	};

	const retryFailed = async (): Promise<boolean> => {
		const failed = state.tasks.filter(t => t.status === "failed");
		
		for (const task of failed) {
			task.status = "pending";
			task.error = undefined;
		}

		await processQueue();
		return failed.every(t => t.status === "completed");
	};

	const clearCompleted = () => {
		state.tasks = state.tasks.filter(t => t.status !== "completed");
	};

	const removeTask = (id: string) => {
		state.tasks = state.tasks.filter(t => t.id !== id);
	};

	const autoUploadRecording = (blob: Blob, filename: string) => {
		if (!state.config.enabled) return [];
		return queueUpload(blob, filename);
	};

	onMounted(() => {
		loadConfig();
	});

	return {
		state: readonly(state),
		config: computed(() => state.config),
		tasks: computed(() => state.tasks),
		pendingCount: computed(() => state.tasks.filter(t => t.status === "pending").length),
		completedCount: computed(() => state.tasks.filter(t => t.status === "completed").length),
		failedCount: computed(() => state.tasks.filter(t => t.status === "failed").length),
		addProvider,
		removeProvider,
		setConfig,
		enable,
		disable,
		queueUpload,
		processQueue,
		retryFailed,
		clearCompleted,
		removeTask,
		autoUploadRecording,
	};
};
