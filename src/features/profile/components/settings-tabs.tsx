"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/core/lib/utils";
import type { SettingsTabId } from "../types";
import { EditProfileForm } from "./edit-profile-form";
import { ChangeAvatarSection } from "./change-avatar-section";
import { ChangePasswordForm } from "./change-password-form";
import { SecuritySettings } from "./security-settings";
import { RolePermissionUpgrade } from "./role-permission-upgrade";

const TABS: { id: SettingsTabId; labelKey: string }[] = [
  { id: "edit", labelKey: "tabs.editProfile" },
  { id: "avatar", labelKey: "tabs.changeAvatar" },
  { id: "password", labelKey: "tabs.changePassword" },
  { id: "security", labelKey: "tabs.security" },
  { id: "role", labelKey: "tabs.rolePermissionUpgrade" },
];

function isValidTab(id: string): id is SettingsTabId {
  return TABS.some((t) => t.id === id);
}

interface SettingsTabsProps {
  profile: {
    name: string | null;
    email: string | null;
    image: string | null;
    role?: string | null;
    phone?: string | null;
    country?: string | null;
    website?: string | null;
    nameKanji?: string | null;
    nameKana?: string | null;
    company?: string | null;
    department?: string | null;
    position?: string | null;
    postalCode?: string | null;
    address?: string | null;
    birthDate?: string | null;
    gender?: string | null;
  };
}

export function SettingsTabs({ profile }: SettingsTabsProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const currentTab: SettingsTabId = isValidTab(tab ?? "")
    ? (tab as SettingsTabId)
    : "edit";
  const t = useTranslations("profile.settings");

  return (
    <div className='settings-tabs space-y-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t("title")}</h1>
        <p className='text-muted-foreground'>{t("description")}</p>
      </div>

      <div className='flex flex-wrap gap-1 border-b'>
        {TABS.map(({ id, labelKey }) => (
          <Button
            key={id}
            variant='ghost'
            size='sm'
            className={cn(
              "rounded-b-none border-b-2 border-transparent",
              currentTab === id && "border-primary"
            )}
            asChild
          >
            <Link href={`/profile/settings?tab=${id}`}>{t(labelKey)}</Link>
          </Button>
        ))}
      </div>

      <div className='min-h-[200px]'>
        {currentTab === "edit" && (
          <EditProfileForm
            defaultValues={{
              name: profile.name ?? "",
              nameKanji: profile.nameKanji ?? "",
              nameKana: profile.nameKana ?? "",
              phone: profile.phone ?? "",
              country: profile.country ?? "",
              website: profile.website ?? "",
              role: profile.role ?? "",
              company: profile.company ?? "",
              department: profile.department ?? "",
              position: profile.position ?? "",
              postalCode: profile.postalCode ?? "",
              address: profile.address ?? "",
              birthDate: profile.birthDate ?? "",
              gender: profile.gender ?? "",
            }}
          />
        )}
        {currentTab === "avatar" && (
          <ChangeAvatarSection currentImageUrl={profile.image ?? undefined} />
        )}
        {currentTab === "password" && <ChangePasswordForm />}
        {currentTab === "security" && <SecuritySettings />}
        {currentTab === "role" && <RolePermissionUpgrade />}
      </div>
    </div>
  );
}
