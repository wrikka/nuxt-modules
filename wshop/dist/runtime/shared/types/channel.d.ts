import { z } from "zod";
export declare const ChannelConfigSchema: z.ZodObject<{
    apiKey: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodAny, z.objectOutputType<{
    apiKey: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
}, z.ZodAny, "strip">, z.objectInputType<{
    apiKey: z.ZodOptional<z.ZodString>;
    webhookUrl: z.ZodOptional<z.ZodString>;
}, z.ZodAny, "strip">>;
export type ChannelConfig = z.infer<typeof ChannelConfigSchema>;
export declare const ChannelSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    icon: z.ZodString;
    description: z.ZodString;
    enabled: z.ZodBoolean;
    config: z.ZodOptional<z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodAny, z.objectOutputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip">, z.objectInputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip">>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    description: string;
    icon: string;
    enabled: boolean;
    config?: z.objectOutputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip"> | undefined;
}, {
    id: string;
    name: string;
    description: string;
    icon: string;
    enabled: boolean;
    config?: z.objectInputType<{
        apiKey: z.ZodOptional<z.ZodString>;
        webhookUrl: z.ZodOptional<z.ZodString>;
    }, z.ZodAny, "strip"> | undefined;
}>;
export type Channel = z.infer<typeof ChannelSchema>;
//# sourceMappingURL=channel.d.ts.map