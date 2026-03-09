import { ENUMS } from "gmopg";
import { getGmoClient } from "./config";

export interface GmoExecTranParams {
  accessId: string;
  accessPass: string;
  orderId: string;
  amount: number;
  cardNo: string;
  expire: string;
  securityCode: string;
}

export interface GmoExecTranResult {
  success: true;
  approve: string;
  tranId: string;
  tranDate: string;
}

/**
 * Executes GMO card transaction (execTran) then captures (alterTran Sales).
 * Call only from server. For production, consider using GMO tokenization so card data does not touch your server.
 */
export async function execGmoTran(
  params: GmoExecTranParams
): Promise<GmoExecTranResult | { error: string }> {
  const client = getGmoClient();
  if (!client) {
    return { error: "GMO Payment Gateway is not configured" };
  }

  const {
    accessId,
    accessPass,
    orderId,
    amount,
    cardNo,
    expire,
    securityCode,
  } = params;

  try {
    const execRes = await client.execTran({
      AccessID: accessId,
      AccessPass: accessPass,
      OrderID: orderId,
      Method: ENUMS.Method.Lump,
      CardNo: cardNo.replace(/\s/g, ""),
      Expire: expire.replace(/\s/g, ""),
      SecurityCode: securityCode,
    });

    if (client.isError(execRes)) {
      const errInfo = "ErrInfo" in execRes ? String(execRes.ErrInfo) : "";
      const errCode = "ErrCode" in execRes ? String(execRes.ErrCode) : "";
      return {
        error: errInfo || errCode || "GMO execTran failed",
      };
    }

    // Capture: alterTran Sales (amount from entryTran)
    if (amount > 0) {
      const alterRes = await client.alterTran({
        AccessID: accessId,
        AccessPass: accessPass,
        JobCd: ENUMS.JobCd.Sales,
        Amount: amount,
      });
      if (client.isError(alterRes)) {
        const errInfo = "ErrInfo" in alterRes ? String(alterRes.ErrInfo) : "";
        return { error: errInfo || "GMO alterTran (capture) failed" };
      }
    }

    return {
      success: true,
      approve: execRes.Approve ?? "",
      tranId: execRes.TranID ?? "",
      tranDate: execRes.TranDate ?? "",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("GMO execTran error:", err);
    return { error: message };
  }
}
