"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

function PaymentGmoCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("billing");
  const tCommon = useTranslations("common");

  const accessId = searchParams.get("access_id");
  const accessPass = searchParams.get("access_pass");
  const orderId = searchParams.get("order_id");
  const amountParam = searchParams.get("amount");
  const successPath = searchParams.get("success_path") ?? "payment/gmo";
  const cancelPath = searchParams.get("cancel_path") ?? "payment/gmo";

  const amount = amountParam ? Number(amountParam) : 0;

  const [cardNo, setCardNo] = useState("");
  const [expire, setExpire] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [loading, setLoading] = useState(false);

  const hasSession = Boolean(accessId && accessPass && orderId && amount > 0);

  useEffect(() => {
    if (!hasSession) {
      router.replace(`/${locale}/${cancelPath}?gmo=canceled`);
    }
  }, [hasSession, locale, cancelPath, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!accessId || !accessPass || !orderId || amount < 1) return;
      setLoading(true);
      try {
        const res = await fetch("/api/payment/gmo/exec", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessId,
            accessPass,
            orderId,
            amount,
            cardNo: cardNo.replace(/\s/g, ""),
            expire: expire.replace(/\s/g, ""),
            securityCode,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Payment failed");
        if (data.success) {
          router.replace(
            `/${locale}/${successPath}?order_id=${encodeURIComponent(orderId)}&gmo=success`
          );
          return;
        }
        throw new Error("Payment did not succeed");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("gmoCheckoutError"));
      } finally {
        setLoading(false);
      }
    },
    [
      accessId,
      accessPass,
      orderId,
      amount,
      cardNo,
      expire,
      securityCode,
      locale,
      successPath,
      router,
      t,
    ]
  );

  const handleCancel = useCallback(() => {
    router.replace(`/${locale}/${cancelPath}?gmo=canceled`);
  }, [locale, cancelPath, router]);

  if (!hasSession) {
    return (
      <div className='payment-gmo-checkout flex min-h-[200px] items-center justify-center'>
        <p className='text-muted-foreground'>{tCommon("loading")}</p>
      </div>
    );
  }

  return (
    <div className='payment-gmo-checkout max-w-md space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>
          {t("gmoCheckoutPageTitle")}
        </h1>
        <p className='text-muted-foreground mt-1'>
          {t("gmoCheckoutPageDescription", {
            amount: `¥${amount.toLocaleString()}`,
          })}
        </p>
      </div>
      <Card>
        <CardHeader className='space-y-2 pb-2'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <CreditCard className='text-muted-foreground h-5 w-5' />
            {t("gmoCardFormTitle")}
          </CardTitle>
          <CardDescription className='text-sm leading-relaxed'>
            {t("gmoCardFormDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='GmoCheckoutForm space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='gmo-card-no'>{t("cardNumber")}</Label>
              <Input
                id='gmo-card-no'
                type='text'
                inputMode='numeric'
                autoComplete='cc-number'
                placeholder='4111111111111111'
                value={cardNo}
                onChange={(e) =>
                  setCardNo(e.target.value.replace(/\D/g, "").slice(0, 16))
                }
                maxLength={19}
                className='font-mono'
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='gmo-expire'>{t("cardExpiry")}</Label>
                <Input
                  id='gmo-expire'
                  type='text'
                  inputMode='numeric'
                  autoComplete='cc-exp'
                  placeholder='2512'
                  value={expire}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setExpire(v);
                  }}
                  maxLength={4}
                  className='font-mono'
                />
                <p className='text-muted-foreground text-xs'>
                  {t("cardExpiryFormat")}
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='gmo-cvc'>{t("cardCvc")}</Label>
                <Input
                  id='gmo-cvc'
                  type='text'
                  inputMode='numeric'
                  autoComplete='cc-csc'
                  placeholder='123'
                  value={securityCode}
                  onChange={(e) =>
                    setSecurityCode(
                      e.target.value.replace(/\D/g, "").slice(0, 4)
                    )
                  }
                  maxLength={4}
                  className='font-mono'
                />
              </div>
            </div>
            <div className='flex gap-3 pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={loading}
              >
                {tCommon("cancel")}
              </Button>
              <Button type='submit' disabled={loading} className='gap-2'>
                <CreditCard className='h-4 w-4' />
                {loading ? tCommon("loading") : t("submitPayment")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentGmoCheckoutFallback() {
  return (
    <div className='payment-gmo-checkout flex min-h-[200px] items-center justify-center'>
      <p className='text-muted-foreground'>Loading...</p>
    </div>
  );
}

export default function PaymentGmoCheckoutPage() {
  return (
    <Suspense fallback={<PaymentGmoCheckoutFallback />}>
      <PaymentGmoCheckoutContent />
    </Suspense>
  );
}
