"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StripeSessionDetails {
  payment_status: string;
  customer_email: string | null;
  amount_total: number | null;
  currency: string | null;
}

interface StripeCheckoutCardProps {
  successSessionId?: string | null;
  stripeSuccess?: boolean;
  stripeCanceled?: boolean;
  /** Path to return after checkout (e.g. "payment/stripe"). Success/cancel URLs will use this. */
  returnPath?: string;
}

export function StripeCheckoutCard({
  successSessionId,
  stripeSuccess,
  stripeCanceled,
  returnPath = "payment/stripe",
}: StripeCheckoutCardProps) {
  const t = useTranslations("billing");
  const tCommon = useTranslations("common");
  const [sessionDetails, setSessionDetails] =
    useState<StripeSessionDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripeSuccess || !successSessionId) return;
    fetch(`/api/payment/stripe/session/${successSessionId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSessionDetails(data))
      .catch(() => {});
  }, [stripeSuccess, successSessionId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 2000,
          currency: "usd",
          productName: "Sample payment ($20.00)",
          successPath: returnPath,
          cancelPath: returnPath,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No redirect URL");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("stripeCheckoutError")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='StripeCheckoutCard space-y-4'>
      {stripeSuccess && (
        <Alert className='border-green-500/50 bg-green-500/5'>
          <CreditCard className='h-4 w-4' />
          <AlertTitle>{t("stripeSuccessTitle")}</AlertTitle>
          <AlertDescription>
            {sessionDetails?.customer_email
              ? t("stripeSuccessMessageWithEmail", {
                  email: sessionDetails.customer_email,
                })
              : t("stripeSuccessMessage")}
          </AlertDescription>
        </Alert>
      )}
      {stripeCanceled && (
        <Alert variant='destructive'>
          <AlertTitle>{t("stripeCanceledTitle")}</AlertTitle>
          <AlertDescription>{t("stripeCanceledMessage")}</AlertDescription>
        </Alert>
      )}
      <Card className='overflow-hidden'>
        <div className='bg-muted/40 border-b px-6 py-3'>
          <span className='inline-flex items-center rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400'>
            {t("stripeTestModeBadge")}
          </span>
        </div>
        <CardHeader className='space-y-2 pb-2'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <CreditCard className='text-muted-foreground h-5 w-5' />
            {t("stripeCheckoutCardTitle")}
          </CardTitle>
          <CardDescription className='text-sm leading-relaxed'>
            {t("stripeTestModeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 pt-0'>
          <p className='bg-muted/30 text-foreground rounded-lg border px-4 py-3 text-sm font-medium'>
            {t("stripeAmountNotice", { amount: "$20.00" })}
          </p>
          <Button
            onClick={handleCheckout}
            disabled={loading}
            className='w-full gap-2 sm:w-auto'
            size='lg'
          >
            <CreditCard className='h-4 w-4' />
            {loading ? tCommon("loading") : t("checkoutWithStripe")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
