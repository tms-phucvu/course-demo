import { setRequestLocale } from "next-intl/server";
import { VerificationFlow } from "@/features/identity-verification";

interface IdentityVerificationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function IdentityVerificationPage({
  params,
}: IdentityVerificationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='identity-verification-page'>
      <VerificationFlow />
    </div>
  );
}
