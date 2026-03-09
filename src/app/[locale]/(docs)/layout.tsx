"use client";

import { useState } from "react";
import {
  DocsHeader,
  DocsSidebar,
  DocsToc,
  DocsMobileSidebar,
  DocsFooter,
} from "@/features/docs";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <DocsHeader onMenuToggle={() => setSidebarOpen(true)} />

      {/* Mobile Sidebar */}
      <DocsMobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-8xl flex-1">
        {/* Left Sidebar - Desktop */}
        <DocsSidebar />

        {/* Content */}
        <main className="flex-1 px-4 py-6 lg:px-8" data-docs-content>
          <div className="mx-auto max-w-3xl">{children}</div>
        </main>

        {/* Right Sidebar - On this page */}
        <DocsToc />
      </div>

      {/* Footer */}
      <DocsFooter />
    </div>
  );
}
