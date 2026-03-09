"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { locales, localeFlags, localeNames, type Locale } from "@/i18n/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_AVATAR_PATH } from "@/core/constants";
import { Check, CreditCard, LogOut, Settings, Sparkles } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export function UserButton() {
  const { data: session, status } = useSession();
  const t = useTranslations("navigation");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  // Mock data
  const mockUser = {
    name: session?.user?.name || "Admin",
    email: session?.user?.email || "admin@tomosia.com",
    image: session?.user?.image ?? undefined,
  };

  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (status === "loading") {
    return <div className='bg-muted h-9 w-9 animate-pulse rounded-full' />;
  }

  if (!session?.user) {
    return (
      <Button variant='outline' size='sm' asChild>
        <Link href='/login'>{t("login")}</Link>
      </Button>
    );
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='border-input h-9 w-9 cursor-pointer rounded-full border'
        >
          <Avatar className='border-border h-9 w-9 shrink-0 overflow-hidden rounded-full border-2'>
            <AvatarImage
              src={session.user.image ?? DEFAULT_AVATAR_PATH}
              alt='Avatar'
            />
            <AvatarFallback className='bg-primary text-primary-foreground text-sm'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-80 p-0'
        sideOffset={8}
        aria-label='User menu'
      >
        {/* User Profile Section */}
        <div className='flex items-center gap-3 p-4'>
          <Avatar className='border-border h-10 w-10 shrink-0 overflow-hidden rounded-full border-2'>
            <AvatarImage
              src={session.user.image ?? DEFAULT_AVATAR_PATH}
              alt='Avatar'
            />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-semibold'>{mockUser.name}</p>
            <p className='text-muted-foreground truncate text-xs'>
              {mockUser.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup aria-label='Navigation links'>
          <div className='p-1'>
            <DropdownMenuItem asChild>
              <Link
                href='/profile/settings?tab=role'
                className='flex cursor-pointer items-center gap-2'
              >
                <Sparkles className='h-4 w-4' aria-hidden />
                <span>{t("upgradePlan")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/profile/settings'
                className='flex cursor-pointer items-center gap-2'
              >
                <Settings className='h-4 w-4' aria-hidden />
                <span>{t("account")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href='/billing'
                className='flex cursor-pointer items-center gap-2'
              >
                <CreditCard className='h-4 w-4' aria-hidden />
                <span>{t("billing")}</span>
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup aria-label='Language'>
          <DropdownMenuLabel className='text-muted-foreground px-2 py-1.5 text-xs'>
            {t("language")}
          </DropdownMenuLabel>
          <div className='p-1'>
            {locales.map((loc) => (
              <DropdownMenuItem
                key={loc}
                onClick={() => handleLocaleSelect(loc)}
                className='flex cursor-pointer items-center gap-2'
              >
                <span className='text-base' aria-hidden>
                  {localeFlags[loc]}
                </span>
                <span className='flex-1'>{localeNames[loc]}</span>
                {locale === loc ? (
                  <Check className='h-4 w-4 shrink-0' aria-hidden />
                ) : null}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <div className='p-1'>
          <DropdownMenuItem
            onClick={handleSignOut}
            className='text-destructive focus:text-destructive flex cursor-pointer items-center gap-2'
          >
            <LogOut className='h-4 w-4' aria-hidden />
            <span>{t("logout")}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
