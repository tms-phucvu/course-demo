import { Header } from "@/components/layout/header";
import { authOptions } from "@/core/lib";
import { getServerSession } from "next-auth";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className='bg-background relative flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>
        <div className='px-80'>{children}</div>
      </main>
    </div>
  );
}
