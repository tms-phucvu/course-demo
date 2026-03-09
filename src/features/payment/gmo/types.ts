/**
 * Input to create a GMO payment session (entryTran).
 * Amount in yen (JPY).
 */
export interface CreateGmoCheckoutParams {
  amount: number;
  productName?: string;
  customerEmail?: string;
  /** Optional: your order/payment reference */
  clientReferenceId?: string;
}

/**
 * Session data returned after entryTran. Used to redirect user to card form and then execTran.
 */
export interface GmoCheckoutSessionData {
  accessId: string;
  accessPass: string;
  orderId: string;
}

/**
 * Result of searchTrade for success page display.
 */
export interface GmoCheckoutSuccessSession {
  orderId: string;
  status: string;
  processDate: string;
  amount: string;
  approve: string;
  tranId: string;
}
