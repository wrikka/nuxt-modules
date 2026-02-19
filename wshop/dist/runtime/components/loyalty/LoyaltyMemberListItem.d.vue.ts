import type { LoyaltyMember } from '~~/shared/types';
type __VLS_Props = {
    member: LoyaltyMember;
    getTierBadgeClass: (tierId: number) => string;
    getTierName: (tierId: number) => string;
    getStatusClass: (status: string) => string;
    getStatusText: (status: string) => string;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    view: (member: LoyaltyMember) => any;
    delete: (member: LoyaltyMember) => any;
    adjustPoints: (member: LoyaltyMember) => any;
    suspend: (member: LoyaltyMember) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onView?: (member: LoyaltyMember) => any;
    onDelete?: (member: LoyaltyMember) => any;
    onAdjustPoints?: (member: LoyaltyMember) => any;
    onSuspend?: (member: LoyaltyMember) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=LoyaltyMemberListItem.vue.d.ts.map