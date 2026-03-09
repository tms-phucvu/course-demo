import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { HotelBookingClient } from "@/features/hotel";

interface HotelBookingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HotelBookingPage({
  params,
}: HotelBookingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return <HotelBookingClient />;
}
