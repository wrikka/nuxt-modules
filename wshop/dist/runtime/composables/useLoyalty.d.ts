import type { LoyaltyProgram } from "#shared/types";
export declare const useLoyalty: () => {
    program: any;
    pendingProgram: any;
    errorProgram: any;
    customers: any;
    pendingCustomers: any;
    errorCustomers: any;
    saveProgram: (updatedProgram: LoyaltyProgram) => Promise<void>;
};
//# sourceMappingURL=useLoyalty.d.ts.map