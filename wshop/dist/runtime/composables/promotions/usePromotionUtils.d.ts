import type { Promotion } from "~~/shared/types";
export declare const usePromotionUtils: () => {
    getStatusClass: (status: string) => "bg-blue-100 text-blue-800" | "bg-green-100 text-green-800" | "bg-gray-100 text-gray-800";
    getStatusText: (status: string) => string;
    getTypeText: (type: string) => string;
    formatDiscount: (promotion: Promotion) => string;
    formatDate: (dateString: string) => string;
    getDiscountLabel: (type: string) => "ส่วนลด (%)" | "ส่วนลด (บาท)" | "จำนวนที่ต้องซื้อ" | "ค่าส่งฟรี" | "ราคาแพ็คเกจ" | "ส่วนลด";
    getDiscountPlaceholder: (type: string) => "2" | "0" | "10" | "100" | "500";
};
//# sourceMappingURL=usePromotionUtils.d.ts.map