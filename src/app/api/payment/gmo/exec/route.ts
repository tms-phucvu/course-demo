import { NextResponse } from "next/server";
import { execGmoTran } from "@/features/payment/gmo";

/**
 * Executes GMO card transaction (execTran + alterTran Sales).
 * Receives card data from our checkout form. For production, use GMO tokenization (MpToken.js) so card data does not touch your server.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const accessId = body.accessId as string;
    const accessPass = body.accessPass as string;
    const orderId = body.orderId as string;
    const amount = Number(body.amount);
    const cardNo = (body.cardNo as string)?.trim() ?? "";
    const expire = (body.expire as string)?.trim() ?? "";
    const securityCode = (body.securityCode as string)?.trim() ?? "";

    if (!accessId || !accessPass || !orderId || amount < 1) {
      return NextResponse.json(
        { error: "Missing or invalid session data" },
        { status: 400 }
      );
    }

    if (!cardNo || !expire || !securityCode) {
      return NextResponse.json(
        { error: "Card number, expiry, and security code are required" },
        { status: 400 }
      );
    }

    const result = await execGmoTran({
      accessId,
      accessPass,
      orderId,
      amount,
      cardNo,
      expire,
      securityCode,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      orderId: result.tranId ? orderId : undefined,
      approve: result.approve,
      tranId: result.tranId,
      tranDate: result.tranDate,
    });
  } catch (err) {
    console.error("GMO exec POST error:", err);
    return NextResponse.json(
      { error: "Payment execution failed" },
      { status: 500 }
    );
  }
}
