import { createInvoice, finalizeInvoice, toUnifiedInvoice } from '../../../app/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { customerId, items, description, dueDays, autoAdvance, defaultTaxRates, metadata } = body;

  if (!customerId || !items || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer ID and items are required',
    });
  }

  try {
    // Create invoice
    const invoice = await createInvoice({
      customer: customerId,
      description,
      due_days: dueDays,
      auto_advance: autoAdvance,
      default_tax_rates: defaultTaxRates,
      metadata,
    });

    // Add invoice items
    const { createInvoiceItem } = await import('../../../app/utils/stripe-server');
    for (const item of items) {
      await createInvoiceItem({
        customer: customerId,
        invoice: invoice.id,
        description: item.description,
        amount: item.amount,
        currency: item.currency,
        quantity: item.quantity,
        tax_rates: item.taxRates,
      });
    }

    // Finalize if auto_advance is true
    if (autoAdvance !== false) {
      const finalized = await finalizeInvoice(invoice.id);
      return toUnifiedInvoice(finalized);
    }

    return toUnifiedInvoice(invoice);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: err instanceof Error ? err.message : 'Failed to create invoice',
    });
  }
});
