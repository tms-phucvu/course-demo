"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import type {
  DashboardItem,
  DashboardItemWithChildren,
  SubMenuItem,
} from "@/core/constants";
import {
  accountItems,
  dashboardItems,
  hasSubmenu,
  managementItems,
} from "@/core/constants";
import { LogoutButton } from "@/features/auth";
import { Link, usePathname } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const HOVER_CLOSE_DELAY_MS = 150;

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { state: sidebarState, isMobile, setOpenMobile } = useSidebar();
  const [openFlyoutKey, setOpenFlyoutKey] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile sheet on navigation (e.g. after clicking a sidebar link)
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  // usePathname from i18n returns path without locale (e.g. /profile, /dashboard/sales)
  const path = pathname ?? "/";
  const isActive = (href: string) => {
    if (href === "/") {
      return path === "/" || path === "";
    }
    return path === href || path.startsWith(href + "/");
  };

  const isGroupActive = (item: DashboardItemWithChildren) =>
    item.children.some((child: SubMenuItem) => isActive(child.url));

  const isCollapsed = sidebarState === "collapsed";

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = (key: string) => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenFlyoutKey((k) => (k === key ? null : k));
      closeTimeoutRef.current = null;
    }, HOVER_CLOSE_DELAY_MS);
  };

  const handleFlyoutEnter = (key: string) => {
    clearCloseTimeout();
    setOpenFlyoutKey(key);
  };

  const handleFlyoutLeave = (key: string) => {
    scheduleClose(key);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, []);

  return (
    <Sidebar collapsible='icon' className='app-sidebar bg-sidebar'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <button
                type='button'
                className='peer/menu-button ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground hover:text-foreground flex h-10 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:px-0! hover:bg-(--primary)/5 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'
              >
                <Image
                  src='/image/logo.webp'
                  alt='Logo'
                  width={30}
                  height={30}
                  className='me-1 rounded-[5px] transition-all group-data-[collapsible=icon]:me-0 group-data-[collapsible=icon]:size-8'
                />
                <span className='text-foreground font-semibold group-data-[collapsible=icon]:hidden'>
                  TOMOSIA VN
                </span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item: DashboardItem) =>
                hasSubmenu(item) ? (
                  <SidebarMenuItem key={item.name}>
                    {isCollapsed ? (
                      <DropdownMenu
                        open={openFlyoutKey === item.name}
                        onOpenChange={(open) =>
                          setOpenFlyoutKey(open ? item.name : null)
                        }
                        modal={false}
                      >
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(item.title)}
                            onMouseEnter={() => handleFlyoutEnter(item.name)}
                            onMouseLeave={() => handleFlyoutLeave(item.name)}
                            className='data-[state=open]:text-sidebar-accent-foreground hover:bg-[#E4E4E7] data-[state=open]:bg-[#E4E4E7]'
                          >
                            <item.icon />
                            <span>{t(item.title)}</span>
                            <ChevronRight className='ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side='right'
                          sideOffset={4}
                          align='start'
                          onMouseEnter={() => handleFlyoutEnter(item.name)}
                          onMouseLeave={() => handleFlyoutLeave(item.name)}
                          className='min-w-44 rounded-md border bg-[#F4F4F5]'
                        >
                          {item.children.map((sub: SubMenuItem) => (
                            <DropdownMenuItem asChild key={sub.url}>
                              <Link
                                href={sub.url}
                                className='flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#E4E4E7] focus:bg-[#E4E4E7] data-[active=true]:bg-[#E4E4E7]'
                              >
                                {t(sub.title)}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Collapsible
                        defaultOpen={isGroupActive(item)}
                        className='group/collapsible'
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(item.title)}
                            className='data-[state=open]:text-sidebar-accent-foreground hover:bg-[#E4E4E7] data-[state=open]:bg-[#E4E4E7]'
                          >
                            <item.icon />
                            <span>{t(item.title)}</span>
                            <ChevronRight className='ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((sub: SubMenuItem) => (
                              <SidebarMenuSubItem
                                key={sub.url}
                                data-active={
                                  isActive(sub.url) ? "true" : undefined
                                }
                              >
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(sub.url)}
                                >
                                  <Link href={sub.url}>{t(sub.title)}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem
                    key={item.name}
                    data-active={isActive(item.url) ? "true" : undefined}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={t(item.title)}
                      className='hover:bg-[#E4E4E7]'
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{t(item.title)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item: DashboardItem) =>
                item.disabled ? (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      disabled
                      aria-disabled
                      tooltip={t(item.title)}
                      className='pointer-events-none opacity-50 hover:bg-transparent data-[state=open]:bg-transparent'
                    >
                      <item.icon />
                      <span className='flex flex-1 items-center gap-2'>
                        {t(item.title)}
                        <span
                          className='bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium group-data-[collapsible=icon]:hidden'
                          aria-hidden
                        >
                          {t("soon")}
                        </span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : hasSubmenu(item) ? (
                  <SidebarMenuItem key={item.name}>
                    {isCollapsed ? (
                      <DropdownMenu
                        open={openFlyoutKey === item.name}
                        onOpenChange={(open) =>
                          setOpenFlyoutKey(open ? item.name : null)
                        }
                        modal={false}
                      >
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(item.title)}
                            onMouseEnter={() => handleFlyoutEnter(item.name)}
                            onMouseLeave={() => handleFlyoutLeave(item.name)}
                            className='data-[state=open]:text-sidebar-accent-foreground hover:bg-[#E4E4E7] data-[state=open]:bg-[#E4E4E7]'
                          >
                            <item.icon />
                            <span>{t(item.title)}</span>
                            <ChevronRight className='ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side='right'
                          sideOffset={4}
                          align='start'
                          onMouseEnter={() => handleFlyoutEnter(item.name)}
                          onMouseLeave={() => handleFlyoutLeave(item.name)}
                          className='min-w-44 rounded-md border bg-[#F4F4F5]'
                        >
                          {item.children.map((sub: SubMenuItem) => (
                            <DropdownMenuItem asChild key={sub.url}>
                              <Link
                                href={sub.url}
                                className='flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#E4E4E7] focus:bg-[#E4E4E7] data-[active=true]:bg-[#E4E4E7]'
                              >
                                {t(sub.title)}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Collapsible
                        defaultOpen={isGroupActive(item)}
                        className='group/collapsible'
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(item.title)}
                            className='data-[state=open]:text-sidebar-accent-foreground hover:bg-[#E4E4E7] data-[state=open]:bg-[#E4E4E7]'
                          >
                            <item.icon />
                            <span>{t(item.title)}</span>
                            <ChevronRight className='ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((sub: SubMenuItem) => (
                              <SidebarMenuSubItem
                                key={sub.url}
                                data-active={
                                  isActive(sub.url) ? "true" : undefined
                                }
                              >
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(sub.url)}
                                >
                                  <Link href={sub.url}>{t(sub.title)}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem
                    key={item.name}
                    data-active={
                      item.url
                        ? isActive(item.url)
                          ? "true"
                          : undefined
                        : undefined
                    }
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={item.url ? isActive(item.url) : false}
                      tooltip={t(item.title)}
                      className='hover:bg-[#E4E4E7] data-[active=true]:bg-gray-200 data-[active=true]:text-gray-900 dark:data-[active=true]:bg-gray-700 dark:data-[active=true]:text-gray-100'
                    >
                      <Link href={item.url ?? "#"}>
                        <item.icon />
                        <span>{t(item.title)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("apps")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item: DashboardItem) =>
                item.disabled ? (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      disabled
                      aria-disabled
                      tooltip={t(item.title)}
                      className='pointer-events-none opacity-50 hover:bg-transparent data-[state=open]:bg-transparent'
                    >
                      <item.icon />
                      <span className='flex flex-1 items-center gap-2'>
                        {t(item.title)}
                        <span
                          className='bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium group-data-[collapsible=icon]:hidden'
                          aria-hidden
                        >
                          {t("soon")}
                        </span>
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : hasSubmenu(item) ? (
                  <SidebarMenuItem key={item.name}>
                    {isCollapsed ? (
                      <DropdownMenu
                        open={openFlyoutKey === item.name}
                        onOpenChange={(open) =>
                          setOpenFlyoutKey(open ? item.name : null)
                        }
                        modal={false}
                      >
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(item.title)}
                            onMouseEnter={() => handleFlyoutEnter(item.name)}
                            onMouseLeave={() => handleFlyoutLeave(item.name)}
                            className='data-[state=open]:text-sidebar-accent-foreground hover:bg-[#E4E4E7] data-[state=open]:bg-[#E4E4E7]'
                          >
                            <item.icon />
                            <span>{t(item.title)}</span>
                            <ChevronRight className='ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side='right'
                          sideOffset={4}
                          align='start'
                          onMouseEnter={() => handleFlyoutEnter(item.name)}
                          onMouseLeave={() => handleFlyoutLeave(item.name)}
                          className='min-w-44 rounded-md border bg-[#F4F4F5]'
                        >
                          {item.children.map((sub: SubMenuItem) => (
                            <DropdownMenuItem asChild key={sub.url}>
                              <Link
                                href={sub.url}
                                className='flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-[#E4E4E7] focus:bg-[#E4E4E7] data-[active=true]:bg-[#E4E4E7]'
                              >
                                {t(sub.title)}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Collapsible
                        defaultOpen={isGroupActive(item)}
                        className='group/collapsible'
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={t(item.title)}
                            className='data-[state=open]:text-sidebar-accent-foreground hover:bg-[#E4E4E7] data-[state=open]:bg-[#E4E4E7]'
                          >
                            <item.icon />
                            <span>{t(item.title)}</span>
                            <ChevronRight className='ml-auto size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90' />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((sub: SubMenuItem) => (
                              <SidebarMenuSubItem
                                key={sub.url}
                                data-active={
                                  isActive(sub.url) ? "true" : undefined
                                }
                              >
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(sub.url)}
                                >
                                  <Link href={sub.url}>{t(sub.title)}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem
                    key={item.name}
                    data-active={
                      item.url
                        ? isActive(item.url)
                          ? "true"
                          : undefined
                        : undefined
                    }
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={item.url ? isActive(item.url) : false}
                      tooltip={t(item.title)}
                      className='hover:bg-[#E4E4E7] data-[active=true]:bg-gray-200 data-[active=true]:text-gray-900 dark:data-[active=true]:bg-gray-700 dark:data-[active=true]:text-gray-100'
                    >
                      <Link href={item.url ?? "#"}>
                        <item.icon />
                        <span>{t(item.title)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton
              variant='ghost'
              size='sm'
              className='w-full justify-start'
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
