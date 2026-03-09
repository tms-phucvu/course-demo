"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { RecentFileItem } from "@/features/file-manage/types";
import {
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Image,
  MoreHorizontal,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const TYPE_ICONS: Record<RecentFileItem["type"], LucideIcon> = {
  document: FileText,
  image: Image,
  video: Video,
  spreadsheet: FileSpreadsheet,
  other: FileText,
};

interface RecentlyUploadedFilesCardProps {
  title: string;
  viewAllLabel: string;
  viewAllHref: string;
  nameColumnLabel: string;
  sizeColumnLabel: string;
  uploadDateColumnLabel: string;
  actionsColumnLabel: string;
  openMenuLabel: string;
  files: RecentFileItem[];
}

export function RecentlyUploadedFilesCard({
  title,
  viewAllLabel,
  viewAllHref,
  nameColumnLabel,
  sizeColumnLabel,
  uploadDateColumnLabel,
  actionsColumnLabel,
  openMenuLabel,
  files,
}: RecentlyUploadedFilesCardProps) {
  const t = useTranslations("fileManage.dashboard");
  return (
    <Card
      data-slot='card'
      className='RecentlyUploadedFilesCard bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6'
    >
      <CardHeader className='space-y-0 pb-0'>
        <div className='flex flex-row items-center justify-between gap-2'>
          <CardTitle className='text-base font-medium'>{title}</CardTitle>
          <Button variant='ghost' size='sm' asChild>
            <Link href={viewAllHref} className='inline-flex items-center gap-1'>
              {viewAllLabel}
              <ChevronRight className='size-4' aria-hidden />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className='overflow-hidden pt-0'>
        {files.length === 0 ? (
          <p className='text-muted-foreground py-6 text-center text-sm'>
            {t("noFilesYet")}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{nameColumnLabel}</TableHead>
                <TableHead>{sizeColumnLabel}</TableHead>
                <TableHead>{uploadDateColumnLabel}</TableHead>
                <TableHead className='w-12 text-right'>
                  {actionsColumnLabel}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => {
                const Icon = TYPE_ICONS[file.type];
                return (
                  <TableRow key={file.name}>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Icon
                          className='text-muted-foreground size-4 shrink-0'
                          aria-hidden
                        />
                        <span className='truncate font-medium'>
                          {file.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {file.size}
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {file.uploadDate}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8'
                            aria-label={openMenuLabel}
                          >
                            <MoreHorizontal className='size-4' aria-hidden />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>{t("download")}</DropdownMenuItem>
                          <DropdownMenuItem>{t("share")}</DropdownMenuItem>
                          <DropdownMenuItem className='text-destructive'>
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
