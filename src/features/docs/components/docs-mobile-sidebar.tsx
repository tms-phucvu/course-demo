"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/core/lib/utils";
import { docsNavigation, type NavItem, type NavSection } from "../config/navigation";

interface DocsMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileNavItem({
  item,
  depth = 0,
  onClose,
}: {
  item: NavItem;
  depth?: number;
  onClose: () => void;
}) {
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
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
            depth > 0 && "ml-4"
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
            {item.children!.map((child) => (
              <MobileNavItem
                key={child.title}
                item={child}
                depth={depth + 1}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || "#"}
      onClick={onClose}
      className={cn(
        "block rounded-md px-3 py-2 text-sm transition-colors",
        depth > 0 && "ml-4 border-l pl-4",
        isActive
          ? "bg-accent font-medium text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {item.title}
    </Link>
  );
}

function MobileNavSection({
  section,
  onClose,
}: {
  section: NavSection;
  onClose: () => void;
}) {
  return (
    <div className="pb-4">
      <h4 className="mb-2 px-3 text-sm font-semibold">{section.title}</h4>
      <div className="space-y-1">
        {section.items.map((item) => (
          <MobileNavItem key={item.title} item={item} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}

export function DocsMobileSidebar({ isOpen, onClose }: DocsMobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 border-r bg-background p-6 shadow-lg lg:hidden">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-lg">Documentation</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          <div className="space-y-4">
            {docsNavigation.map((section) => (
              <MobileNavSection
                key={section.title}
                section={section}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
