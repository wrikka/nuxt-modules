import { z } from "zod";
export declare const TablePositionSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodNumber;
    height: z.ZodNumber;
    rotation: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}, {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}>;
export type TablePosition = z.infer<typeof TablePositionSchema>;
export declare const TableFeatureSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    icon: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    icon: string;
}, {
    id: string;
    name: string;
    description: string;
    icon: string;
}>;
export type TableFeature = z.infer<typeof TableFeatureSchema>;
export declare const TableSchema: z.ZodObject<{
    id: z.ZodString;
    number: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    capacity: z.ZodNumber;
    section: z.ZodString;
    status: z.ZodEnum<["available", "occupied", "reserved", "cleaning", "maintenance"]>;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        rotation: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    }, {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    }>;
    shape: z.ZodEnum<["round", "square", "rectangle", "oval"]>;
    features: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        icon: z.ZodString;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        description: string;
        icon: string;
    }, {
        id: string;
        name: string;
        description: string;
        icon: string;
    }>, "many">;
    qrCode: z.ZodOptional<z.ZodString>;
    isActive: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    number: string;
    status: "maintenance" | "available" | "occupied" | "reserved" | "cleaning";
    id: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    };
    createdAt: Date;
    updatedAt: Date;
    shape: "round" | "square" | "rectangle" | "oval";
    features: {
        id: string;
        name: string;
        description: string;
        icon: string;
    }[];
    isActive: boolean;
    capacity: number;
    section: string;
    name?: string | undefined;
    qrCode?: string | undefined;
}, {
    number: string;
    status: "maintenance" | "available" | "occupied" | "reserved" | "cleaning";
    id: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    };
    createdAt: Date;
    updatedAt: Date;
    shape: "round" | "square" | "rectangle" | "oval";
    features: {
        id: string;
        name: string;
        description: string;
        icon: string;
    }[];
    isActive: boolean;
    capacity: number;
    section: string;
    name?: string | undefined;
    qrCode?: string | undefined;
}>;
export type Table = z.infer<typeof TableSchema>;
export declare const TableReservationSchema: z.ZodObject<{
    id: z.ZodString;
    tableId: z.ZodString;
    customerId: z.ZodString;
    customerName: z.ZodString;
    customerPhone: z.ZodString;
    partySize: z.ZodNumber;
    date: z.ZodDate;
    duration: z.ZodNumber;
    status: z.ZodEnum<["pending", "confirmed", "seated", "completed", "cancelled", "no_show"]>;
    specialRequests: z.ZodOptional<z.ZodString>;
    depositAmount: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "cancelled" | "completed" | "confirmed" | "seated" | "no_show";
    id: string;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    customerId: string;
    createdBy: string;
    tableId: string;
    customerName: string;
    customerPhone: string;
    partySize: number;
    notes?: string | undefined;
    depositAmount?: number | undefined;
    specialRequests?: string | undefined;
}, {
    status: "pending" | "cancelled" | "completed" | "confirmed" | "seated" | "no_show";
    id: string;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    customerId: string;
    createdBy: string;
    tableId: string;
    customerName: string;
    customerPhone: string;
    partySize: number;
    notes?: string | undefined;
    depositAmount?: number | undefined;
    specialRequests?: string | undefined;
}>;
export type TableReservation = z.infer<typeof TableReservationSchema>;
export declare const TableSessionSchema: z.ZodObject<{
    id: z.ZodString;
    tableId: z.ZodString;
    orderId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    customerName: z.ZodOptional<z.ZodString>;
    partySize: z.ZodNumber;
    startTime: z.ZodDate;
    endTime: z.ZodOptional<z.ZodDate>;
    status: z.ZodEnum<["active", "completed", "transferred"]>;
    totalAmount: z.ZodOptional<z.ZodNumber>;
    serverId: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "active" | "completed" | "transferred";
    id: string;
    startTime: Date;
    tableId: string;
    partySize: number;
    serverId: string;
    customerId?: string | undefined;
    orderId?: string | undefined;
    endTime?: Date | undefined;
    notes?: string | undefined;
    totalAmount?: number | undefined;
    customerName?: string | undefined;
}, {
    status: "active" | "completed" | "transferred";
    id: string;
    startTime: Date;
    tableId: string;
    partySize: number;
    serverId: string;
    customerId?: string | undefined;
    orderId?: string | undefined;
    endTime?: Date | undefined;
    notes?: string | undefined;
    totalAmount?: number | undefined;
    customerName?: string | undefined;
}>;
export type TableSession = z.infer<typeof TableSessionSchema>;
export declare const TableSectionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    color: z.ZodString;
    order: z.ZodNumber;
    isActive: z.ZodBoolean;
    tables: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    order: number;
    isActive: boolean;
    color: string;
    tables: string[];
}, {
    id: string;
    name: string;
    description: string;
    order: number;
    isActive: boolean;
    color: string;
    tables: string[];
}>;
export type TableSection = z.infer<typeof TableSectionSchema>;
export declare const TableLayoutSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    sections: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        color: z.ZodString;
        order: z.ZodNumber;
        isActive: z.ZodBoolean;
        tables: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        color: string;
        tables: string[];
    }, {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        color: string;
        tables: string[];
    }>, "many">;
    tables: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        number: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        capacity: z.ZodNumber;
        section: z.ZodString;
        status: z.ZodEnum<["available", "occupied", "reserved", "cleaning", "maintenance"]>;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodNumber;
            height: z.ZodNumber;
            rotation: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        }, {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        }>;
        shape: z.ZodEnum<["round", "square", "rectangle", "oval"]>;
        features: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            icon: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description: string;
            icon: string;
        }, {
            id: string;
            name: string;
            description: string;
            icon: string;
        }>, "many">;
        qrCode: z.ZodOptional<z.ZodString>;
        isActive: z.ZodBoolean;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        number: string;
        status: "maintenance" | "available" | "occupied" | "reserved" | "cleaning";
        id: string;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        };
        createdAt: Date;
        updatedAt: Date;
        shape: "round" | "square" | "rectangle" | "oval";
        features: {
            id: string;
            name: string;
            description: string;
            icon: string;
        }[];
        isActive: boolean;
        capacity: number;
        section: string;
        name?: string | undefined;
        qrCode?: string | undefined;
    }, {
        number: string;
        status: "maintenance" | "available" | "occupied" | "reserved" | "cleaning";
        id: string;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        };
        createdAt: Date;
        updatedAt: Date;
        shape: "round" | "square" | "rectangle" | "oval";
        features: {
            id: string;
            name: string;
            description: string;
            icon: string;
        }[];
        isActive: boolean;
        capacity: number;
        section: string;
        name?: string | undefined;
        qrCode?: string | undefined;
    }>, "many">;
    background: z.ZodString;
    scale: z.ZodNumber;
    isActive: z.ZodBoolean;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    scale: number;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    tables: {
        number: string;
        status: "maintenance" | "available" | "occupied" | "reserved" | "cleaning";
        id: string;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        };
        createdAt: Date;
        updatedAt: Date;
        shape: "round" | "square" | "rectangle" | "oval";
        features: {
            id: string;
            name: string;
            description: string;
            icon: string;
        }[];
        isActive: boolean;
        capacity: number;
        section: string;
        name?: string | undefined;
        qrCode?: string | undefined;
    }[];
    sections: {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        color: string;
        tables: string[];
    }[];
    background: string;
}, {
    scale: number;
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    tables: {
        number: string;
        status: "maintenance" | "available" | "occupied" | "reserved" | "cleaning";
        id: string;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
            rotation: number;
        };
        createdAt: Date;
        updatedAt: Date;
        shape: "round" | "square" | "rectangle" | "oval";
        features: {
            id: string;
            name: string;
            description: string;
            icon: string;
        }[];
        isActive: boolean;
        capacity: number;
        section: string;
        name?: string | undefined;
        qrCode?: string | undefined;
    }[];
    sections: {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        color: string;
        tables: string[];
    }[];
    background: string;
}>;
export type TableLayout = z.infer<typeof TableLayoutSchema>;
//# sourceMappingURL=table.d.ts.map