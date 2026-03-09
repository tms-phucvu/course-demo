"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { locales, localeFlags, localeNames, type Locale } from "@/i18n/config";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/core/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            "locale-switcher h-8 gap-1.5 border px-2.5 text-sm font-normal",
            className
          )}
          aria-label='Select language'
        >
          <span className='text-base leading-none' aria-hidden>
            {localeFlags[locale]}
          </span>
          <span className='min-w-[2ch]'>{locale.toUpperCase()}</span>
          <ChevronDown className='h-3.5 w-3.5 opacity-50' aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-40'>
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleSelect(loc)}
            className='flex cursor-pointer items-center gap-2'
          >
            <span className='text-base'>{localeFlags[loc]}</span>
            <span className='flex-1'>{localeNames[loc]}</span>
            {locale === loc ? (
              <Check className='h-4 w-4 shrink-0' aria-hidden />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
