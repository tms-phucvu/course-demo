import { getServerSession } from "next-auth";
import { authOptions } from "@/core/lib/auth";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getProfileFromSessionUser, SettingsTabs } from "@/features/profile";

interface ProfileSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProfileSettingsPage({
  params,
}: ProfileSettingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const profile = getProfileFromSessionUser(session.user);

  return (
    <SettingsTabs
      profile={{
        name: profile.name,
        email: profile.email,
        image: profile.image,
        role: profile.role,
        phone: profile.phone,
        country: profile.country,
        website: profile.website,
        nameKanji: profile.nameKanji,
        nameKana: profile.nameKana,
        company: profile.company,
        department: profile.department,
        position: profile.position,
        postalCode: profile.postalCode,
        address: profile.address,
        birthDate: profile.birthDate,
        gender: profile.gender,
      }}
    />
  );
}
