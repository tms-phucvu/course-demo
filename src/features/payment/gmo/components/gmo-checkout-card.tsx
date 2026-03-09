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
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GmoSessionDetails {
  orderId: string;
  status: string;
  amount: string;
  processDate: string;
}

interface GmoCheckoutCardProps {
  successOrderId?: string | null;
  gmoSuccess?: boolean;
  gmoCanceled?: boolean;
  /** Path to return after checkout (e.g. "payment/gmo"). Success/cancel URLs will use this. */
  returnPath?: string;
}

const DEFAULT_AMOUNT_JPY = 2000;

export function GmoCheckoutCard({
  successOrderId,
  gmoSuccess,
  gmoCanceled,
  returnPath = "payment/gmo",
}: GmoCheckoutCardProps) {
  const t = useTranslations("billing");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [sessionDetails, setSessionDetails] =
    useState<GmoSessionDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gmoSuccess || !successOrderId) return;
    fetch(`/api/payment/gmo/session/${successOrderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setSessionDetails(data))
      .catch(() => {});
  }, [gmoSuccess, successOrderId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment/gmo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: DEFAULT_AMOUNT_JPY,
          productName: "Sample payment (¥2,000)",
          successPath: returnPath,
          cancelPath: returnPath,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No redirect URL");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("gmoCheckoutError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='GmoCheckoutCard space-y-4'>
      {gmoSuccess && (
        <Alert className='border-green-500/50 bg-green-500/5'>
          <CreditCard className='h-4 w-4' />
          <AlertTitle>{t("gmoSuccessTitle")}</AlertTitle>
          <AlertDescription>
            {sessionDetails?.amount
              ? t("gmoSuccessMessageWithAmount", {
                  amount: `¥${Number(sessionDetails.amount).toLocaleString()}`,
                })
              : t("gmoSuccessMessage")}
          </AlertDescription>
        </Alert>
      )}
      {gmoCanceled && (
        <Alert variant='destructive'>
          <AlertTitle>{t("gmoCanceledTitle")}</AlertTitle>
          <AlertDescription>{t("gmoCanceledMessage")}</AlertDescription>
        </Alert>
      )}
      <Card className='overflow-hidden'>
        <div className='bg-muted/40 border-b px-6 py-3'>
          <span className='inline-flex items-center rounded-md border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400'>
            {t("gmoTestModeBadge")}
          </span>
        </div>
        <CardHeader className='space-y-2 pb-2'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <CreditCard className='text-muted-foreground h-5 w-5' />
            {t("gmoCheckoutCardTitle")}
          </CardTitle>
          <CardDescription className='text-sm leading-relaxed'>
            {t("gmoTestModeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 pt-0'>
          <p className='bg-muted/30 text-foreground rounded-lg border px-4 py-3 text-sm font-medium'>
            {t("gmoAmountNotice", { amount: "¥2,000" })}
          </p>
          <Button
            onClick={handleCheckout}
            disabled
            className='w-full gap-2 sm:w-auto'
            size='lg'
          >
            <CreditCard className='h-4 w-4' />
            {loading ? tCommon("loading") : t("checkoutWithGmo")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
