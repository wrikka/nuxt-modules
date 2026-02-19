import { z } from "zod"

export const RuleActionSchema = z.object({
	type: z.enum(["discountPercentage", "discountFixed", "freeShipping"]),
	value: z.number(),
	target: z.enum(["order", "product", "shipping"]),
})
export type RuleAction = z.infer<typeof RuleActionSchema>

export const RuleConditionSchema = z.object({
	fact: z.string(),
	operator: z.enum(["greaterThan", "lessThan", "equalTo", "contains"]),
	value: z.any(),
})
export type RuleCondition = z.infer<typeof RuleConditionSchema>

export type RuleConditionGroup = {
	operator: "AND" | "OR"
	conditions: (RuleCondition | RuleConditionGroup)[]
}

export const RuleConditionGroupSchema: z.ZodType<RuleConditionGroup> = z.object({
	operator: z.enum(["AND", "OR"]),
	conditions: z.lazy(() =>
		z.union([RuleConditionSchema, z.lazy(() => RuleConditionGroupSchema)]).array()
	),
})

export const PricingRuleSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	priority: z.number(),
	enabled: z.boolean(),
	conditions: RuleConditionGroupSchema,
	actions: z.array(RuleActionSchema),
})
export type PricingRule = z.infer<typeof PricingRuleSchema>
