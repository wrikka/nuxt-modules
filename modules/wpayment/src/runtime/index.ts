export { useStripe } from './composables/useStripe';
export { useStripeElements } from './composables/useStripeElements';
export * from './types';
export * from './utils/stripe-server';

// WorkOS exports
export type { WorkOSModuleOptions } from '../module';

// Explicit exports to avoid duplicates
export {
    useWorkOSAuth,
    useWorkOSConnections,
    useWorkOSCore,
    useWorkOSDirectories,
    useWorkOSOrganizations,
    useWorkOSAnalytics,
    useWorkOSBackup,
    useWorkOSCompliance,
    useWorkOSDevices,
    useWorkOSEmailTemplates,
    useWorkOSIntegrations,
    useWorkOSPasswordPolicy,
    useWorkOSThemes,
    useWorkOSAudit,
    useWorkOSInvitations,
    useWorkOSMiddleware,
    useWorkOSPresence,
    useWorkOSRBAC,
    useWorkOSSessions,
    useWorkOSWebhooks,
} from './workos/composables';

export type {
    WorkOSWebhookConfig,
    WorkOSWebhookDelivery,
} from './workos/shared/types/webhooks';

export type {
    WorkOSDashboardStats,
    WorkOSDashboardUser,
    WorkOSOrganizationSession,
    WorkOSNewUserData,
} from './workos/shared/types/dashboard';
