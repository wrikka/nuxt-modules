export declare function useHtmlRenderer(): {
    loading: import("vue").Ref<boolean, boolean>;
    error: import("vue").Ref<string | null, string | null>;
    printElement: (elementId: string) => Promise<void>;
    generateImage: (elementId: string) => Promise<any>;
};
//# sourceMappingURL=useHtmlRenderer.d.ts.map