"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_AVATAR_PATH } from "@/core/constants";
import { Role } from "@/features/auth/types";
import { Link } from "@/i18n/routing";
import { CreditCard, LogOut, Settings, Sparkles } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export function UserButton() {
  const { data: session, status } = useSession();
  const t = useTranslations("navigation");

  const User = {
    name: session?.user?.name || "Unknown",
    email: session?.user?.email || "unknown@tomosia.com",
    image: session?.user?.image ?? undefined,
    role: session?.user?.role,
  };

  const initials = User.name
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
    if (User.role === Role.ADMIN) {
      await signOut({ callbackUrl: "/admin/login" });
    } else {
      await signOut({ callbackUrl: "/login" });
    }
  }

  return (
    <DropdownMenu modal={false}>
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
            <p className='truncate text-sm font-semibold'>{User.name}</p>
            <p className='text-muted-foreground truncate text-xs'>
              {User.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup aria-label='Navigation links'>
          <div className='p-1'>
            <DropdownMenuItem asChild>
              <Link href='/' className='flex cursor-pointer items-center gap-2'>
                <Sparkles className='h-4 w-4' aria-hidden />
                <span>{t("upgradePlan")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/' className='flex cursor-pointer items-center gap-2'>
                <Settings className='h-4 w-4' aria-hidden />
                <span>{t("account")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/' className='flex cursor-pointer items-center gap-2'>
                <CreditCard className='h-4 w-4' aria-hidden />
                <span>{t("billing")}</span>
              </Link>
            </DropdownMenuItem>
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
