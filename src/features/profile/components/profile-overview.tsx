"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageLightbox, useImageLightbox } from "@/core/image-handle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/routing";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { DEFAULT_AVATAR_PATH } from "@/core/constants";
import type { Profile } from "../types";

interface ProfileOverviewProps {
  profile: Profile;
  locale: string;
}

export function ProfileOverview({ profile, locale }: ProfileOverviewProps) {
  const t = useTranslations("profile.overview");
  const { lightboxSrc, openLightbox, closeLightbox } = useImageLightbox();
  const avatarSrc = profile.image ?? DEFAULT_AVATAR_PATH;
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : (profile.email?.[0]?.toUpperCase() ?? "U");

  return (
    <div className='profile-overview space-y-4'>
      {/* Header: Profile Page + Settings button */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>{t("pageTitle")}</h1>
        <Button size='sm' asChild>
          <Link href='/profile/settings'>
            <Settings className='mr-2 h-4 w-4' />
            {t("settings")}
          </Link>
        </Button>
      </div>

      {/* User card: avatar, name, role + stats (Post, Projects, Members) */}
      <div className='flex flex-col gap-6 md:flex-row md:items-start'>
        <Card className='flex shrink-0 flex-col gap-4 p-6 md:max-w-[380px]'>
          <div className='text-center'>
            <button
              type='button'
              onClick={() => openLightbox(avatarSrc)}
              className='profile-overview-avatar border-primary focus:ring-ring mx-auto mb-4 flex h-48 w-48 cursor-pointer items-center justify-center rounded-full border-2 focus:ring-2 focus:ring-offset-2 focus:outline-none'
              aria-label='View avatar'
            >
              <Avatar className='border-border h-full w-full overflow-hidden rounded-full border-2'>
                <AvatarImage src={avatarSrc} alt={profile.name ?? "User"} />
                <AvatarFallback className='text-2xl'>{initials}</AvatarFallback>
              </Avatar>
            </button>
            <ImageLightbox
              src={lightboxSrc}
              onClose={closeLightbox}
              alt={profile.name ?? "User"}
            />
            <CardTitle>{profile.name ?? "TOMOSIA"}</CardTitle>
            <CardDescription>{profile.email ?? ""}</CardDescription>
          </div>
          <Separator />
          <CardContent className='space-y-3 p-0'>
            <div className='flex items-center gap-3'>
              <Briefcase className='text-muted-foreground h-4 w-4 shrink-0' />
              <span className='text-sm'>Admin</span>
            </div>
            <div className='flex items-center gap-3'>
              <CreditCard className='text-muted-foreground h-4 w-4 shrink-0' />
              <span className='text-sm'>{profile.plan ?? "—"}</span>
            </div>
            <div className='flex items-center gap-3'>
              <BadgeCheck className='text-muted-foreground h-4 w-4 shrink-0' />
              <span className='text-sm'>{t("verified")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact / details - fills remaining space */}
        <Card className='min-w-0 flex-1'>
          <CardHeader>
            <CardTitle>{t("accountInfo")}</CardTitle>
            <CardDescription>{t("accountInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Mail className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("email")}</p>
                <p className='text-muted-foreground truncate text-sm'>
                  {profile.email ?? "—"}
                </p>
              </div>
            </div>

            <Separator />

            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Shield className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("fullName")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.name ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <User className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("nameKanji")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.nameKanji ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <User className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("nameKana")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.nameKana ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Building2 className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("company")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.company ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Building2 className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("department")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.department ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Shield className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("position")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.position ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Phone className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("phone")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.phone ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <MapPin className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("country")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.country ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <MapPin className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("postalCode")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.postalCode ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <MapPin className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("address")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.address ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Calendar className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("birthDate")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.birthDate ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <User className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("gender")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.gender ?? "—"}
                </p>
              </div>
            </div>

            <Separator />
            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Globe className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("website")}</p>
                {profile.website ? (
                  <a
                    href={profile.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary truncate text-sm underline underline-offset-4'
                  >
                    {profile.website}
                  </a>
                ) : (
                  <p className='text-muted-foreground text-sm'>—</p>
                )}
              </div>
            </div>

            <Separator />

            <div className='flex items-center gap-4'>
              <div className='bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                <Calendar className='text-muted-foreground h-5 w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>{t("accountCreated")}</p>
                <p className='text-muted-foreground text-sm'>
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
