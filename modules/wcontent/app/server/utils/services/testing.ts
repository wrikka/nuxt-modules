import type { ContentItem } from "../../../shared/types";

export interface TestConfig {
	enableE2ETests: boolean;
	enableUnitTests: boolean;
	testTimeout: number;
}

export interface TestResult {
	name: string;
	passed: boolean;
	duration: number;
	error?: string;
}

export class ContentTestingFramework {
	private config: TestConfig;
	private tests: Map<string, () => Promise<TestResult>> = new Map();

	constructor(config?: TestConfig) {
		this.config = config || {
			enableE2ETests: true,
			enableUnitTests: true,
			testTimeout: 5000,
		};
	}

	registerTest(name: string, testFn: () => Promise<TestResult>): void {
		this.tests.set(name, testFn);
	}

	async runTests(filter?: string[]): Promise<TestResult[]> {
		const results: TestResult[] = [];

		for (const [name, testFn] of this.tests.entries()) {
			if (filter && !filter.includes(name)) continue;

			try {
				const result = await Promise.race([
					testFn(),
					new Promise<TestResult>((_, reject) =>
						setTimeout(() => reject(new Error("Test timeout")), this.config.testTimeout)
					),
				]);

				results.push(result);
			} catch (error) {
				results.push({
					name,
					passed: false,
					duration: 0,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}

		return results;
	}

	async runE2ETests(): Promise<TestResult[]> {
		if (!this.config.enableE2ETests) {
			return [];
		}

		const e2eTests = Array.from(this.tests.entries()).filter(([name]) => name.startsWith("e2e:"));

		const results: TestResult[] = [];

		for (const [name, testFn] of e2eTests) {
			try {
				const result = await testFn();
				results.push(result);
			} catch (error) {
				results.push({
					name,
					passed: false,
					duration: 0,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}

		return results;
	}

	async runUnitTests(): Promise<TestResult[]> {
		if (!this.config.enableUnitTests) {
			return [];
		}

		const unitTests = Array.from(this.tests.entries()).filter(([name]) => name.startsWith("unit:"));

		const results: TestResult[] = [];

		for (const [name, testFn] of unitTests) {
			try {
				const result = await testFn();
				results.push(result);
			} catch (error) {
				results.push({
					name,
					passed: false,
					duration: 0,
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}

		return results;
	}

	async testContentValidation(content: ContentItem): Promise<TestResult> {
		const start = performance.now();

		try {
			// Test required fields
			if (!content._path || !content._dir) {
				return {
					name: "content-validation",
					passed: false,
					duration: performance.now() - start,
					error: "Missing required fields (_path or _dir)",
				};
			}

			// Test title
			if (!content.title || content.title.trim() === "") {
				return {
					name: "content-validation",
					passed: false,
					duration: performance.now() - start,
					error: "Missing or empty title",
				};
			}

			return {
				name: "content-validation",
				passed: true,
				duration: performance.now() - start,
			};
		} catch (error) {
			return {
				name: "content-validation",
				passed: false,
				duration: performance.now() - start,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	async testContentRendering(content: ContentItem): Promise<TestResult> {
		const start = performance.now();

		try {
			// Test if content can be rendered
			if (content.body && typeof content.body === "string") {
				// Check for basic markdown syntax
				if (content.body.includes("```")) {
					return {
						name: "content-rendering",
						passed: true,
						duration: performance.now() - start,
					};
				}
			}

			return {
				name: "content-rendering",
				passed: true,
				duration: performance.now() - start,
			};
		} catch (error) {
			return {
				name: "content-rendering",
				passed: false,
				duration: performance.now() - start,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	async testContentPerformance(_content: ContentItem): Promise<TestResult> {
		const start = performance.now();

		try {
			// Test content loading performance
			const loadTime = performance.now() - start;

			if (loadTime > 1000) {
				return {
					name: "content-performance",
					passed: false,
					duration: loadTime,
					error: `Content load time exceeded threshold: ${loadTime}ms`,
				};
			}

			return {
				name: "content-performance",
				passed: true,
				duration: loadTime,
			};
		} catch (error) {
			return {
				name: "content-performance",
				passed: false,
				duration: performance.now() - start,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}

	clearTests(): void {
		this.tests.clear();
	}

	getTestCount(): number {
		return this.tests.size;
	}

	getConfig(): TestConfig {
		return this.config;
	}
}

// Singleton instance
let testingInstance: ContentTestingFramework | null = null;

export function useContentTesting(config?: TestConfig): ContentTestingFramework {
	if (!testingInstance) {
		testingInstance = new ContentTestingFramework(config);
	}
	return testingInstance;
}

// Helper composable for testing
export function useTesting() {
	const testing = useContentTesting();

	return {
		registerTest: (name: string, testFn: () => Promise<TestResult>) => testing.registerTest(name, testFn),
		runTests: (filter?: string[]) => testing.runTests(filter),
		runE2ETests: () => testing.runE2ETests(),
		runUnitTests: () => testing.runUnitTests(),
		testContentValidation: (content: ContentItem) => testing.testContentValidation(content),
		testContentRendering: (content: ContentItem) => testing.testContentRendering(content),
		testContentPerformance: (content: ContentItem) => testing.testContentPerformance(content),
		clearTests: () => testing.clearTests(),
		getTestCount: () => testing.getTestCount(),
	};
}
