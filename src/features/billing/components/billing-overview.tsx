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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { ChevronRight, CreditCard, FileCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FAKE_PAYMENT_METHODS = [
  { name: "Hieu Nguyen", last4: "0392", primary: true, expired: "Dec 2028" },
  { name: "Hieu Nguyen", last4: "0222", primary: true, expired: "Sep 2028" },
] as const;

const FAKE_TRANSACTIONS = [
  {
    reference: "#36223",
    product: "Mock premium pack",
    status: "pending" as const,
    date: "12/10/2025",
    amount: "$20.00",
    invoiceNumber: "4LNHNAKO-0002",
    chargeAmountLocal: "₫544,323",
    paymentMethodDisplay: "Visa •••• 2053",
    paymentDate: "25 January 2026",
  },
  {
    reference: "#34283",
    product: "Enterprise plan subscription",
    status: "paid" as const,
    date: "11/13/2025",
    amount: "$159.90",
    invoiceNumber: "4LNHNAKO-0001",
    chargeAmountLocal: "₫4,350,000",
    paymentMethodDisplay: "Visa •••• 2053",
    paymentDate: "25 January 2026",
  },
  {
    reference: "#32234",
    product: "Business board pro license",
    status: "paid" as const,
    date: "10/13/2025",
    amount: "$8.00",
    invoiceNumber: "4LNHNAKO-0000",
    chargeAmountLocal: "₫218,000",
    paymentMethodDisplay: "Visa •••• 2053",
    paymentDate: "25 January 2026",
  },
] as const;

interface StripeSessionDetails {
  payment_status: string;
  customer_email: string | null;
  customer_name: string | null;
  amount_total: number | null;
  currency: string | null;
}

interface BillingOverviewProps {
  stripeSessionId?: string | null;
  stripeSuccess?: boolean;
  stripeCanceled?: boolean;
}

export function BillingOverview({
  stripeSessionId,
  stripeSuccess,
  stripeCanceled,
}: BillingOverviewProps = {}) {
  const t = useTranslations("billing");
  const tCommon = useTranslations("common");
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<
    (typeof FAKE_TRANSACTIONS)[number] | null
  >(null);
  const [stripeSessionDetails, setStripeSessionDetails] =
    useState<StripeSessionDetails | null>(null);
  const [stripeCheckoutLoading, setStripeCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!stripeSuccess || !stripeSessionId) return;
    fetch(`/api/payment/stripe/session/${stripeSessionId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setStripeSessionDetails(data))
      .catch(() => {});
  }, [stripeSuccess, stripeSessionId]);

  const handleStripeCheckout = async () => {
    setStripeCheckoutLoading(true);
    try {
      const res = await fetch("/api/payment/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 2000,
          currency: "usd",
          productName: "Sample payment ($20.00)",
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
      setStripeCheckoutLoading(false);
    }
  };

  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("addPaymentSuccess"));
    setAddPaymentOpen(false);
  };

  return (
    <div className='BillingOverview space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t("title")}</h1>
        <p className='text-muted-foreground mt-1'>{t("description")}</p>
      </div>

      {stripeSuccess && (
        <Alert className='border-green-500/50 bg-green-500/5'>
          <CreditCard className='h-4 w-4' />
          <AlertTitle>{t("stripeSuccessTitle")}</AlertTitle>
          <AlertDescription>
            {stripeSessionDetails?.customer_email
              ? t("stripeSuccessMessageWithEmail", {
                  email: stripeSessionDetails.customer_email,
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

      <Card>
        <CardHeader>
          <CardTitle>{t("stripeCheckoutCardTitle")}</CardTitle>
          <CardDescription>
            {t("stripeCheckoutCardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleStripeCheckout}
            disabled={stripeCheckoutLoading}
            className='gap-2'
          >
            <CreditCard className='h-4 w-4' />
            {stripeCheckoutLoading
              ? tCommon("loading")
              : t("checkoutWithStripe")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("planSection")}</CardTitle>
          <CardDescription>{t("currentPlanDescription")}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm'>
            {t("planMonthly")} |{" "}
            {t("nextPaymentOn", { date: "02/09/2025", amount: "$59.90" })}
          </p>
          <Button variant='outline' size='sm' asChild>
            <Link href='/profile/settings?tab=role'>{t("changePlan")}</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className='flex flex-col gap-6'>
        <CardHeader>
          <CardTitle>{t("paymentMethod")}</CardTitle>
          <CardDescription>{t("paymentMethodDescription")}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <div className='flex flex-col gap-4'>
            {FAKE_PAYMENT_METHODS.map((pm) => (
              <div
                key={pm.last4}
                className='bg-muted/30 flex flex-wrap items-center justify-between gap-2 rounded-lg border px-4 py-3'
              >
                <div className='flex flex-wrap items-center gap-2'>
                  <span className='font-medium'>
                    {pm.name} •••• {pm.last4}
                  </span>
                  {pm.primary && (
                    <span className='bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium'>
                      {t("primary")}
                    </span>
                  )}
                  <span className='text-muted-foreground text-sm'>
                    {t("expired")} {pm.expired}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setAddPaymentOpen(true)}
          >
            {t("addPaymentMethod")}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={addPaymentOpen} onOpenChange={setAddPaymentOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t("addPaymentMethod")}</DialogTitle>
            <DialogDescription>{t("addPaymentDescription")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPaymentSubmit} className='grid gap-4 py-2'>
            <div className='grid gap-2'>
              <Label htmlFor='card-name'>{t("cardName")}</Label>
              <Input
                id='card-name'
                placeholder={t("cardNamePlaceholder")}
                aria-label={t("cardName")}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='card-number'>{t("cardNumber")}</Label>
              <Input
                id='card-number'
                placeholder='4242 4242 4242 4242'
                aria-label={t("cardNumber")}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='card-expiry'>{t("cardExpiry")}</Label>
                <Input
                  id='card-expiry'
                  placeholder='MM/YY'
                  aria-label={t("cardExpiry")}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='card-cvc'>{t("cardCvc")}</Label>
                <Input
                  id='card-cvc'
                  placeholder='CVC'
                  aria-label={t("cardCvc")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setAddPaymentOpen(false)}
              >
                {tCommon("cancel")}
              </Button>
              <Button type='submit'>{t("addCard")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>{t("transactionHistory")}</CardTitle>
          <CardDescription>{t("billingHistoryDescription")}</CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <div className='overflow-x-auto rounded-md border'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-muted/50 border-b'>
                  <th className='px-4 py-3 text-left font-medium'>
                    {t("reference")}
                  </th>
                  <th className='px-4 py-3 text-left font-medium'>
                    {t("product")}
                  </th>
                  <th className='px-4 py-3 text-left font-medium'>
                    {t("status")}
                  </th>
                  <th className='px-4 py-3 text-left font-medium'>
                    {t("date")}
                  </th>
                  <th className='px-4 py-3 text-right font-medium'>
                    {t("amount")}
                  </th>
                  <th
                    className='px-4 py-3 text-right font-medium'
                    aria-label='Actions'
                  >
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FAKE_TRANSACTIONS.map((row) => (
                  <tr key={row.reference} className='border-b last:border-0'>
                    <td className='px-4 py-3 font-medium'>{row.reference}</td>
                    <td className='text-muted-foreground px-4 py-3'>
                      {row.product}
                    </td>
                    <td className='px-4 py-3'>
                      <span
                        className={
                          row.status === "paid"
                            ? "rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400"
                            : "rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400"
                        }
                      >
                        {row.status === "paid" ? t("paid") : t("pending")}
                      </span>
                    </td>
                    <td className='text-muted-foreground px-4 py-3'>
                      {row.date}
                    </td>
                    <td className='px-4 py-3 text-right font-medium'>
                      {row.amount}
                    </td>
                    <td className='px-4 py-3 text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8'
                        onClick={() => setSelectedInvoice(row)}
                      >
                        {t("viewInvoice")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      >
        <DialogContent className='InvoiceDetailModal sm:max-w-md'>
          {selectedInvoice && (
            <>
              <div className='flex flex-col gap-4 py-2'>
                <div className='flex items-start gap-3'>
                  <div className='rounded-full bg-green-500/10 p-2'>
                    <FileCheck className='h-6 w-6 text-green-600 dark:text-green-400' />
                  </div>
                  <div className='flex-1 space-y-1'>
                    <p className='text-muted-foreground text-sm'>
                      {t("invoicePaid")}
                    </p>
                    <p className='text-2xl font-bold tracking-tight'>
                      {selectedInvoice.amount.startsWith("$")
                        ? `${selectedInvoice.amount}`
                        : selectedInvoice.amount}
                    </p>
                    <button
                      type='button'
                      className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm underline'
                      onClick={() => setSelectedInvoice(null)}
                    >
                      {t("viewInvoiceAndPaymentDetails")}
                      <ChevronRight className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <dl className='grid gap-3 border-t pt-4'>
                  <div className='flex justify-between text-sm'>
                    <dt className='text-muted-foreground'>
                      {t("chargeAmount")}
                    </dt>
                    <dd className='font-medium'>
                      {selectedInvoice.chargeAmountLocal}
                    </dd>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <dt className='text-muted-foreground'>
                      {t("invoiceNumber")}
                    </dt>
                    <dd className='font-medium'>
                      {selectedInvoice.invoiceNumber}
                    </dd>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <dt className='text-muted-foreground'>
                      {t("paymentDate")}
                    </dt>
                    <dd className='font-medium'>
                      {selectedInvoice.paymentDate}
                    </dd>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <dt className='text-muted-foreground'>
                      {t("paymentMethod")}
                    </dt>
                    <dd className='font-medium'>
                      {selectedInvoice.paymentMethodDisplay}
                    </dd>
                  </div>
                </dl>
              </div>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setSelectedInvoice(null)}
                >
                  {tCommon("close")}
                </Button>
                <a
                  href={`/api/invoice/${selectedInvoice.reference.replace("#", "")}/download`}
                  download={`invoice-${selectedInvoice.reference.replace("#", "")}.pdf`}
                  className='inline-flex'
                >
                  <Button type='button'>{t("downloadInvoice")}</Button>
                </a>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
