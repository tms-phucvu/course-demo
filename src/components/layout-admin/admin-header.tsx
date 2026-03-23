"use client";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@/features/auth";
import { Link, usePathname } from "@/i18n";
import { LocaleSwitcher } from "@/shared";

const PATH_TITLE_MAP: Record<string, string> = {
  "/admin/users": "Users",
  "/admin/courses": "Course",
};

function getTitleFromPath(path: string): string {
  const matchedKey = Object.keys(PATH_TITLE_MAP).find((key) =>
    path.startsWith(key)
  );
  return matchedKey ? PATH_TITLE_MAP[matchedKey] : "Unknown";
}

function AdminHeader() {
  const pathname = usePathname();
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b pr-8 transition-[width,height]'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink asChild>
                <Link href='/admin'>Management</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>{getTitleFromPath(pathname)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex items-center gap-4 sm:gap-4'>
        <ThemeModeToggle />
        <LocaleSwitcher variantButton='ghost' />
        <UserButton />
      </div>
    </header>
  );
}

export default AdminHeader;
