import type { Recording } from "~/components/video-recording/types";

const DB_NAME = "MediaStudioDB";
const DB_VERSION = 1;
const STORE_NAME = "recordings";

interface RecordingWithMetadata extends Recording {
	mimeType: string;
}

export const useIndexedDB = () => {
	let db: IDBDatabase | null = null;

	const initDB = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => {
				reject(new Error("Failed to open IndexedDB"));
			};

			request.onsuccess = () => {
				db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const database = (event.target as IDBOpenDBRequest).result;
				if (!database.objectStoreNames.contains(STORE_NAME)) {
					const objectStore = database.createObjectStore(STORE_NAME, { keyPath: "id" });
					objectStore.createIndex("timestamp", "timestamp", { unique: false });
					objectStore.createIndex("name", "name", { unique: false });
				}
			};
		});
	};

	const saveRecording = async (recording: Recording, mimeType: string): Promise<void> => {
		if (!db) {
			await initDB();
		}

		return new Promise((resolve, reject) => {
			const transaction = db!.transaction([STORE_NAME], "readwrite");
			const objectStore = transaction.objectStore(STORE_NAME);

			const recordingWithMetadata: RecordingWithMetadata = {
				...recording,
				mimeType,
			};

			const request = objectStore.put(recordingWithMetadata);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(new Error("Failed to save recording"));
		});
	};

	const loadRecordings = async (): Promise<Recording[]> => {
		if (!db) {
			await initDB();
		}

		return new Promise((resolve, reject) => {
			const transaction = db!.transaction([STORE_NAME], "readonly");
			const objectStore = transaction.objectStore(STORE_NAME);
			const request = objectStore.getAll();

			request.onsuccess = () => {
				const recordings = request.result.map((item: RecordingWithMetadata) => {
					const { mimeType: _mimeType, ...recording } = item;
					return recording;
				});
				resolve(recordings);
			};

			request.onerror = () => reject(new Error("Failed to load recordings"));
		});
	};

	const deleteRecording = async (id: string): Promise<void> => {
		if (!db) {
			await initDB();
		}

		return new Promise((resolve, reject) => {
			const transaction = db!.transaction([STORE_NAME], "readwrite");
			const objectStore = transaction.objectStore(STORE_NAME);
			const request = objectStore.delete(id);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(new Error("Failed to delete recording"));
		});
	};

	const clearAllRecordings = async (): Promise<void> => {
		if (!db) {
			await initDB();
		}

		return new Promise((resolve, reject) => {
			const transaction = db!.transaction([STORE_NAME], "readwrite");
			const objectStore = transaction.objectStore(STORE_NAME);
			const request = objectStore.clear();

			request.onsuccess = () => resolve();
			request.onerror = () => reject(new Error("Failed to clear recordings"));
		});
	};

	return {
		initDB,
		saveRecording,
		loadRecordings,
		deleteRecording,
		clearAllRecordings,
	};
};
