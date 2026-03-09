"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/core/lib/utils";
import type { FileCategoryStats } from "@/features/file-manage/types";
import { Link } from "@/i18n/routing";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, FileStack, FileText, Image, Video } from "lucide-react";

const CATEGORY_ICONS: Record<FileCategoryStats["key"], LucideIcon> = {
  documents: FileText,
  images: Image,
  videos: Video,
  others: FileStack,
};

const CATEGORY_BAR_COLORS: Record<FileCategoryStats["key"], string> = {
  documents: "bg-blue-500",
  images: "bg-green-500",
  videos: "bg-red-500",
  others: "bg-amber-500",
};

interface FileCategoryCardProps {
  stats: FileCategoryStats;
  title: string;
  viewMoreHref: string;
  viewMoreLabel: string;
  storageUsedLabel: string;
  updatedAtLabel: string;
}

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FileCategoryCard({
  stats,
  title,
  viewMoreHref,
  viewMoreLabel,
  storageUsedLabel,
  updatedAtLabel,
}: FileCategoryCardProps) {
  const Icon = CATEGORY_ICONS[stats.key];
  const barColor = CATEGORY_BAR_COLORS[stats.key];

  return (
    <Card
      data-slot='card'
      className='FileCategoryCard bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 pb-0'
    >
      <CardHeader className='space-y-0 pb-0'>
        <div className='flex flex-row items-center justify-between'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Icon
            className={cn(
              "size-5 shrink-0",
              stats.key === "documents" && "text-blue-500",
              stats.key === "images" && "text-green-500",
              stats.key === "videos" && "text-red-500",
              stats.key === "others" && "text-amber-500"
            )}
            aria-hidden
          />
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4 pt-0'>
        <div className='text-2xl font-bold tabular-nums'>
          {stats.count.toLocaleString()}
        </div>
        <div className='space-y-1.5'>
          <div className='bg-muted relative h-2 w-full overflow-hidden rounded-full'>
            <div
              className={cn("h-full rounded-full transition-all", barColor)}
              style={{ width: `${Math.min(100, stats.percent)}%` }}
            />
          </div>
          <div className='text-muted-foreground flex items-center justify-between text-xs'>
            <span>
              {stats.usedGb} GB {storageUsedLabel}
            </span>
            <span>{stats.percent}%</span>
          </div>
          <p className='text-muted-foreground text-xs'>
            {updatedAtLabel}: {formatUpdatedAt(stats.updatedAt)}
          </p>
        </div>
        <Link
          href={viewMoreHref}
          className='text-primary inline-flex items-center gap-1 text-sm font-medium hover:underline'
        >
          {viewMoreLabel}
          <ChevronRight className='size-4' aria-hidden />
        </Link>
      </CardContent>
    </Card>
  );
}
