import { Lucia } from "lucia";
export declare const lucia: Lucia<Record<never, never>, {
    name: string;
    email: string;
    roleId: string | null;
}>;
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            name: string;
            email: string;
            roleId: string | null;
        };
    }
}
//# sourceMappingURL=auth.d.ts.map