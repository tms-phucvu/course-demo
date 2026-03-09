/**
 * Input to create a one-time payment Checkout Session.
 * Amount in smallest currency unit (e.g. cents for USD).
 */
export interface CreateStripeCheckoutParams {
  amount: number;
  currency?: string;
  productName?: string;
  customerEmail?: string;
  /** Optional: store your order/payment reference for fulfillment */
  clientReferenceId?: string;
}

export interface StripeCheckoutSuccessSession {
  id: string;
  payment_status: string;
  customer_details: {
    email?: string | null;
    name?: string | null;
  } | null;
  amount_total: number | null;
  currency: string | null;
}
