import type { DataSource } from "../types/data-source";

/**
 * Fetch data from API endpoint
 */
export const fetchFromAPI = async (
	source: DataSource,
	timeout: number,
): Promise<any> => {
	if (!source.url) throw new Error("API URL required");

	const response = await fetch(source.url, {
		headers: source.headers,
		signal: AbortSignal.timeout(timeout),
	});

	if (!response.ok) {
		throw new Error(`API request failed: ${response.status}`);
	}

	return await response.json();
};

/**
 * Fetch data from GraphQL endpoint
 */
export const fetchFromGraphQL = async (
	source: DataSource,
	timeout: number,
): Promise<any> => {
	if (!source.url || !source.query)
		throw new Error("GraphQL URL and query required");

	const response = await fetch(source.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...source.headers,
		},
		body: JSON.stringify({ query: source.query }),
		signal: AbortSignal.timeout(timeout),
	});

	if (!response.ok) {
		throw new Error(`GraphQL request failed: ${response.status}`);
	}

	const result = await response.json();
	return result.data;
};

/**
 * Fetch data from database
 */
export const fetchFromDatabase = async (source: DataSource): Promise<any> => {
	// Placeholder - would use database-specific libraries
	console.warn("Database fetching not implemented - placeholder");
	return { data: [] };
};

/**
 * Fetch data from file
 */
export const fetchFromFile = async (source: DataSource): Promise<any> => {
	if (!source.file) throw new Error("File required");

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const text = e.target?.result as string;
				const data = JSON.parse(text);
				resolve(data);
			} catch (error) {
				reject(new Error("Failed to parse file"));
			}
		};
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsText(source.file!);
	});
};

/**
 * Fetch data from WebSocket
 */
export const fetchFromWebSocket = async (source: DataSource): Promise<any> => {
	// Placeholder for WebSocket implementation
	console.warn("WebSocket fetching not implemented - placeholder");
	return { data: [] };
};

/**
 * Fetch data from MQTT
 */
export const fetchFromMQTT = async (source: DataSource): Promise<any> => {
	// Placeholder for MQTT implementation
	console.warn("MQTT fetching not implemented - placeholder");
	return { data: [] };
};

/**
 * Fetch data from webhook
 */
export const fetchFromWebhook = async (source: DataSource): Promise<any> => {
	// Webhooks are typically push-based, not pull
	console.warn("Webhook fetching not implemented - placeholder");
	return { data: [] };
};
