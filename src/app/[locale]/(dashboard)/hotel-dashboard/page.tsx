import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { HotelDashboardClient } from "@/features/hotel";

interface HotelDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HotelDashboardPage({
  params,
}: HotelDashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return <HotelDashboardClient />;
}
