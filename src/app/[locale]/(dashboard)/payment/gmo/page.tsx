import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GmoCheckoutCard } from "@/features/payment/gmo";

interface PaymentGmoPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentGmoPage({
  params,
  searchParams,
}: PaymentGmoPageProps) {
  const { locale } = await params;
  const resolved = await searchParams;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("nav");
  const orderId =
    typeof resolved.order_id === "string" ? resolved.order_id : null;
  const gmoSuccess = resolved.gmo === "success";
  const gmoCanceled = resolved.gmo === "canceled";

  return (
    <div className='payment-gmo space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t("paymentGmo")}</h1>
        <p className='text-muted-foreground mt-1'>
          GMO Payment Gateway integration. Click the button below to go to GMO
          Checkout.
        </p>
      </div>
      <GmoCheckoutCard
        successOrderId={orderId}
        gmoSuccess={gmoSuccess}
        gmoCanceled={gmoCanceled}
        returnPath='payment/gmo'
      />
    </div>
  );
}
