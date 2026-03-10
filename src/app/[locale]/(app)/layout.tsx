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
        <div className='flex w-full justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-32'>
          {children}
        </div>
      </main>
    </div>
  );
}
