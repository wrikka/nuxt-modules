import { getStripe } from './stripe-server';
import type {
  CreatePortalConfigurationParams,
  CreatePortalSessionParams,
  CustomerPortalConfiguration,
  CustomerPortalSession,
  UpdatePortalConfigurationParams,
} from '#wpayment/types';

export async function createPortalConfiguration(
  params: CreatePortalConfigurationParams,
): Promise<CustomerPortalConfiguration> {
  const stripe = getStripe();

  const config = await stripe.billingPortal.configurations.create({
    business_profile: params.business_profile,
    default_return_url: params.default_return_url,
    features: params.features,
    metadata: params.metadata,
  });

  return config as unknown as CustomerPortalConfiguration;
}

export async function retrievePortalConfiguration(
  configurationId: string,
): Promise<CustomerPortalConfiguration> {
  const stripe = getStripe();
  const config = await stripe.billingPortal.configurations.retrieve(configurationId);
  return config as unknown as CustomerPortalConfiguration;
}

export async function updatePortalConfiguration(
  params: UpdatePortalConfigurationParams,
): Promise<CustomerPortalConfiguration> {
  const stripe = getStripe();

  const config = await stripe.billingPortal.configurations.update(params.configurationId, {
    active: params.active,
    business_profile: params.business_profile,
    default_return_url: params.default_return_url,
    features: params.features,
    metadata: params.metadata,
  });

  return config as unknown as CustomerPortalConfiguration;
}

export async function listPortalConfigurations(): Promise<CustomerPortalConfiguration[]> {
  const stripe = getStripe();
  const configs = await stripe.billingPortal.configurations.list();
  return configs.data as unknown as CustomerPortalConfiguration[];
}

export async function createPortalSession(
  params: CreatePortalSessionParams,
): Promise<CustomerPortalSession> {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: params.customer,
    configuration: params.configuration,
    flow_data: params.flow_data,
    locale: params.locale,
    on_behalf_of: params.on_behalf_of,
    return_url: params.return_url,
  });

  return session as unknown as CustomerPortalSession;
}

export async function getPortalUrl(
  customerId: string,
  returnUrl?: string,
): Promise<string> {
  const session = await createPortalSession({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}
