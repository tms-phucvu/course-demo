import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { StripeCheckoutCard } from "@/features/payment/stripe";

interface PaymentStripePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentStripePage({
  params,
  searchParams,
}: PaymentStripePageProps) {
  const { locale } = await params;
  const resolved = await searchParams;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("nav");
  const sessionId =
    typeof resolved.session_id === "string" ? resolved.session_id : null;
  const stripeSuccess = resolved.stripe === "success";
  const stripeCanceled = resolved.stripe === "canceled";

  return (
    <div className='payment-stripe space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>
          {t("paymentStripe")}
        </h1>
        <p className='text-muted-foreground mt-1'>
          Stripe payment integration. Click the button below to go to Stripe
          Checkout.
        </p>
      </div>
      <StripeCheckoutCard
        successSessionId={sessionId}
        stripeSuccess={stripeSuccess}
        stripeCanceled={stripeCanceled}
        returnPath='payment/stripe'
      />
    </div>
  );
}
