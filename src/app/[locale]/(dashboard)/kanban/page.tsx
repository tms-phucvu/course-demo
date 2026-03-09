import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { KanbanPageClient } from "@/features/kanban/kanban-page-client";

interface KanbanPageProps {
  params: Promise<{ locale: string }>;
}

export default async function KanbanPage({ params }: KanbanPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return <KanbanPageClient />;
}
