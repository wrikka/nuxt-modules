import { z } from "zod";
import type { Order } from "~/shared/types";
export declare const FraudCheckResultSchema: z.ZodObject<{
    riskScore: z.ZodNumber;
    riskLevel: z.ZodEnum<["low", "medium", "high"]>;
    reasons: z.ZodArray<z.ZodString, "many">;
    shouldBlock: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    riskScore: number;
    riskLevel: "high" | "medium" | "low";
    reasons: string[];
    shouldBlock: boolean;
}, {
    riskScore: number;
    riskLevel: "high" | "medium" | "low";
    reasons: string[];
    shouldBlock: boolean;
}>;
export type FraudCheckResult = z.infer<typeof FraudCheckResultSchema>;
export declare function analyzeOrder(order: Order): Promise<FraudCheckResult>;
export declare function createFraudAlert(order: Order, result: FraudCheckResult): Promise<void>;
//# sourceMappingURL=detection.d.ts.map