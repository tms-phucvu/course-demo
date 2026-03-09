"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";
import type { FileListItem } from "@/features/file-manage/types";
import { FileUploadModal } from "@/features/file-manage/components/file-upload-modal";
import {
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Folder,
  Image,
  MoreHorizontal,
  Upload,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

const FILE_TYPE_ICONS: Record<
  NonNullable<FileListItem["fileType"]>,
  LucideIcon
> = {
  document: FileText,
  image: Image,
  video: Video,
  spreadsheet: FileSpreadsheet,
  other: FileText,
};

function slugify(name: string): string {
  return encodeURIComponent(name);
}

type SortByOption = "name" | "size" | "date";

function parseSizeToBytes(sizeStr: string): number {
  const m = sizeStr.trim().match(/^([\d.]+)\s*(KB|MB|GB)?$/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = (m[2] ?? "").toUpperCase();
  if (unit === "KB") return n * 1024;
  if (unit === "MB") return n * 1024 * 1024;
  if (unit === "GB") return n * 1024 * 1024 * 1024;
  return n;
}

function parseDateToTime(dateStr: string): number {
  const parts = dateStr.trim().split(".");
  if (parts.length !== 3) return 0;
  const [d, m, y] = parts.map((p) => parseInt(p, 10));
  if (y >= 0 && y <= 99) {
    const fullYear = y >= 50 ? 1900 + y : 2000 + y;
    return new Date(fullYear, m - 1, d).getTime();
  }
  return new Date(d, m - 1, y).getTime();
}

/** Format "DD.MM.YY" to "Mon DD, YYYY H:MM" for display */
function formatModified(dateStr: string): string {
  const t = parseDateToTime(dateStr);
  if (!t) return dateStr;
  const d = new Date(t);
  const mon = d.toLocaleString("en-US", { month: "short" });
  return `${mon} ${d.getDate()}, ${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

/** Mock created date a few days before modified */
function formatCreated(dateStr: string): string {
  const t = parseDateToTime(dateStr);
  if (!t) return dateStr;
  const d = new Date(t);
  d.setDate(d.getDate() - 7);
  const mon = d.toLocaleString("en-US", { month: "short" });
  return `${mon} ${d.getDate()}, ${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

interface FileListTableProps {
  title: string;
  uploadLabel: string;
  searchPlaceholder: string;
  sortLabel: string;
  sortByNameDesc: string;
  sortBySizeDesc: string;
  sortByDateDesc: string;
  columnName: string;
  columnUpdatedAt: string;
  columnSize: string;
  columnLastEditedBy: string;
  actionCompress: string;
  actionArchive: string;
  actionShare: string;
  actionMove: string;
  actionCopy: string;
  actionDelete: string;
  openMenuLabel: string;
  emptyState?: string;
  /** Sidebar labels */
  sidebarInfoLabel: string;
  sidebarTypeLabel: string;
  sidebarSizeLabel: string;
  sidebarOwnerLabel: string;
  sidebarLocationLabel: string;
  sidebarModifiedLabel: string;
  sidebarCreatedLabel: string;
  sidebarSettingsLabel: string;
  sidebarFileSharingLabel: string;
  sidebarBackupLabel: string;
  sidebarSyncLabel: string;
  sidebarTypeFile: string;
  sidebarTypeFolder: string;
  sidebarLocationDefault: string;
  /** Upload modal labels */
  uploadModalTitle: string;
  uploadModalDescription: string;
  uploadModalDropzoneMainLabel: string;
  uploadModalDropzoneHintLabel: string;
  uploadModalCancelLabel: string;
  uploadModalStartUploadLabel: string;
  uploadModalDoneLabel: string;
  items: FileListItem[];
}

export function FileListTable({
  title,
  uploadLabel,
  searchPlaceholder,
  sortLabel,
  sortByNameDesc,
  sortBySizeDesc,
  sortByDateDesc,
  columnName,
  columnUpdatedAt,
  columnSize,
  columnLastEditedBy,
  actionCompress,
  actionArchive,
  actionShare,
  actionMove,
  actionCopy,
  actionDelete,
  openMenuLabel,
  emptyState = "No files or folders found",
  sidebarInfoLabel,
  sidebarTypeLabel,
  sidebarSizeLabel,
  sidebarOwnerLabel,
  sidebarLocationLabel,
  sidebarModifiedLabel,
  sidebarCreatedLabel,
  sidebarSettingsLabel,
  sidebarFileSharingLabel,
  sidebarBackupLabel,
  sidebarSyncLabel,
  sidebarTypeFile,
  sidebarTypeFolder,
  sidebarLocationDefault,
  uploadModalTitle,
  uploadModalDescription,
  uploadModalDropzoneMainLabel,
  uploadModalDropzoneHintLabel,
  uploadModalCancelLabel,
  uploadModalStartUploadLabel,
  uploadModalDoneLabel,
  items,
}: FileListTableProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortByOption>("name");
  const [detailItem, setDetailItem] = useState<FileListItem | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [fileSharingOn, setFileSharingOn] = useState(true);
  const [backupOn, setBackupOn] = useState(false);
  const [syncOn, setSyncOn] = useState(false);

  const filtered = useMemo(() => {
    let list = items.filter(
      (item) =>
        !search || item.name.toLowerCase().includes(search.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      } else if (sortBy === "size") {
        cmp = parseSizeToBytes(a.size) - parseSizeToBytes(b.size);
      } else {
        cmp = parseDateToTime(a.updatedAt) - parseDateToTime(b.updatedAt);
      }
      return -cmp;
    });
    return list;
  }, [items, search, sortBy]);

  const allSelected =
    filtered.length > 0 && filtered.every((item) => selectedIds.has(item.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.add(item.id));
        return next;
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openDetail = (item: FileListItem) => {
    setDetailItem(item);
    setFileSharingOn(true);
    setBackupOn(false);
    setSyncOn(false);
  };

  return (
    <div className='FileListTable flex flex-col gap-4'>
      <div className='flex flex-row flex-wrap items-center justify-between gap-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
        <Button size='sm' onClick={() => setUploadModalOpen(true)}>
          <Upload className='size-4 shrink-0' aria-hidden />
          {uploadLabel}
        </Button>
      </div>

      <div className='flex flex-row flex-wrap items-center gap-2'>
        <div className='flex min-w-0 flex-1 items-center gap-2'>
          <Input
            type='search'
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-md'
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='text-muted-foreground min-w-[7rem] justify-between'
            >
              {sortLabel} {sortBy === "name" && sortByNameDesc}
              {sortBy === "size" && sortBySizeDesc}
              {sortBy === "date" && sortByDateDesc}
              <ChevronDown
                className='ml-1 size-4 shrink-0 opacity-50'
                aria-hidden
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setSortBy("name")}>
              {sortByNameDesc}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("size")}>
              {sortBySizeDesc}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("date")}>
              {sortByDateDesc}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12 pr-0'>
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label='Select all'
                />
              </TableHead>
              <TableHead className='w-12 pr-0'>
                <span className='sr-only'>Icon</span>
              </TableHead>
              <TableHead>{columnName}</TableHead>
              <TableHead>{columnUpdatedAt}</TableHead>
              <TableHead>{columnSize}</TableHead>
              <TableHead>{columnLastEditedBy}</TableHead>
              <TableHead className='w-12 text-right'>
                <span className='sr-only'>Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className='text-muted-foreground py-8 text-center'
                >
                  {emptyState}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const Icon = item.isFolder
                  ? Folder
                  : FILE_TYPE_ICONS[item.fileType ?? "other"];
                const iconColor = item.isFolder
                  ? "text-amber-500"
                  : item.fileType === "document"
                    ? "text-blue-500"
                    : item.fileType === "image"
                      ? "text-green-500"
                      : item.fileType === "video"
                        ? "text-red-500"
                        : item.fileType === "spreadsheet"
                          ? "text-emerald-600"
                          : "text-muted-foreground";
                return (
                  <TableRow
                    key={item.id}
                    className={`cursor-pointer ${detailItem?.id === item.id ? "bg-muted/50" : ""}`}
                    onClick={() => openDetail(item)}
                    data-state={
                      detailItem?.id === item.id ? "selected" : undefined
                    }
                  >
                    <TableCell
                      className='w-12 pr-0'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleOne(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </TableCell>
                    <TableCell className='w-12 pr-0'>
                      <Icon
                        className={`size-5 shrink-0 ${iconColor}`}
                        aria-hidden
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {item.isFolder ? (
                        <Link
                          href={`/file-manage/${slugify(item.name)}`}
                          className='font-medium hover:underline'
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <span className='font-medium'>{item.name}</span>
                      )}
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {item.updatedAt}
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {item.size}
                    </TableCell>
                    <TableCell>
                      <Avatar className='size-6'>
                        <AvatarFallback className='text-xs'>
                          {item.lastEditedByInitial ??
                            item.lastEditedBy.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell
                      className='w-12 text-right'
                      onClick={(e) => e.stopPropagation()}
                    >
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
                          <DropdownMenuItem>{actionCompress}</DropdownMenuItem>
                          <DropdownMenuItem>{actionArchive}</DropdownMenuItem>
                          <DropdownMenuItem>{actionShare}</DropdownMenuItem>
                          <DropdownMenuItem>{actionMove}</DropdownMenuItem>
                          <DropdownMenuItem>{actionCopy}</DropdownMenuItem>
                          <DropdownMenuItem className='text-destructive'>
                            {actionDelete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={!!detailItem}
        onOpenChange={(open) => !open && setDetailItem(null)}
      >
        <SheetContent
          side='right'
          className='FileListTable-sidebar w-full sm:max-w-md'
        >
          {detailItem && (
            <>
              <SheetHeader className='sr-only'>
                <SheetTitle>{detailItem.name}</SheetTitle>
              </SheetHeader>
              <div className='mt-6 flex flex-col gap-6'>
                <div className='flex flex-col items-center gap-2'>
                  <div
                    className={`flex size-16 shrink-0 items-center justify-center rounded-lg ${
                      detailItem.isFolder
                        ? "bg-amber-500 text-white"
                        : detailItem.fileType === "document"
                          ? "bg-blue-500 text-white"
                          : detailItem.fileType === "image"
                            ? "bg-green-500 text-white"
                            : detailItem.fileType === "video"
                              ? "bg-red-500 text-white"
                              : detailItem.fileType === "spreadsheet"
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {detailItem.isFolder ? (
                      <Folder className='size-8' aria-hidden />
                    ) : (
                      <span className='text-xl font-semibold'>
                        {detailItem.fileType === "spreadsheet"
                          ? "X"
                          : detailItem.fileType === "image"
                            ? "目"
                            : "Ai"}
                      </span>
                    )}
                  </div>
                  <p className='text-center font-semibold'>{detailItem.name}</p>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
                    {sidebarInfoLabel}
                  </h3>
                  <dl className='grid gap-2 text-sm'>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>
                        {sidebarTypeLabel}
                      </dt>
                      <dd>
                        {detailItem.isFolder
                          ? sidebarTypeFolder
                          : sidebarTypeFile}
                      </dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>
                        {sidebarSizeLabel}
                      </dt>
                      <dd>{detailItem.size}</dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>
                        {sidebarOwnerLabel}
                      </dt>
                      <dd>{detailItem.lastEditedBy}</dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>
                        {sidebarLocationLabel}
                      </dt>
                      <dd>{sidebarLocationDefault}</dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>
                        {sidebarModifiedLabel}
                      </dt>
                      <dd>{formatModified(detailItem.updatedAt)}</dd>
                    </div>
                    <div className='flex justify-between'>
                      <dt className='text-muted-foreground'>
                        {sidebarCreatedLabel}
                      </dt>
                      <dd>{formatCreated(detailItem.updatedAt)}</dd>
                    </div>
                  </dl>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-muted-foreground text-sm font-semibold tracking-wide uppercase'>
                    {sidebarSettingsLabel}
                  </h3>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='file-sharing' className='text-sm'>
                      {sidebarFileSharingLabel}
                    </label>
                    <Switch
                      id='file-sharing'
                      checked={fileSharingOn}
                      onCheckedChange={setFileSharingOn}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='backup' className='text-sm'>
                      {sidebarBackupLabel}
                    </label>
                    <Switch
                      id='backup'
                      checked={backupOn}
                      onCheckedChange={setBackupOn}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <label htmlFor='sync' className='text-sm'>
                      {sidebarSyncLabel}
                    </label>
                    <Switch
                      id='sync'
                      checked={syncOn}
                      onCheckedChange={setSyncOn}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <FileUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        title={uploadModalTitle}
        description={uploadModalDescription}
        dropzoneMainLabel={uploadModalDropzoneMainLabel}
        dropzoneHintLabel={uploadModalDropzoneHintLabel}
        cancelButtonLabel={uploadModalCancelLabel}
        startUploadButtonLabel={uploadModalStartUploadLabel}
        doneButtonLabel={uploadModalDoneLabel}
      />
    </div>
  );
}
