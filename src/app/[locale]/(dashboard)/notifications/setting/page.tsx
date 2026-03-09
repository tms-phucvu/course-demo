import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NotificationSettings } from "@/features/notifications";

interface NotificationSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NotificationSettingsPage({
  params,
}: NotificationSettingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return <NotificationSettings />;
}
