import { getStripe } from './stripe-server';
import type {
  CreatePriceParams,
  CreateProductParams,
  ListProductsParams,
  PriceDetails,
  ProductDetails,
  UpdatePriceParams,
  UpdateProductParams,
} from '#wpayment/types';

// Price Operations
export async function createPrice(params: CreatePriceParams): Promise<PriceDetails> {
  const stripe = getStripe();

  const price = await stripe.prices.create({
    currency: params.currency,
    product: params.product,
    active: params.active,
    billing_scheme: params.billing_scheme,
    custom_unit_amount: params.custom_unit_amount,
    lookup_key: params.lookup_key,
    metadata: params.metadata,
    nickname: params.nickname,
    recurring: params.recurring,
    tax_behavior: params.tax_behavior,
    tiers: params.tiers,
    tiers_mode: params.tiers_mode,
    transform_quantity: params.transform_quantity,
    unit_amount: params.unit_amount,
    unit_amount_decimal: params.unit_amount_decimal,
  });

  return price as unknown as PriceDetails;
}

export async function retrievePrice(priceId: string): Promise<PriceDetails> {
  const stripe = getStripe();
  const price = await stripe.prices.retrieve(priceId);
  return price as unknown as PriceDetails;
}

export async function updatePrice(params: UpdatePriceParams): Promise<PriceDetails> {
  const stripe = getStripe();

  const price = await stripe.prices.update(params.priceId, {
    active: params.active,
    lookup_key: params.lookup_key,
    metadata: params.metadata,
    nickname: params.nickname,
    tax_behavior: params.tax_behavior,
  });

  return price as unknown as PriceDetails;
}

export async function listPrices(productId?: string): Promise<PriceDetails[]> {
  const stripe = getStripe();

  const prices = await stripe.prices.list({
    product: productId,
  });

  return prices.data as unknown as PriceDetails[];
}

export async function searchPrices(query: string): Promise<PriceDetails[]> {
  const stripe = getStripe();

  const result = await stripe.prices.search({
    query,
  });

  return result.data as unknown as PriceDetails[];
}

// Product Operations
export async function createProduct(params: CreateProductParams): Promise<ProductDetails> {
  const stripe = getStripe();

  const product = await stripe.products.create({
    name: params.name,
    active: params.active,
    attributes: params.attributes,
    default_price: params.default_price,
    description: params.description,
    images: params.images,
    marketing_features: params.marketing_features,
    metadata: params.metadata,
    package_dimensions: params.package_dimensions,
    shippable: params.shippable,
    statement_descriptor: params.statement_descriptor,
    tax_code: params.tax_code,
    type: params.type,
    unit_label: params.unit_label,
    url: params.url,
  });

  return product as unknown as ProductDetails;
}

export async function retrieveProduct(productId: string): Promise<ProductDetails> {
  const stripe = getStripe();
  const product = await stripe.products.retrieve(productId);
  return product as unknown as ProductDetails;
}

export async function updateProduct(params: UpdateProductParams): Promise<ProductDetails> {
  const stripe = getStripe();

  const product = await stripe.products.update(params.productId, {
    active: params.active,
    default_price: params.default_price,
    description: params.description,
    images: params.images,
    marketing_features: params.marketing_features,
    metadata: params.metadata,
    name: params.name,
    package_dimensions: params.package_dimensions,
    shippable: params.shippable,
    statement_descriptor: params.statement_descriptor,
    tax_code: params.tax_code,
    unit_label: params.unit_label,
    url: params.url,
  });

  return product as unknown as ProductDetails;
}

export async function deleteProduct(productId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.products.del(productId);
}

export async function listProducts(params?: ListProductsParams): Promise<ProductDetails[]> {
  const stripe = getStripe();

  const products = await stripe.products.list({
    active: params?.active,
    created: params?.created,
    ending_before: params?.ending_before,
    ids: params?.ids,
    limit: params?.limit,
    shippable: params?.shippable,
    starting_after: params?.starting_after,
    url: params?.url,
  });

  return products.data as unknown as ProductDetails[];
}

export async function searchProducts(query: string): Promise<ProductDetails[]> {
  const stripe = getStripe();

  const result = await stripe.products.search({
    query,
  });

  return result.data as unknown as ProductDetails[];
}
