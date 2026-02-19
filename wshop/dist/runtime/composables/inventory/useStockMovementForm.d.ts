import type { StockMovement } from "#shared/types";
interface UseStockMovementFormProps {
    productId: string | undefined;
}
export declare const useStockMovementForm: (props: UseStockMovementFormProps, emit: (event: "submit", payload: StockMovement) => void) => {
    movementType: any;
    quantity: import("vue").Ref<number, number>;
    reason: import("vue").Ref<string, string>;
    reference: import("vue").Ref<string, string>;
    isFormValid: import("vue").ComputedRef<boolean | "" | undefined>;
    loading: any;
    handleSubmit: () => Promise<void>;
    setReason: (selectedReason: string) => void;
};
export {};
//# sourceMappingURL=useStockMovementForm.d.ts.map