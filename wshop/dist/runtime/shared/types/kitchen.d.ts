import { z } from "zod";
export declare const StationDisplaySettingsSchema: z.ZodObject<{
    showPreparationTime: z.ZodBoolean;
    showModifications: z.ZodBoolean;
    showCustomerName: z.ZodBoolean;
    autoRefresh: z.ZodBoolean;
    refreshInterval: z.ZodNumber;
    colorScheme: z.ZodEnum<["light", "dark"]>;
}, "strip", z.ZodTypeAny, {
    showPreparationTime: boolean;
    showModifications: boolean;
    showCustomerName: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
    colorScheme: "light" | "dark";
}, {
    showPreparationTime: boolean;
    showModifications: boolean;
    showCustomerName: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
    colorScheme: "light" | "dark";
}>;
export type StationDisplaySettings = z.infer<typeof StationDisplaySettingsSchema>;
export declare const KitchenStationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    isActive: z.ZodBoolean;
    order: z.ZodNumber;
    displaySettings: z.ZodObject<{
        showPreparationTime: z.ZodBoolean;
        showModifications: z.ZodBoolean;
        showCustomerName: z.ZodBoolean;
        autoRefresh: z.ZodBoolean;
        refreshInterval: z.ZodNumber;
        colorScheme: z.ZodEnum<["light", "dark"]>;
    }, "strip", z.ZodTypeAny, {
        showPreparationTime: boolean;
        showModifications: boolean;
        showCustomerName: boolean;
        autoRefresh: boolean;
        refreshInterval: number;
        colorScheme: "light" | "dark";
    }, {
        showPreparationTime: boolean;
        showModifications: boolean;
        showCustomerName: boolean;
        autoRefresh: boolean;
        refreshInterval: number;
        colorScheme: "light" | "dark";
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    order: number;
    isActive: boolean;
    displaySettings: {
        showPreparationTime: boolean;
        showModifications: boolean;
        showCustomerName: boolean;
        autoRefresh: boolean;
        refreshInterval: number;
        colorScheme: "light" | "dark";
    };
}, {
    id: string;
    name: string;
    description: string;
    order: number;
    isActive: boolean;
    displaySettings: {
        showPreparationTime: boolean;
        showModifications: boolean;
        showCustomerName: boolean;
        autoRefresh: boolean;
        refreshInterval: number;
        colorScheme: "light" | "dark";
    };
}>;
export type KitchenStation = z.infer<typeof KitchenStationSchema>;
export declare const KitchenOrderItemSchema: z.ZodObject<{
    id: z.ZodString;
    productId: z.ZodString;
    name: z.ZodString;
    quantity: z.ZodNumber;
    modifications: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["pending", "preparing", "ready", "cancelled"]>;
    station: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodString;
        isActive: z.ZodBoolean;
        order: z.ZodNumber;
        displaySettings: z.ZodObject<{
            showPreparationTime: z.ZodBoolean;
            showModifications: z.ZodBoolean;
            showCustomerName: z.ZodBoolean;
            autoRefresh: z.ZodBoolean;
            refreshInterval: z.ZodNumber;
            colorScheme: z.ZodEnum<["light", "dark"]>;
        }, "strip", z.ZodTypeAny, {
            showPreparationTime: boolean;
            showModifications: boolean;
            showCustomerName: boolean;
            autoRefresh: boolean;
            refreshInterval: number;
            colorScheme: "light" | "dark";
        }, {
            showPreparationTime: boolean;
            showModifications: boolean;
            showCustomerName: boolean;
            autoRefresh: boolean;
            refreshInterval: number;
            colorScheme: "light" | "dark";
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        displaySettings: {
            showPreparationTime: boolean;
            showModifications: boolean;
            showCustomerName: boolean;
            autoRefresh: boolean;
            refreshInterval: number;
            colorScheme: "light" | "dark";
        };
    }, {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        displaySettings: {
            showPreparationTime: boolean;
            showModifications: boolean;
            showCustomerName: boolean;
            autoRefresh: boolean;
            refreshInterval: number;
            colorScheme: "light" | "dark";
        };
    }>>;
    estimatedTime: z.ZodNumber;
    actualTime: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "cancelled" | "preparing" | "ready";
    id: string;
    name: string;
    productId: string;
    quantity: number;
    modifications: string[];
    estimatedTime: number;
    notes?: string | undefined;
    station?: {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        displaySettings: {
            showPreparationTime: boolean;
            showModifications: boolean;
            showCustomerName: boolean;
            autoRefresh: boolean;
            refreshInterval: number;
            colorScheme: "light" | "dark";
        };
    } | undefined;
    actualTime?: number | undefined;
}, {
    status: "pending" | "cancelled" | "preparing" | "ready";
    id: string;
    name: string;
    productId: string;
    quantity: number;
    modifications: string[];
    estimatedTime: number;
    notes?: string | undefined;
    station?: {
        id: string;
        name: string;
        description: string;
        order: number;
        isActive: boolean;
        displaySettings: {
            showPreparationTime: boolean;
            showModifications: boolean;
            showCustomerName: boolean;
            autoRefresh: boolean;
            refreshInterval: number;
            colorScheme: "light" | "dark";
        };
    } | undefined;
    actualTime?: number | undefined;
}>;
export type KitchenOrderItem = z.infer<typeof KitchenOrderItemSchema>;
export declare const KitchenOrderSchema: z.ZodObject<{
    id: z.ZodString;
    orderId: z.ZodString;
    tableId: z.ZodOptional<z.ZodString>;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        productId: z.ZodString;
        name: z.ZodString;
        quantity: z.ZodNumber;
        modifications: z.ZodArray<z.ZodString, "many">;
        status: z.ZodEnum<["pending", "preparing", "ready", "cancelled"]>;
        station: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            description: z.ZodString;
            isActive: z.ZodBoolean;
            order: z.ZodNumber;
            displaySettings: z.ZodObject<{
                showPreparationTime: z.ZodBoolean;
                showModifications: z.ZodBoolean;
                showCustomerName: z.ZodBoolean;
                autoRefresh: z.ZodBoolean;
                refreshInterval: z.ZodNumber;
                colorScheme: z.ZodEnum<["light", "dark"]>;
            }, "strip", z.ZodTypeAny, {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            }, {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            }>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            name: string;
            description: string;
            order: number;
            isActive: boolean;
            displaySettings: {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            };
        }, {
            id: string;
            name: string;
            description: string;
            order: number;
            isActive: boolean;
            displaySettings: {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            };
        }>>;
        estimatedTime: z.ZodNumber;
        actualTime: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "pending" | "cancelled" | "preparing" | "ready";
        id: string;
        name: string;
        productId: string;
        quantity: number;
        modifications: string[];
        estimatedTime: number;
        notes?: string | undefined;
        station?: {
            id: string;
            name: string;
            description: string;
            order: number;
            isActive: boolean;
            displaySettings: {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            };
        } | undefined;
        actualTime?: number | undefined;
    }, {
        status: "pending" | "cancelled" | "preparing" | "ready";
        id: string;
        name: string;
        productId: string;
        quantity: number;
        modifications: string[];
        estimatedTime: number;
        notes?: string | undefined;
        station?: {
            id: string;
            name: string;
            description: string;
            order: number;
            isActive: boolean;
            displaySettings: {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            };
        } | undefined;
        actualTime?: number | undefined;
    }>, "many">;
    status: z.ZodEnum<["pending", "preparing", "ready", "served", "cancelled"]>;
    priority: z.ZodEnum<["low", "normal", "high", "urgent"]>;
    estimatedTime: z.ZodNumber;
    actualTime: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
    createdBy: z.ZodString;
    assignedTo: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    startedAt: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "cancelled" | "preparing" | "ready" | "served";
    id: string;
    createdAt: Date;
    orderId: string;
    items: {
        status: "pending" | "cancelled" | "preparing" | "ready";
        id: string;
        name: string;
        productId: string;
        quantity: number;
        modifications: string[];
        estimatedTime: number;
        notes?: string | undefined;
        station?: {
            id: string;
            name: string;
            description: string;
            order: number;
            isActive: boolean;
            displaySettings: {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            };
        } | undefined;
        actualTime?: number | undefined;
    }[];
    priority: "high" | "low" | "normal" | "urgent";
    createdBy: string;
    estimatedTime: number;
    notes?: string | undefined;
    completedAt?: Date | undefined;
    actualTime?: number | undefined;
    tableId?: string | undefined;
    assignedTo?: string | undefined;
    startedAt?: Date | undefined;
}, {
    status: "pending" | "cancelled" | "preparing" | "ready" | "served";
    id: string;
    createdAt: Date;
    orderId: string;
    items: {
        status: "pending" | "cancelled" | "preparing" | "ready";
        id: string;
        name: string;
        productId: string;
        quantity: number;
        modifications: string[];
        estimatedTime: number;
        notes?: string | undefined;
        station?: {
            id: string;
            name: string;
            description: string;
            order: number;
            isActive: boolean;
            displaySettings: {
                showPreparationTime: boolean;
                showModifications: boolean;
                showCustomerName: boolean;
                autoRefresh: boolean;
                refreshInterval: number;
                colorScheme: "light" | "dark";
            };
        } | undefined;
        actualTime?: number | undefined;
    }[];
    priority: "high" | "low" | "normal" | "urgent";
    createdBy: string;
    estimatedTime: number;
    notes?: string | undefined;
    completedAt?: Date | undefined;
    actualTime?: number | undefined;
    tableId?: string | undefined;
    assignedTo?: string | undefined;
    startedAt?: Date | undefined;
}>;
export type KitchenOrder = z.infer<typeof KitchenOrderSchema>;
export declare const KitchenDisplaySettingsSchema: z.ZodObject<{
    autoAcceptOrders: z.ZodBoolean;
    soundEnabled: z.ZodBoolean;
    soundVolume: z.ZodNumber;
    showCompletedOrders: z.ZodBoolean;
    completedOrdersDuration: z.ZodNumber;
    fontSize: z.ZodEnum<["small", "medium", "large"]>;
    layout: z.ZodEnum<["list", "grid", "card"]>;
}, "strip", z.ZodTypeAny, {
    autoAcceptOrders: boolean;
    soundEnabled: boolean;
    soundVolume: number;
    showCompletedOrders: boolean;
    completedOrdersDuration: number;
    fontSize: "small" | "medium" | "large";
    layout: "card" | "grid" | "list";
}, {
    autoAcceptOrders: boolean;
    soundEnabled: boolean;
    soundVolume: number;
    showCompletedOrders: boolean;
    completedOrdersDuration: number;
    fontSize: "small" | "medium" | "large";
    layout: "card" | "grid" | "list";
}>;
export type KitchenDisplaySettings = z.infer<typeof KitchenDisplaySettingsSchema>;
export declare const KitchenDisplaySchema: z.ZodObject<{
    id: z.ZodString;
    stationId: z.ZodString;
    ipAddress: z.ZodString;
    isActive: z.ZodBoolean;
    lastHeartbeat: z.ZodOptional<z.ZodDate>;
    settings: z.ZodObject<{
        autoAcceptOrders: z.ZodBoolean;
        soundEnabled: z.ZodBoolean;
        soundVolume: z.ZodNumber;
        showCompletedOrders: z.ZodBoolean;
        completedOrdersDuration: z.ZodNumber;
        fontSize: z.ZodEnum<["small", "medium", "large"]>;
        layout: z.ZodEnum<["list", "grid", "card"]>;
    }, "strip", z.ZodTypeAny, {
        autoAcceptOrders: boolean;
        soundEnabled: boolean;
        soundVolume: number;
        showCompletedOrders: boolean;
        completedOrdersDuration: number;
        fontSize: "small" | "medium" | "large";
        layout: "card" | "grid" | "list";
    }, {
        autoAcceptOrders: boolean;
        soundEnabled: boolean;
        soundVolume: number;
        showCompletedOrders: boolean;
        completedOrdersDuration: number;
        fontSize: "small" | "medium" | "large";
        layout: "card" | "grid" | "list";
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    settings: {
        autoAcceptOrders: boolean;
        soundEnabled: boolean;
        soundVolume: number;
        showCompletedOrders: boolean;
        completedOrdersDuration: number;
        fontSize: "small" | "medium" | "large";
        layout: "card" | "grid" | "list";
    };
    isActive: boolean;
    stationId: string;
    ipAddress: string;
    lastHeartbeat?: Date | undefined;
}, {
    id: string;
    settings: {
        autoAcceptOrders: boolean;
        soundEnabled: boolean;
        soundVolume: number;
        showCompletedOrders: boolean;
        completedOrdersDuration: number;
        fontSize: "small" | "medium" | "large";
        layout: "card" | "grid" | "list";
    };
    isActive: boolean;
    stationId: string;
    ipAddress: string;
    lastHeartbeat?: Date | undefined;
}>;
export type KitchenDisplay = z.infer<typeof KitchenDisplaySchema>;
//# sourceMappingURL=kitchen.d.ts.map