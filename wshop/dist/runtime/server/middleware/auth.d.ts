import type { Session, User } from "lucia";
declare const _default: any;
export default _default;
declare module "h3" {
    interface H3EventContext {
        user: User | null;
        session: Session | null;
    }
}
//# sourceMappingURL=auth.d.ts.map