"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navConfig } from "@/core/config/nav";
import { cn } from "@/core/lib";
import { Aperture, Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-muted/60 rounded-full md:hidden'
        >
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side='right'
        className='from-background to-background/95 w-[85%] bg-linear-to-b pr-0 sm:w-95'
      >
        <SheetHeader className='mb-6 border-b pb-4'>
          <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
          <SheetDescription className='sr-only'>
            Main navigation links and user actions
          </SheetDescription>

          <Link
            href='/'
            className='flex items-center gap-2.5'
            onClick={() => setOpen(false)}
          >
            <div className='bg-primary/10 rounded-md p-1.5'>
              <Aperture className='text-primary h-6 w-6' strokeWidth={2.2} />
            </div>
            <span className='text-xl font-semibold tracking-tight'>
              MyDashboard
            </span>
          </Link>
        </SheetHeader>

        <div className='flex flex-col gap-2 py-2'>
          {navConfig.mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center rounded-lg px-4 py-3 text-base font-medium",
                "text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors",
                "focus-visible:bg-muted/70 focus-visible:ring-primary/40 focus-visible:ring-2 focus-visible:outline-none"
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
