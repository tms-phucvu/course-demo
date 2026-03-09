import { NextResponse } from "next/server";
import { getGmoSessionByOrderId } from "@/features/payment/gmo";

/**
 * Retrieves GMO transaction details by order ID for success page display.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json({ error: "Invalid order_id" }, { status: 400 });
  }

  const session = await getGmoSessionByOrderId(orderId);

  if (!session) {
    return NextResponse.json(
      { error: "Order not found or not yet processed" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    orderId: session.orderId,
    status: session.status,
    processDate: session.processDate,
    amount: session.amount,
    approve: session.approve,
    tranId: session.tranId,
  });
}
