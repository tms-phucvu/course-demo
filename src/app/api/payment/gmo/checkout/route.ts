import { NextResponse } from "next/server";
import { createGmoCheckoutSession } from "@/features/payment/gmo";

function getBaseUrl(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto === "https" ? "https" : "http"}://${host}`;
  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = Number(body.amount ?? 2000); // default 2000 JPY
    const productName = (body.productName as string) ?? "Sample payment";
    const customerEmail = body.customerEmail as string | undefined;
    const clientReferenceId = body.clientReferenceId as string | undefined;

    const result = await createGmoCheckoutSession({
      amount,
      productName,
      customerEmail,
      clientReferenceId,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const baseUrl = getBaseUrl(request);
    const successPath =
      (body.successPath as string)?.replace(/^\//, "") ?? "payment/gmo";
    const cancelPath =
      (body.cancelPath as string)?.replace(/^\//, "") ?? "payment/gmo";
    const locale = (body.locale as string) ?? "en";

    // Redirect URL to our card entry page (access data in query for server-side exec)
    const params = new URLSearchParams({
      access_id: result.session.accessId,
      access_pass: result.session.accessPass,
      order_id: result.session.orderId,
      amount: String(amount),
      success_path: successPath,
      cancel_path: cancelPath,
    });
    const checkoutPath = `${locale}/payment/gmo/checkout`;
    const url = `${baseUrl}/${checkoutPath}?${params.toString()}`;

    return NextResponse.json({
      url,
      session: {
        accessId: result.session.accessId,
        orderId: result.session.orderId,
      },
      amount,
    });
  } catch (err) {
    console.error("GMO checkout POST error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
