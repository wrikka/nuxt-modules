// @ts-ignore
import { defineCollection, defineContentConfig } from "@wrikka/content";
import { z } from "zod";

export default defineContentConfig({
	collections: {
		blog: defineCollection({
			type: "page",
			source: "blog/*.md",
			schema: z.object({
				title: z.string(),
				date: z.string(),
				excerpt: z.string().optional(),
				tags: z.array(z.string()).optional(),
				cover: z.string().optional(),
				author: z.string().optional(),
				readingTime: z.number().optional(),
				updatedDate: z.string().optional(),
			}),
		}),
		course: defineCollection({
			type: "page",
			source: "course/*/index.md",
			schema: z.object({
				title: z.string(),
				description: z.string(),
				icon: z.string().optional(),
				tags: z.array(z.string()).optional(),
			}),
		}),
	},
});
