import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { UsersDashboardClient } from "@/features/user-management/components/users-dashboard-client";

interface UsersDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function UsersDashboardPage({
  params,
}: UsersDashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return <UsersDashboardClient />;
}
