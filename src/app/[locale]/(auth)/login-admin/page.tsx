import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

interface AdminLoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminLoginPage({ params }: AdminLoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LoginPageContent />;
}

function LoginPageContent() {
  const t = useTranslations("auth.login");

  return (
    <Card className='mx-auto w-96'>
      <CardHeader>
        <CardTitle className='text-2xl'>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <AdminLoginForm />
      </CardContent>
    </Card>
  );
}
