export interface CardFormData {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardHolderName: string;
}
export declare const useCardForm: () => {
    cardNumber: any;
    expiryMonth: any;
    expiryYear: any;
    cvv: any;
    cardHolderName: any;
    expiryMonthRef: any;
    expiryYearRef: any;
    cvvRef: any;
    isFormValid: any;
    cardType: any;
    handleCardNumberInput: (event: Event) => void;
    handleExpiryMonthInput: (event: Event) => void;
    handleExpiryYearInput: (event: Event) => void;
    handleCvvInput: (event: Event) => void;
    resetForm: () => void;
    getFormData: () => CardFormData;
    setCardNumber: (value: string) => string;
    setExpiryMonth: (value: string) => string;
    setExpiryYear: (value: string) => string;
    setCvv: (value: string) => string;
    setCardHolderName: (value: string) => string;
};
//# sourceMappingURL=useCardForm.d.ts.map