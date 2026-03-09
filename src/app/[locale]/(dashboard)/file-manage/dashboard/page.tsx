import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FileManageDashboard } from "@/features/file-manage";

interface FileManageDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FileManageDashboardPage({
  params,
}: FileManageDashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return <FileManageDashboard />;
}
