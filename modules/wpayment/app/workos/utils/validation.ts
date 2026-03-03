import { z } from "zod"

export const authorizationUrlSchema = z.object({
	domain: z.string().optional(),
	provider: z.string().optional(),
	redirectUri: z.string().url(),
	state: z.string().optional(),
})

export const createOrganizationSchema = z.object({
	name: z.string().min(1),
	domainData: z.array(z.object({ domain: z.string() })).optional(),
	allowProfilesOutsideOrganization: z.boolean().optional(),
})

export const paginationSchema = z.object({
	limit: z.number().positive().optional(),
	before: z.string().optional(),
	after: z.string().optional(),
})

export const listUsersSchema = paginationSchema.extend({
	email: z.string().email().optional(),
	organizationId: z.string().optional(),
})

export const listOrganizationsSchema = paginationSchema.extend({
	domains: z.array(z.string()).optional(),
})

export const listConnectionsSchema = paginationSchema.extend({
	organizationId: z.string().optional(),
	connectionType: z.string().optional(),
	state: z.enum(["active", "inactive"]).optional(),
})

export const listDirectoriesSchema = paginationSchema.extend({
	organizationId: z.string().optional(),
})

export type AuthorizationUrlOptions = z.infer<typeof authorizationUrlSchema>
export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>
export type PaginationOptions = z.infer<typeof paginationSchema>
export type ListUsersOptions = z.infer<typeof listUsersSchema>
export type ListOrganizationsOptions = z.infer<typeof listOrganizationsSchema>
export type ListConnectionsOptions = z.infer<typeof listConnectionsSchema>
export type ListDirectoriesOptions = z.infer<typeof listDirectoriesSchema>
