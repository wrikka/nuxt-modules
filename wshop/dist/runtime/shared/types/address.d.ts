import { z } from "zod";
export declare const AddressSchema: z.ZodObject<{
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
export type Address = z.infer<typeof AddressSchema>;
export declare const ShippingRateSchema: z.ZodObject<{
    id: z.ZodNumber;
    zoneId: z.ZodNumber;
    name: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodString;
    minWeight: z.ZodNumber;
    maxWeight: z.ZodNumber;
    freeShippingThreshold: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    id: number;
    name: string;
    price: number;
    zoneId: number;
    minWeight: number;
    maxWeight: number;
    freeShippingThreshold?: number | undefined;
}, {
    currency: string;
    id: number;
    name: string;
    price: number;
    zoneId: number;
    minWeight: number;
    maxWeight: number;
    freeShippingThreshold?: number | undefined;
}>;
export type Rate = z.infer<typeof ShippingRateSchema>;
export declare const ShippingZoneSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    countries: z.ZodArray<z.ZodString, "many">;
    rates: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        zoneId: z.ZodNumber;
        name: z.ZodString;
        price: z.ZodNumber;
        currency: z.ZodString;
        minWeight: z.ZodNumber;
        maxWeight: z.ZodNumber;
        freeShippingThreshold: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        currency: string;
        id: number;
        name: string;
        price: number;
        zoneId: number;
        minWeight: number;
        maxWeight: number;
        freeShippingThreshold?: number | undefined;
    }, {
        currency: string;
        id: number;
        name: string;
        price: number;
        zoneId: number;
        minWeight: number;
        maxWeight: number;
        freeShippingThreshold?: number | undefined;
    }>, "many">;
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: number;
    name: string;
    isActive: boolean;
    countries: string[];
    rates: {
        currency: string;
        id: number;
        name: string;
        price: number;
        zoneId: number;
        minWeight: number;
        maxWeight: number;
        freeShippingThreshold?: number | undefined;
    }[];
}, {
    id: number;
    name: string;
    isActive: boolean;
    countries: string[];
    rates: {
        currency: string;
        id: number;
        name: string;
        price: number;
        zoneId: number;
        minWeight: number;
        maxWeight: number;
        freeShippingThreshold?: number | undefined;
    }[];
}>;
export type ShippingZone = z.infer<typeof ShippingZoneSchema>;
export declare const DbAddressSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    zipCode: z.ZodString;
    country: z.ZodString;
}, "strip", z.ZodTypeAny, {
    country: string;
    state: string;
    city: string;
    street: string;
    zipCode: string;
}, {
    country: string;
    state: string;
    city: string;
    street: string;
    zipCode: string;
}>;
export type DbAddress = z.infer<typeof DbAddressSchema>;
//# sourceMappingURL=address.d.ts.map