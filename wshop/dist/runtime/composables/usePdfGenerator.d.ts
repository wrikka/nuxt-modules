import type { POSSession } from "#shared/types";
export declare function usePdfGenerator(): {
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    generatePDFReceipt: (session: POSSession) => Promise<any>;
    generatePDFAndDownload: (session: POSSession, filename?: string) => Promise<any>;
};
//# sourceMappingURL=usePdfGenerator.d.ts.map