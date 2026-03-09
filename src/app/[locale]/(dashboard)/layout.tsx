"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NotificationButton } from "@/features/notifications";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getBreadcrumb } from "@/core/constants";
import { UserButton } from "@/features/auth";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = getBreadcrumb(pathname);
  const t = useTranslations("nav");

  return (
    <div className='w-full max-w-full min-w-0 overflow-x-hidden'>
      <SidebarProvider className='max-w-full min-w-0'>
        <AppSidebar />
        <SidebarInset className='max-w-full min-w-0'>
          <header className='bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.length === 0 ? (
                  <BreadcrumbItem>
                    <BreadcrumbPage>{t("dashboard")}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  segments.map((seg, i) => (
                    <React.Fragment key={seg.href + i}>
                      {i > 0 && (
                        <BreadcrumbSeparator className='hidden md:block' />
                      )}
                      <BreadcrumbItem
                        className={
                          i === segments.length - 1 ? "" : "hidden md:block"
                        }
                      >
                        {i < segments.length - 1 ? (
                          <BreadcrumbLink href={seg.href} asChild>
                            <Link href={seg.href}>{t(seg.labelKey)}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{t(seg.labelKey)}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))
                )}
              </BreadcrumbList>
            </Breadcrumb>
            <div className='ml-auto flex items-center gap-2'>
              <ThemeSwitcher />
              <ThemeModeToggle />
              <NotificationButton />
              <Separator
                orientation='vertical'
                className='mx-2 data-[orientation=vertical]:h-4'
              />
              <UserButton />
            </div>
          </header>
          <div className='min-h-0 min-w-0 flex-1 overflow-auto'>
            <div className='flex flex-col gap-4 p-4 lg:p-6'>{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
