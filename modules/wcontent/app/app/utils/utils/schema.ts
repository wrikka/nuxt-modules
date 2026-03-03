import { z } from "zod";

export function defineCollection(config: any) {
	return config;
}

export function defineContentConfig(config: any) {
	return config;
}

export function validateWithSchema(data: any, schema: z.ZodSchema) {
	try {
		return schema.parse(data);
	} catch (error) {
		console.error("Schema validation error:", error);
		return data;
	}
}

export function generateTypesFromSchema(schema: z.ZodSchema) {
	// This is a placeholder for generating TypeScript types from Zod schemas
	// In a real implementation, this would use z.infer or similar
	return schema;
}
