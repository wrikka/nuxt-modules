import type { LoyaltyTier, LoyaltyMember } from '~~/shared/types';
type __VLS_Props = {
    modelValue: boolean;
    member: Partial<LoyaltyMember> | null;
    tiers: LoyaltyTier[];
    processing: boolean;
};
declare const __VLS_export: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    save: (member: LoyaltyMember) => any;
    "update:modelValue": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSave?: (member: LoyaltyMember) => any;
    "onUpdate:modelValue"?: (value: boolean) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
//# sourceMappingURL=LoyaltyMemberForm.vue.d.ts.map