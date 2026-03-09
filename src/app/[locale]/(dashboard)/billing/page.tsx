import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { BillingOverview } from "@/features/billing";

interface BillingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BillingPage({
  params,
  searchParams,
}: BillingPageProps) {
  const { locale } = await params;
  const resolved = await searchParams;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const stripeSessionId =
    typeof resolved.session_id === "string" ? resolved.session_id : null;
  const stripeSuccess = resolved.stripe === "success";
  const stripeCanceled = resolved.stripe === "canceled";

  return (
    <BillingOverview
      stripeSessionId={stripeSessionId}
      stripeSuccess={stripeSuccess}
      stripeCanceled={stripeCanceled}
    />
  );
}
