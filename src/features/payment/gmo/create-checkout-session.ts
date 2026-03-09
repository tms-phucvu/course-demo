import { ENUMS } from "gmopg";
import type { CreateGmoCheckoutParams, GmoCheckoutSessionData } from "./types";
import { getGmoClient } from "./config";

/**
 * Creates a GMO payment session (entryTran). Returns session data used to redirect
 * user to the card entry form, then execTran on submit.
 * Amount in yen (JPY). JobCd Auth = pre-auth; capture via alterTran Sales later.
 * @see https://www.gmo-pg.com/
 */
export async function createGmoCheckoutSession(
  params: CreateGmoCheckoutParams
): Promise<{ session: GmoCheckoutSessionData } | { error: string }> {
  const client = getGmoClient();
  if (!client) {
    return { error: "GMO Payment Gateway is not configured" };
  }

  const { amount, clientReferenceId } = params;

  if (amount < 1) {
    return { error: "Amount must be at least 1" };
  }

  // Unique order ID (GMO requires unique per transaction)
  const orderId =
    clientReferenceId ??
    `gmo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  try {
    const entryRes = await client.entryTran({
      OrderID: orderId,
      JobCd: ENUMS.JobCd.Auth,
      Amount: amount,
    });

    if (client.isError(entryRes)) {
      const errInfo = "ErrInfo" in entryRes ? String(entryRes.ErrInfo) : "";
      const errCode = "ErrCode" in entryRes ? String(entryRes.ErrCode) : "";
      return {
        error: errInfo || errCode || "GMO entryTran failed",
      };
    }

    const { AccessID, AccessPass } = entryRes;
    return {
      session: {
        accessId: AccessID,
        accessPass: AccessPass,
        orderId,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("GMO createCheckoutSession (entryTran) error:", err);
    return { error: message };
  }
}
