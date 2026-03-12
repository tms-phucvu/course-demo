import { redirect } from "@/i18n/routing";

interface AdminHomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminHomePage({ params }: AdminHomePageProps) {
  const { locale } = await params;
  redirect({ href: "/admin/courses", locale });
}
