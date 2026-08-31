import { describe, expect, it } from 'vitest';
import { ExtractedInvoiceSchema, InvoiceLineItemSchema } from './schema.js';

describe('InvoiceLineItemSchema', () => {
  it('validates a valid line item', () => {
    const valid = {
      description: 'Consulting Services',
      quantity: 10,
      unit_price: 150.0,
      line_total: 1500.0,
    };
    const parsed = InvoiceLineItemSchema.parse(valid);
    expect(parsed).toEqual(valid);
  });

  it('rejects empty description or non-positive quantity', () => {
    expect(() =>
      InvoiceLineItemSchema.parse({
        description: '',
        quantity: 5,
        unit_price: 10,
        line_total: 50,
      })
    ).toThrow();

    expect(() =>
      InvoiceLineItemSchema.parse({
        description: 'Item',
        quantity: 0,
        unit_price: 10,
        line_total: 0,
      })
    ).toThrow();

    expect(() =>
      InvoiceLineItemSchema.parse({
        description: 'Item',
        quantity: 1,
        unit_price: -5,
        line_total: -5,
      })
    ).toThrow();
  });
});

describe('ExtractedInvoiceSchema', () => {
  const validInvoice = {
    vendor_name: 'Acme Corp',
    vendor_address_street: '123 Main St',
    vendor_address_city_state_zip: 'Seattle, WA 98101',
    invoice_number: 'INV-2026-001',
    invoice_date: '2026-05-01',
    due_date: '2026-06-01',
    line_items: [
      {
        description: 'Cloud Hosting',
        quantity: 1,
        unit_price: 500,
        line_total: 500,
      },
    ],
    subtotal: 500,
    tax_rate: 0.1,
    tax_amount: 50,
    total: 550,
  };

  it('validates a valid invoice with nullable due_date', () => {
    const parsed = ExtractedInvoiceSchema.parse(validInvoice);
    expect(parsed.invoice_number).toBe('INV-2026-001');

    const parsedNullDue = ExtractedInvoiceSchema.parse({
      ...validInvoice,
      due_date: null,
    });
    expect(parsedNullDue.due_date).toBeNull();
  });

  it('rejects invalid date formats', () => {
    expect(() =>
      ExtractedInvoiceSchema.parse({
        ...validInvoice,
        invoice_date: '05/01/2026',
      })
    ).toThrow(/expected YYYY-MM-DD/);

    expect(() =>
      ExtractedInvoiceSchema.parse({
        ...validInvoice,
        due_date: '2026/06/01',
      })
    ).toThrow(/expected YYYY-MM-DD/);
  });

  it('rejects tax rate out of [0, 1] range or negative totals', () => {
    expect(() =>
      ExtractedInvoiceSchema.parse({
        ...validInvoice,
        tax_rate: 1.5,
      })
    ).toThrow();

    expect(() =>
      ExtractedInvoiceSchema.parse({
        ...validInvoice,
        tax_rate: -0.05,
      })
    ).toThrow();

    expect(() =>
      ExtractedInvoiceSchema.parse({
        ...validInvoice,
        total: -10,
      })
    ).toThrow();
  });

  it('rejects empty line items or missing vendor details', () => {
    expect(() =>
      ExtractedInvoiceSchema.parse({
        ...validInvoice,
        line_items: [],
      })
    ).toThrow();

    expect(() =>
      ExtractedInvoiceSchema.parse({
        ...validInvoice,
        vendor_name: '',
      })
    ).toThrow();
  });
});
