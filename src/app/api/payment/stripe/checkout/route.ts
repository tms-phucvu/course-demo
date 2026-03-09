import { NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/features/payment/stripe";

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
    const amount = Number(body.amount ?? 2000); // default 20.00 USD in cents
    const currency = (body.currency as string) ?? "usd";
    const productName = (body.productName as string) ?? "Sample payment";
    const customerEmail = body.customerEmail as string | undefined;
    const clientReferenceId = body.clientReferenceId as string | undefined;

    const baseUrl = getBaseUrl(request);
    const successPath =
      (body.successPath as string)?.replace(/^\//, "") ?? "billing";
    const cancelPath =
      (body.cancelPath as string)?.replace(/^\//, "") ?? "billing";
    const successUrl = `${baseUrl}/${successPath}?session_id={CHECKOUT_SESSION_ID}&stripe=success`;
    const cancelUrl = `${baseUrl}/${cancelPath}?stripe=canceled`;

    const result = await createStripeCheckoutSession(
      {
        amount,
        currency,
        productName,
        customerEmail,
        clientReferenceId,
      },
      { successUrl, cancelUrl }
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error("Stripe checkout POST error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
