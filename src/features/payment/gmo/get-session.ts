import type { GmoCheckoutSuccessSession } from "./types";
import { getGmoClient } from "./config";

/**
 * Retrieves GMO transaction details by order ID (searchTrade).
 * Used on success page to show payment details.
 */
export async function getGmoSessionByOrderId(
  orderId: string
): Promise<GmoCheckoutSuccessSession | null> {
  const client = getGmoClient();
  if (!client) return null;

  if (!orderId || orderId.length > 27) {
    return null;
  }

  try {
    const res = await client.searchTrade({ OrderID: orderId });

    if (client.isError(res)) {
      return null;
    }

    return {
      orderId: res.OrderID,
      status: res.Status ?? "",
      processDate: res.ProcessDate ?? "",
      amount: res.Amount ?? "",
      approve: res.Approve ?? "",
      tranId: res.TranID ?? "",
    };
  } catch {
    return null;
  }
}
