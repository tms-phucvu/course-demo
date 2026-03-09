"use client";

import { cn } from "@/core/lib/utils";
import { NavItem, NavSection, docsNavigation } from "@/features/docs";
import { Link, usePathname } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

interface DocsSidebarProps {
  className?: string;
}

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === pathname;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent",
            depth > 0 && "ml-3"
          )}
        >
          <span>{item.title}</span>
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90"
            )}
          />
        </button>
        {isOpen && (
          <div className="mt-1">
            {item.children!.map((child: NavItem) => (
              <NavItemComponent key={child.title} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "block rounded-md px-2 py-1.5 text-sm transition-colors",
        depth > 0 && "ml-3 border-l pl-4",
        isActive
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {item.title}
    </Link>
  );
}

function NavSectionComponent({ section }: { section: NavSection }) {
  return (
    <div className="pb-4">
      <h4 className="mb-1 px-2 text-sm font-semibold">{section.title}</h4>
      <div className="space-y-1">
        {section.items.map((item: NavItem) => (
          <NavItemComponent key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}

export function DocsSidebar({ className }: DocsSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r py-6 pr-2 lg:sticky lg:block",
        className
      )}
    >
      <div className="space-y-4 pl-4">
        {docsNavigation.map((section: NavSection) => (
          <NavSectionComponent key={section.title} section={section} />
        ))}
      </div>
    </aside>
  );
}
