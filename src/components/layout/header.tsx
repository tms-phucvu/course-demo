import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { navConfig } from "@/core/config/nav";
import { cn } from "@/core/lib";
import { UserButton } from "@/features/auth";
import { LocaleSwitcher } from "@/shared/components/locale-switcher";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className='bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-200'>
      <div className='container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8'>
        {/* Left: Logo + Desktop Nav */}
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-2.5'>
            <div className='bg-primary/10 relative overflow-hidden rounded-md p-1.5'>
              <Image
                src='/image/logo.webp'
                alt='MyDashboard Logo'
                width={24}
                height={24}
                className='h-6 w-6 object-contain'
                priority
              />
            </div>

            <span className='hidden text-lg font-semibold tracking-tight sm:inline-block'>
              TOMOSIA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className='hidden items-center gap-6 text-sm font-medium md:flex lg:gap-8'>
            {navConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "hover:text-foreground text-muted-foreground relative transition-colors",
                  "after:bg-primary after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:transition-all hover:after:w-full"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className='flex items-center gap-3 sm:gap-4'>
          <ThemeModeToggle />
          <LocaleSwitcher variantButton='ghost' />
          <UserButton />

          {/* Mobile trigger */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
