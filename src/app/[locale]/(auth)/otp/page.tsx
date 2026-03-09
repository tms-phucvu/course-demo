import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OtpForm } from "@/features/auth";

interface OtpPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OtpPage({ params }: OtpPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OtpPageContent />;
}

function OtpPageContent() {
  const t = useTranslations("auth.otp");

  return (
    <Card className="mx-auto w-96">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <OtpForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
