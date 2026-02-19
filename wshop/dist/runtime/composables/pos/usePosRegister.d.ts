export declare function usePosRegister(): {
    registers: import("vue").Ref<any, any>;
    selectedRegister: import("vue").Ref<string | null, string | null>;
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    loadRegisters: () => Promise<void>;
    openRegister: (registerId: string) => Promise<void>;
    endShift: () => Promise<void>;
    getSalesHistory: (startDate?: string, endDate?: string) => Promise<any>;
};
//# sourceMappingURL=usePosRegister.d.ts.map