"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { headerNavigation } from "../config/navigation";
import { DocsSearch } from "./docs-search";
import Image from "next/image";

interface DocsHeaderProps {
  onMenuToggle?: () => void;
}

export function DocsHeader({ onMenuToggle }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center">
          <Image
            src="/image/logo.webp"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:gap-6">
          {headerNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <DocsSearch />
        </div>
      </div>
    </header>
  );
}
