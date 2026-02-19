import { z } from "zod";
export declare const DayHoursSchema: z.ZodObject<{
    isOpen: z.ZodBoolean;
    openTime: z.ZodOptional<z.ZodString>;
    closeTime: z.ZodOptional<z.ZodString>;
    breakStart: z.ZodOptional<z.ZodString>;
    breakEnd: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    isOpen: boolean;
    openTime?: string | undefined;
    closeTime?: string | undefined;
    breakStart?: string | undefined;
    breakEnd?: string | undefined;
}, {
    isOpen: boolean;
    openTime?: string | undefined;
    closeTime?: string | undefined;
    breakStart?: string | undefined;
    breakEnd?: string | undefined;
}>;
export type DayHours = z.infer<typeof DayHoursSchema>;
export declare const OperatingHoursSchema: z.ZodObject<{
    monday: z.ZodObject<{
        isOpen: z.ZodBoolean;
        openTime: z.ZodOptional<z.ZodString>;
        closeTime: z.ZodOptional<z.ZodString>;
        breakStart: z.ZodOptional<z.ZodString>;
        breakEnd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }>;
    tuesday: z.ZodObject<{
        isOpen: z.ZodBoolean;
        openTime: z.ZodOptional<z.ZodString>;
        closeTime: z.ZodOptional<z.ZodString>;
        breakStart: z.ZodOptional<z.ZodString>;
        breakEnd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }>;
    wednesday: z.ZodObject<{
        isOpen: z.ZodBoolean;
        openTime: z.ZodOptional<z.ZodString>;
        closeTime: z.ZodOptional<z.ZodString>;
        breakStart: z.ZodOptional<z.ZodString>;
        breakEnd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }>;
    thursday: z.ZodObject<{
        isOpen: z.ZodBoolean;
        openTime: z.ZodOptional<z.ZodString>;
        closeTime: z.ZodOptional<z.ZodString>;
        breakStart: z.ZodOptional<z.ZodString>;
        breakEnd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }>;
    friday: z.ZodObject<{
        isOpen: z.ZodBoolean;
        openTime: z.ZodOptional<z.ZodString>;
        closeTime: z.ZodOptional<z.ZodString>;
        breakStart: z.ZodOptional<z.ZodString>;
        breakEnd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }>;
    saturday: z.ZodObject<{
        isOpen: z.ZodBoolean;
        openTime: z.ZodOptional<z.ZodString>;
        closeTime: z.ZodOptional<z.ZodString>;
        breakStart: z.ZodOptional<z.ZodString>;
        breakEnd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }>;
    sunday: z.ZodObject<{
        isOpen: z.ZodBoolean;
        openTime: z.ZodOptional<z.ZodString>;
        closeTime: z.ZodOptional<z.ZodString>;
        breakStart: z.ZodOptional<z.ZodString>;
        breakEnd: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }, {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    monday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    tuesday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    wednesday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    thursday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    friday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    saturday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    sunday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
}, {
    monday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    tuesday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    wednesday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    thursday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    friday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    saturday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
    sunday: {
        isOpen: boolean;
        openTime?: string | undefined;
        closeTime?: string | undefined;
        breakStart?: string | undefined;
        breakEnd?: string | undefined;
    };
}>;
export type OperatingHours = z.infer<typeof OperatingHoursSchema>;
export declare const StoreSettingsSchema: z.ZodObject<{
    allowOnlineOrders: z.ZodBoolean;
    allowInStorePickup: z.ZodBoolean;
    allowDelivery: z.ZodBoolean;
    deliveryRadius: z.ZodNumber;
    minimumOrderAmount: z.ZodNumber;
    taxIncluded: z.ZodBoolean;
    currencySymbol: z.ZodString;
    dateFormat: z.ZodString;
    timeFormat: z.ZodEnum<["12h", "24h"]>;
}, "strip", z.ZodTypeAny, {
    allowOnlineOrders: boolean;
    allowInStorePickup: boolean;
    allowDelivery: boolean;
    deliveryRadius: number;
    minimumOrderAmount: number;
    taxIncluded: boolean;
    currencySymbol: string;
    dateFormat: string;
    timeFormat: "24h" | "12h";
}, {
    allowOnlineOrders: boolean;
    allowInStorePickup: boolean;
    allowDelivery: boolean;
    deliveryRadius: number;
    minimumOrderAmount: number;
    taxIncluded: boolean;
    currencySymbol: string;
    dateFormat: string;
    timeFormat: "24h" | "12h";
}>;
export type StoreSettings = z.infer<typeof StoreSettingsSchema>;
export declare const StoreSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    url: z.ZodString;
    currency: z.ZodString;
    address: z.ZodObject<{
        id: z.ZodNumber;
        customerId: z.ZodNumber;
        type: z.ZodEnum<["billing", "shipping", "both"]>;
        firstName: z.ZodString;
        lastName: z.ZodString;
        company: z.ZodOptional<z.ZodString>;
        addressLine1: z.ZodString;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        state: z.ZodString;
        postalCode: z.ZodString;
        country: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        isDefault: z.ZodBoolean;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    }, {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    }>;
    phone: z.ZodString;
    email: z.ZodString;
    managerId: z.ZodString;
    isActive: z.ZodBoolean;
    timezone: z.ZodString;
    taxRate: z.ZodNumber;
    operatingHours: z.ZodObject<{
        monday: z.ZodObject<{
            isOpen: z.ZodBoolean;
            openTime: z.ZodOptional<z.ZodString>;
            closeTime: z.ZodOptional<z.ZodString>;
            breakStart: z.ZodOptional<z.ZodString>;
            breakEnd: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }>;
        tuesday: z.ZodObject<{
            isOpen: z.ZodBoolean;
            openTime: z.ZodOptional<z.ZodString>;
            closeTime: z.ZodOptional<z.ZodString>;
            breakStart: z.ZodOptional<z.ZodString>;
            breakEnd: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }>;
        wednesday: z.ZodObject<{
            isOpen: z.ZodBoolean;
            openTime: z.ZodOptional<z.ZodString>;
            closeTime: z.ZodOptional<z.ZodString>;
            breakStart: z.ZodOptional<z.ZodString>;
            breakEnd: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }>;
        thursday: z.ZodObject<{
            isOpen: z.ZodBoolean;
            openTime: z.ZodOptional<z.ZodString>;
            closeTime: z.ZodOptional<z.ZodString>;
            breakStart: z.ZodOptional<z.ZodString>;
            breakEnd: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }>;
        friday: z.ZodObject<{
            isOpen: z.ZodBoolean;
            openTime: z.ZodOptional<z.ZodString>;
            closeTime: z.ZodOptional<z.ZodString>;
            breakStart: z.ZodOptional<z.ZodString>;
            breakEnd: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }>;
        saturday: z.ZodObject<{
            isOpen: z.ZodBoolean;
            openTime: z.ZodOptional<z.ZodString>;
            closeTime: z.ZodOptional<z.ZodString>;
            breakStart: z.ZodOptional<z.ZodString>;
            breakEnd: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }>;
        sunday: z.ZodObject<{
            isOpen: z.ZodBoolean;
            openTime: z.ZodOptional<z.ZodString>;
            closeTime: z.ZodOptional<z.ZodString>;
            breakStart: z.ZodOptional<z.ZodString>;
            breakEnd: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }, {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        monday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        tuesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        wednesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        thursday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        friday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        saturday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        sunday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
    }, {
        monday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        tuesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        wednesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        thursday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        friday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        saturday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        sunday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
    }>;
    settings: z.ZodObject<{
        allowOnlineOrders: z.ZodBoolean;
        allowInStorePickup: z.ZodBoolean;
        allowDelivery: z.ZodBoolean;
        deliveryRadius: z.ZodNumber;
        minimumOrderAmount: z.ZodNumber;
        taxIncluded: z.ZodBoolean;
        currencySymbol: z.ZodString;
        dateFormat: z.ZodString;
        timeFormat: z.ZodEnum<["12h", "24h"]>;
    }, "strip", z.ZodTypeAny, {
        allowOnlineOrders: boolean;
        allowInStorePickup: boolean;
        allowDelivery: boolean;
        deliveryRadius: number;
        minimumOrderAmount: number;
        taxIncluded: boolean;
        currencySymbol: string;
        dateFormat: string;
        timeFormat: "24h" | "12h";
    }, {
        allowOnlineOrders: boolean;
        allowInStorePickup: boolean;
        allowDelivery: boolean;
        deliveryRadius: number;
        minimumOrderAmount: number;
        taxIncluded: boolean;
        currencySymbol: string;
        dateFormat: string;
        timeFormat: "24h" | "12h";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currency: string;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    settings: {
        allowOnlineOrders: boolean;
        allowInStorePickup: boolean;
        allowDelivery: boolean;
        deliveryRadius: number;
        minimumOrderAmount: number;
        taxIncluded: boolean;
        currencySymbol: string;
        dateFormat: string;
        timeFormat: "24h" | "12h";
    };
    email: string;
    isActive: boolean;
    phone: string;
    taxRate: number;
    address: {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    };
    managerId: string;
    timezone: string;
    operatingHours: {
        monday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        tuesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        wednesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        thursday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        friday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        saturday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        sunday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
    };
}, {
    currency: string;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    url: string;
    settings: {
        allowOnlineOrders: boolean;
        allowInStorePickup: boolean;
        allowDelivery: boolean;
        deliveryRadius: number;
        minimumOrderAmount: number;
        taxIncluded: boolean;
        currencySymbol: string;
        dateFormat: string;
        timeFormat: "24h" | "12h";
    };
    email: string;
    isActive: boolean;
    phone: string;
    taxRate: number;
    address: {
        id: number;
        type: "shipping" | "billing" | "both";
        createdAt: string;
        updatedAt: string;
        country: string;
        customerId: number;
        state: string;
        city: string;
        firstName: string;
        lastName: string;
        addressLine1: string;
        postalCode: string;
        isDefault: boolean;
        phone?: string | undefined;
        company?: string | undefined;
        addressLine2?: string | undefined;
    };
    managerId: string;
    timezone: string;
    operatingHours: {
        monday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        tuesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        wednesday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        thursday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        friday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        saturday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
        sunday: {
            isOpen: boolean;
            openTime?: string | undefined;
            closeTime?: string | undefined;
            breakStart?: string | undefined;
            breakEnd?: string | undefined;
        };
    };
}>;
export type Store = z.infer<typeof StoreSchema>;
export declare const TransferItemSchema: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
    unitCost: z.ZodNumber;
    totalCost: z.ZodNumber;
    condition: z.ZodEnum<["new", "good", "damaged"]>;
}, "strip", z.ZodTypeAny, {
    productId: string;
    quantity: number;
    condition: "new" | "good" | "damaged";
    unitCost: number;
    totalCost: number;
}, {
    productId: string;
    quantity: number;
    condition: "new" | "good" | "damaged";
    unitCost: number;
    totalCost: number;
}>;
export type TransferItem = z.infer<typeof TransferItemSchema>;
export declare const StoreTransferSchema: z.ZodObject<{
    id: z.ZodString;
    fromStoreId: z.ZodString;
    toStoreId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        unitCost: z.ZodNumber;
        totalCost: z.ZodNumber;
        condition: z.ZodEnum<["new", "good", "damaged"]>;
    }, "strip", z.ZodTypeAny, {
        productId: string;
        quantity: number;
        condition: "new" | "good" | "damaged";
        unitCost: number;
        totalCost: number;
    }, {
        productId: string;
        quantity: number;
        condition: "new" | "good" | "damaged";
        unitCost: number;
        totalCost: number;
    }>, "many">;
    status: z.ZodEnum<["pending", "approved", "transit", "received", "cancelled"]>;
    requestedBy: z.ZodString;
    approvedBy: z.ZodOptional<z.ZodString>;
    receivedBy: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    approvedAt: z.ZodOptional<z.ZodDate>;
    receivedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "cancelled" | "received" | "approved" | "transit";
    id: string;
    createdAt: Date;
    items: {
        productId: string;
        quantity: number;
        condition: "new" | "good" | "damaged";
        unitCost: number;
        totalCost: number;
    }[];
    fromStoreId: string;
    toStoreId: string;
    requestedBy: string;
    notes?: string | undefined;
    approvedBy?: string | undefined;
    approvedAt?: Date | undefined;
    receivedBy?: string | undefined;
    receivedAt?: Date | undefined;
}, {
    status: "pending" | "cancelled" | "received" | "approved" | "transit";
    id: string;
    createdAt: Date;
    items: {
        productId: string;
        quantity: number;
        condition: "new" | "good" | "damaged";
        unitCost: number;
        totalCost: number;
    }[];
    fromStoreId: string;
    toStoreId: string;
    requestedBy: string;
    notes?: string | undefined;
    approvedBy?: string | undefined;
    approvedAt?: Date | undefined;
    receivedBy?: string | undefined;
    receivedAt?: Date | undefined;
}>;
export type StoreTransfer = z.infer<typeof StoreTransferSchema>;
//# sourceMappingURL=store.d.ts.map