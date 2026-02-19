export declare const movementTypes: readonly [{
    readonly value: "in";
    readonly label: "นำเข้า";
    readonly icon: "lucide:plus";
    readonly color: "green";
}, {
    readonly value: "out";
    readonly label: "นำออก";
    readonly icon: "lucide:minus";
    readonly color: "red";
}, {
    readonly value: "adjust";
    readonly label: "ปรับปรุง";
    readonly icon: "lucide:edit";
    readonly color: "blue";
}, {
    readonly value: "transfer";
    readonly label: "โอนย้าย";
    readonly icon: "lucide:package";
    readonly color: "purple";
}];
export declare const getCommonReasons: (type: StockMovement["type"]) => string[];
//# sourceMappingURL=stock.d.ts.map