import { z } from "zod";
export declare const RuleActionSchema: z.ZodObject<{
    type: z.ZodEnum<["discountPercentage", "discountFixed", "freeShipping"]>;
    value: z.ZodNumber;
    target: z.ZodEnum<["order", "product", "shipping"]>;
}, "strip", z.ZodTypeAny, {
    type: "discountPercentage" | "freeShipping" | "discountFixed";
    value: number;
    target: "order" | "shipping" | "product";
}, {
    type: "discountPercentage" | "freeShipping" | "discountFixed";
    value: number;
    target: "order" | "shipping" | "product";
}>;
export type RuleAction = z.infer<typeof RuleActionSchema>;
export declare const RuleConditionSchema: z.ZodObject<{
    fact: z.ZodString;
    operator: z.ZodEnum<["greaterThan", "lessThan", "equalTo", "contains"]>;
    value: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    operator: "equalTo" | "greaterThan" | "lessThan" | "contains";
    fact: string;
    value?: any;
}, {
    operator: "equalTo" | "greaterThan" | "lessThan" | "contains";
    fact: string;
    value?: any;
}>;
export type RuleCondition = z.infer<typeof RuleConditionSchema>;
export type RuleConditionGroup = {
    operator: "AND" | "OR";
    conditions: (RuleCondition | RuleConditionGroup)[];
};
export declare const RuleConditionGroupSchema: z.ZodType<RuleConditionGroup>;
export declare const PricingRuleSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    priority: z.ZodNumber;
    enabled: z.ZodBoolean;
    conditions: z.ZodType<RuleConditionGroup, z.ZodTypeDef, RuleConditionGroup>;
    actions: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["discountPercentage", "discountFixed", "freeShipping"]>;
        value: z.ZodNumber;
        target: z.ZodEnum<["order", "product", "shipping"]>;
    }, "strip", z.ZodTypeAny, {
        type: "discountPercentage" | "freeShipping" | "discountFixed";
        value: number;
        target: "order" | "shipping" | "product";
    }, {
        type: "discountPercentage" | "freeShipping" | "discountFixed";
        value: number;
        target: "order" | "shipping" | "product";
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    actions: {
        type: "discountPercentage" | "freeShipping" | "discountFixed";
        value: number;
        target: "order" | "shipping" | "product";
    }[];
    enabled: boolean;
    conditions: RuleConditionGroup;
    priority: number;
}, {
    id: string;
    name: string;
    description: string;
    actions: {
        type: "discountPercentage" | "freeShipping" | "discountFixed";
        value: number;
        target: "order" | "shipping" | "product";
    }[];
    enabled: boolean;
    conditions: RuleConditionGroup;
    priority: number;
}>;
export type PricingRule = z.infer<typeof PricingRuleSchema>;
//# sourceMappingURL=pricing.d.ts.map